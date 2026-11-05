import mapboxgl, {
  type CustomLayerInterface,
  type Map as MapboxMap
} from "mapbox-gl"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

export const STUDIO_GLB_LAYER_ID = "studio-assets-glb"

const DEGREES_TO_RADIANS = Math.PI / 180
const GLTF_Y_UP_TO_Z_UP = Math.PI / 2
const ELEVATION_EPSILON_METERS = 0.05

export type StudioGlbPlacement = {
  readonly id: string
  readonly url: string
  readonly longitude: number
  readonly latitude: number
  /** Meters above the rendered terrain surface (0 = sitting on the ground). */
  readonly altitude: number
  readonly scale: number
  /** Degrees. Index 1 is the heading (rotation around the model's up axis). */
  readonly rotation: readonly [number, number, number]
}

type PlacementNode = {
  readonly placement: StudioGlbPlacement
  readonly root: THREE.Object3D
  terrainElevation: number
}

/**
 * Renders project GLB placements with Three.js (Mapbox native model loader
 * rejects many valid commercial GLBs with bufferView errors).
 *
 * Scene space is east/north/up in meters around a mercator origin; the
 * mercator conversion is folded into the camera matrix (computed in float64
 * on the CPU) so models stay precise at high zoom. Each node is lifted by the
 * terrain elevation at its anchor and re-checked when the map goes idle,
 * because DEM tiles load lazily.
 */
export class StudioGlbCustomLayer implements CustomLayerInterface {
  public readonly id = STUDIO_GLB_LAYER_ID
  public readonly type = "custom" as const
  public readonly renderingMode = "3d" as const

  private map: MapboxMap | null = null
  private camera = new THREE.Camera()
  private scene = new THREE.Scene()
  private renderer: THREE.WebGLRenderer | null = null
  private readonly loader = new GLTFLoader()
  private readonly cache = new globalThis.Map<
    string,
    Promise<THREE.Object3D>
  >()
  private nodes: PlacementNode[] = []
  private origin: mapboxgl.MercatorCoordinate | null = null
  private originMetersScale = 1
  private visible = true
  private syncVersion = 0
  private readonly handleIdle = (): void => this.refreshTerrainElevations()

  public onAdd(map: MapboxMap, gl: WebGL2RenderingContext): void {
    this.map = map
    this.camera = new THREE.Camera()
    this.scene = new THREE.Scene()
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a93a3, 1.3))
    const sun = new THREE.DirectionalLight(0xffffff, 2.0)
    sun.position.set(60, -40, 100)
    this.scene.add(sun)
    const fill = new THREE.DirectionalLight(0xffffff, 0.6)
    fill.position.set(-60, 50, 60)
    this.scene.add(fill)
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      // Three's typings only declare WebGL1; it fully supports the WebGL2 context Mapbox hands over.
      context: gl as unknown as WebGLRenderingContext,
      antialias: true
    })
    this.renderer.autoClear = false
    map.on("idle", this.handleIdle)
  }

  public onRemove(): void {
    this.map?.off("idle", this.handleIdle)
    this.detachNodes()
    this.renderer = null
    this.map = null
  }

  public render(_gl: WebGL2RenderingContext, matrix: number[]): void {
    if (!this.renderer || !this.visible || !this.origin) return
    if (this.nodes.length === 0) return
    const scale = this.originMetersScale
    const originToClip = new THREE.Matrix4().fromArray(matrix)
    const enuToMercator = new THREE.Matrix4()
      .makeTranslation(this.origin.x, this.origin.y, this.origin.z ?? 0)
      .scale(new THREE.Vector3(scale, -scale, scale))
    this.camera.projectionMatrix = originToClip.multiply(enuToMercator)
    this.renderer.resetState()
    this.renderer.render(this.scene, this.camera)
  }

  public setVisible(visible: boolean): void {
    this.visible = visible
    this.map?.triggerRepaint()
  }

  public async syncPlacements(
    placements: readonly StudioGlbPlacement[]
  ): Promise<void> {
    const version = ++this.syncVersion
    this.detachNodes()
    this.setOrigin(placements[0])
    await Promise.all(
      placements.map((placement) => this.attachPlacement(placement, version))
    )
    this.map?.triggerRepaint()
  }

  private async attachPlacement(
    placement: StudioGlbPlacement,
    version: number
  ): Promise<void> {
    try {
      const template = await this.loadTemplate(placement.url)
      if (version !== this.syncVersion) return
      const root = template.clone(true)
      root.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) child.frustumCulled = false
      })
      const node: PlacementNode = { placement, root, terrainElevation: 0 }
      this.applyPlacementTransform(node)
      this.scene.add(root)
      this.nodes.push(node)
    } catch (error) {
      console.warn(`[studio-glb] failed to load ${placement.url}`, error)
    }
  }

  private setOrigin(anchor: StudioGlbPlacement | undefined): void {
    if (!anchor) {
      this.origin = null
      return
    }
    this.origin = mapboxgl.MercatorCoordinate.fromLngLat(
      [anchor.longitude, anchor.latitude],
      0
    )
    this.originMetersScale = this.origin.meterInMercatorCoordinateUnits()
  }

  private queryTerrainElevation(placement: StudioGlbPlacement): number {
    const elevation = this.map?.queryTerrainElevation(
      [placement.longitude, placement.latitude],
      { exaggerated: true }
    )
    return typeof elevation === "number" && Number.isFinite(elevation)
      ? elevation
      : 0
  }

  private applyPlacementTransform(node: PlacementNode): void {
    if (!this.origin) return
    const { placement, root } = node
    const mercator = mapboxgl.MercatorCoordinate.fromLngLat(
      [placement.longitude, placement.latitude],
      0
    )
    const east = (mercator.x - this.origin.x) / this.originMetersScale
    const north = -(mercator.y - this.origin.y) / this.originMetersScale
    node.terrainElevation = this.queryTerrainElevation(placement)
    root.position.set(east, north, node.terrainElevation + placement.altitude)
    root.scale.setScalar(placement.scale)
    root.rotation.set(
      GLTF_Y_UP_TO_Z_UP + placement.rotation[0] * DEGREES_TO_RADIANS,
      placement.rotation[1] * DEGREES_TO_RADIANS,
      placement.rotation[2] * DEGREES_TO_RADIANS,
      "XYZ"
    )
  }

  private refreshTerrainElevations(): void {
    const stale = this.nodes.filter(
      (node) =>
        Math.abs(this.queryTerrainElevation(node.placement) - node.terrainElevation) >
        ELEVATION_EPSILON_METERS
    )
    if (stale.length === 0) return
    stale.forEach((node) => this.applyPlacementTransform(node))
    this.map?.triggerRepaint()
  }

  private loadTemplate(url: string): Promise<THREE.Object3D> {
    const cached = this.cache.get(url)
    if (cached) return cached
    const pending = new Promise<THREE.Object3D>((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => resolve(gltf.scene),
        undefined,
        (error) => reject(error)
      )
    })
    this.cache.set(url, pending)
    return pending
  }

  /** Clones share geometry/materials with the cached template, so only detach. */
  private detachNodes(): void {
    this.nodes.forEach((node) => this.scene.remove(node.root))
    this.nodes = []
  }
}

export function ensureStudioGlbLayer(
  map: MapboxMap,
  existingLayer: StudioGlbCustomLayer | null
): StudioGlbCustomLayer {
  // After map.setStyle the custom layer is gone even if our ref still points at it.
  if (existingLayer && map.getLayer(STUDIO_GLB_LAYER_ID)) {
    return existingLayer
  }
  if (map.getLayer(STUDIO_GLB_LAYER_ID)) {
    try {
      map.removeLayer(STUDIO_GLB_LAYER_ID)
    } catch {
      // ignore
    }
  }
  const layer = new StudioGlbCustomLayer()
  map.addLayer(layer)
  return layer
}
