import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react"
import { Alert, Box } from "@mui/material"
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl"
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css"
import "mapbox-gl/dist/mapbox-gl.css"
import * as turf from "@turf/turf"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { fetchLotsMapThunk } from "../../lot-inventory/slice/lot-inventory.slice"
import {
  createLocationThunk,
  setActiveToolAct,
  setMapCameraAct,
  setPendingAssetPositionAct,
  setPlacingAssetIdAct,
  setSelectionAct,
  updateAssetThunk,
  updateLocationThunk,
  updateProjectLatLngThunk
} from "../slice/project-3d-studio.slice"
import {
  computeBounds,
  disableMap3d,
  enableMap3d,
  ensureLotsLayers,
  LOTS_FLAT_FILL_LAYER_ID,
  LOTS_FILL_LAYER_ID,
  LOTS_LINE_LAYER_ID,
  LOTS_SOURCE_ID,
  resolveTerrainExaggeration
} from "../../lot-inventory/utils/lot-map-layers.util"
import type { LotMapGeoJson } from "../../lot-inventory/types/lot-inventory.types"
import { lotInventoryStrings as lotS } from "../../../../i18n/locales/lot-inventory.strings"
import { getLocationLngLat } from "../utils/location-lng-lat.util"
import { buildExperienceAssetUrl } from "../utils/experience-asset-url.util"
import {
  playCameraMotion,
  tourTurnFromBearings,
  type TourTurn
} from "@omega/project-experience"
import {
  ensureStudioGlbLayer,
  STUDIO_GLB_LAYER_ID,
  type StudioGlbCustomLayer,
  type StudioGlbPlacement
} from "../utils/studio-glb-custom-layer.util"
import type { ExperienceAssetType } from "../types/project-experience.types"
import { applyStudioRoadLayers } from "../utils/mapbox-road-layers.util"
import {
  resolveMapStyleUrl,
  setBuildings3dEnabled,
  setMapFogEnabled
} from "../utils/mapbox-map-presets.util"

const LOC_SOURCE = "studio-locations"
const LOC_POINT_LAYER = "studio-locations-point"
const LOC_LINE_LAYER = "studio-locations-line"
const LOC_FILL_LAYER = "studio-locations-fill"
const ASSET_SOURCE = "studio-assets"
const ASSET_LAYER = "studio-assets-point"
const ASSET_LABEL_LAYER = "studio-assets-label"
const RADIUS_SOURCE = "studio-discover-radius"
const RADIUS_LAYER = "studio-discover-radius-fill"
const LIVE_SOURCE = "studio-live-preview"
const LIVE_LAYER = "studio-live-preview-point"
const PROJECT_SOURCE = "studio-project-pin"
const PROJECT_LAYER = "studio-project-pin-point"
const PROJECT_HALO_LAYER = "studio-project-pin-halo"
const CATEGORY_FALLBACK_COLORS = [
  "#38BDF8",
  "#F59E0B",
  "#22C55E",
  "#F43F5E",
  "#A78BFA",
  "#14B8A6"
] as const

function categoryDotColor(
  categories: readonly { key: string; color?: string }[],
  categoryKey: string
): string {
  const chosen = categories.find((row) => row.key === categoryKey)?.color ?? ""
  if (/^#[0-9A-Fa-f]{6}$/.test(chosen)) return chosen.toUpperCase()
  let hash = 0
  const key = categoryKey || "other"
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0
  }
  return CATEGORY_FALLBACK_COLORS[hash % CATEGORY_FALLBACK_COLORS.length]
}

function resolveMapboxToken(): string {
  return (
    (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined)?.trim() ??
    ""
  )
}

function buildStudioGlbPlacements(
  assets: readonly ExperienceAssetType[]
): StudioGlbPlacement[] {
  return assets
    .filter((asset) => asset.type === "model_3d" && asset.fileName)
    .filter((asset) => asset.visible !== false)
    .map((asset) => {
      const rotation = asset.transform?.rotation ?? [0, 0, 0]
      return {
        id: asset._id,
        url: buildExperienceAssetUrl(asset.fileName),
        longitude: Number(asset.position.longitude),
        latitude: Number(asset.position.latitude),
        altitude: Number(asset.position.altitude) || 0,
        scale: Math.max(Number(asset.transform?.scale) || 1, 0.01),
        rotation: [
          Number(rotation[0]) || 0,
          Number(rotation[1]) || 0,
          Number(rotation[2]) || 0
        ] as [number, number, number]
      }
    })
    .filter((row) => Boolean(row.url))
}

function resyncStudioGlbLayer(params: {
  map: Map
  layerRef: React.MutableRefObject<StudioGlbCustomLayer | null>
  assets: readonly ExperienceAssetType[]
  modelsVisible: boolean
}): void {
  const { map, layerRef, assets, modelsVisible } = params
  if (map.getLayer("studio-assets-model")) {
    try {
      map.removeLayer("studio-assets-model")
    } catch {
      // ignore legacy native model layer
    }
  }
  const glbLayer = ensureStudioGlbLayer(map, layerRef.current)
  layerRef.current = glbLayer
  glbLayer.setVisible(modelsVisible)
  void glbLayer.syncPlacements(buildStudioGlbPlacements(assets)).then(() => {
    try {
      if (map.getLayer(STUDIO_GLB_LAYER_ID)) {
        map.moveLayer(STUDIO_GLB_LAYER_ID)
      }
    } catch {
      // ignore
    }
    map.triggerRepaint()
  })
}

export type StudioMapHandle = {
  flyToScene: (sceneId: string, turn?: TourTurn) => void
  cancelSceneMotion: () => void
  flyToLocation: (locationId: string) => void
  setPitchPreset: (mode: "3d" | "flat") => void
  getCamera: () => {
    longitude: number
    latitude: number
    zoom: number
    pitch: number
    bearing: number
  } | null
}

type Props = {
  projectId: string
}

const StudioMapCP = forwardRef<StudioMapHandle, Props>(function StudioMapCP(
  { projectId },
  ref
) {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const glbLayerRef = useRef<StudioGlbCustomLayer | null>(null)
  const drawRef = useRef<MapboxDraw | null>(null)
  const accessToken = resolveMapboxToken()
  const {
    experience,
    projectLatLng,
    locations,
    assets,
    activeTool,
    discoverRadiusMeters,
    activePanel,
    selection,
    placingAssetId,
    relocatingLocationId,
    livePreviewCandidates,
    previewMode
  } = useAppSelector((state: RootState) => state.project3dStudio)
  const selectionRef = useRef(selection)
  selectionRef.current = selection
  const placingAssetIdRef = useRef(placingAssetId)
  placingAssetIdRef.current = placingAssetId
  const relocatingLocationIdRef = useRef(relocatingLocationId)
  relocatingLocationIdRef.current = relocatingLocationId
  const assetsRef = useRef(assets)
  assetsRef.current = assets
  const mapPaint = useAppSelector(
    (state: RootState) => state.lotInventory.mapPaint
  )
  const [mapEpoch, setMapEpoch] = useState(0)
  const activeToolRef = useRef(activeTool)
  activeToolRef.current = activeTool
  const projectLatLngRef = useRef(projectLatLng)
  projectLatLngRef.current = projectLatLng
  const mapPaintRef = useRef(mapPaint)
  mapPaintRef.current = mapPaint
  const lotsVisibleRef = useRef(experience?.layers.lots !== false)
  lotsVisibleRef.current = experience?.layers.lots !== false
  const roadsVisibleRef = useRef(experience?.layers.roads !== false)
  roadsVisibleRef.current = experience?.layers.roads !== false
  const roadsStyleRef = useRef(experience?.settings.roadsStyle)
  roadsStyleRef.current = experience?.settings.roadsStyle
  const terrainEnabledRef = useRef(experience?.settings.terrainEnabled !== false)
  terrainEnabledRef.current = experience?.settings.terrainEnabled !== false
  const terrainExaggerationRef = useRef(
    resolveTerrainExaggeration(experience?.settings.terrainExaggeration)
  )
  terrainExaggerationRef.current = resolveTerrainExaggeration(
    experience?.settings.terrainExaggeration
  )
  const buildings3dRef = useRef(experience?.settings.buildings3DEnabled === true)
  buildings3dRef.current = experience?.settings.buildings3DEnabled === true
  const fogEnabledRef = useRef(experience?.settings.fogEnabled !== false)
  fogEnabledRef.current = experience?.settings.fogEnabled !== false
  const models3dVisibleRef = useRef(experience?.layers.models3D !== false)
  models3dVisibleRef.current = experience?.layers.models3D !== false
  const appliedStyleUrlRef = useRef<string | null>(null)
  const sceneMotionAbortRef = useRef<AbortController | null>(null)
  const pendingCameraRestoreRef = useRef<{
    center: { lng: number; lat: number }
    zoom: number
    pitch: number
    bearing: number
  } | null>(null)

  const hydrateLotsLayers = (map: Map) => {
    ensureLotsLayers(map, "3d")
    const source = map.getSource(LOTS_SOURCE_ID) as GeoJSONSource | undefined
    const geojson = mapPaintRef.current?.geojson
    if (source && geojson) {
      source.setData(geojson as LotMapGeoJson)
    }
    const lotsVisible = lotsVisibleRef.current ? "visible" : "none"
    ;[
      LOTS_FLAT_FILL_LAYER_ID,
      LOTS_FILL_LAYER_ID,
      LOTS_LINE_LAYER_ID
    ].forEach((layerId) => {
      if (!map.getLayer(layerId)) return
      map.setLayoutProperty(layerId, "visibility", lotsVisible)
    })
    // Keep lots above basemap/buildings so they stay visible in studio.
    ;[
      LOTS_FLAT_FILL_LAYER_ID,
      LOTS_FILL_LAYER_ID,
      LOTS_LINE_LAYER_ID
    ].forEach((layerId) => {
      if (!map.getLayer(layerId)) return
      try {
        map.moveLayer(layerId)
      } catch {
        // Layer may already be at top.
      }
    })
    ;[
      LOC_FILL_LAYER,
      LOC_LINE_LAYER,
      LOC_POINT_LAYER,
      ASSET_LAYER,
      ASSET_LABEL_LAYER,
      STUDIO_GLB_LAYER_ID,
      LIVE_LAYER,
      PROJECT_HALO_LAYER,
      PROJECT_LAYER
    ].forEach((layerId) => {
      if (!map.getLayer(layerId)) return
      try {
        map.moveLayer(layerId)
      } catch {
        // Overlay may not be mounted yet.
      }
    })
  }

  useEffect(() => {
    void dispatch(fetchLotsMapThunk(projectId))
  }, [dispatch, projectId])

  const amenityCategories = experience?.amenityCategories
  const locationsGeoJson = useMemo(() => {
    const categories = amenityCategories ?? []
    return {
      type: "FeatureCollection" as const,
      features: locations.map((loc) => ({
        type: "Feature" as const,
        id: loc._id,
        properties: {
          id: loc._id,
          name: loc.name,
          category: loc.category,
          categoryKey: loc.categoryKey ?? "",
          color: categoryDotColor(categories, loc.categoryKey ?? ""),
          importance: loc.importance,
          isVisible: loc.isVisible
        },
        geometry: loc.geometry
      }))
    }
  }, [amenityCategories, locations])

  const assetsGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: assets
        .filter((asset) => {
          if (asset.visible === false) return false
          const longitude = Number(asset.position?.longitude)
          const latitude = Number(asset.position?.latitude)
          return Number.isFinite(longitude) && Number.isFinite(latitude)
        })
        .map((asset) => {
          const scale = Math.max(Number(asset.transform?.scale) || 1, 0.01)
          const rotation = asset.transform?.rotation ?? [0, 0, 0]
          const altitude = Number(asset.position?.altitude) || 0
          return {
            type: "Feature" as const,
            id: asset._id,
            properties: {
              id: asset._id,
              name: asset.name,
              type: asset.type,
              scale,
              rotX: Number(rotation[0]) || 0,
              rotY: Number(rotation[1]) || 0,
              rotZ: Number(rotation[2]) || 0,
              altitude
            },
            geometry: {
              type: "Point" as const,
              coordinates: [
                Number(asset.position.longitude),
                Number(asset.position.latitude)
              ]
            }
          }
        })
    }
  }, [assets])

  const livePreviewGeoJson = useMemo(() => {
    if (!previewMode || livePreviewCandidates.length === 0) {
      return { type: "FeatureCollection" as const, features: [] }
    }
    return {
      type: "FeatureCollection" as const,
      features: livePreviewCandidates.map((c) => ({
        type: "Feature" as const,
        id: c.sourceId,
        properties: {
          id: c.sourceId,
          name: c.name,
          category: c.category,
          live: true
        },
        geometry: c.geometry
      }))
    }
  }, [previewMode, livePreviewCandidates])

  const radiusGeoJson = useMemo(() => {
    const lng =
      experience?.settings.centerLongitude ??
      mapPaint?.geojson?.features?.[0]?.geometry?.coordinates?.[0]?.[0]?.[0]
    const lat =
      experience?.settings.centerLatitude ??
      mapPaint?.geojson?.features?.[0]?.geometry?.coordinates?.[0]?.[0]?.[1]
    if (typeof lng !== "number" || typeof lat !== "number") {
      return turf.featureCollection([])
    }
    const circle = turf.circle([lng, lat], discoverRadiusMeters / 1000, {
      units: "kilometers",
      steps: 64
    })
    return turf.featureCollection([circle])
  }, [experience, mapPaint, discoverRadiusMeters])

  useImperativeHandle(ref, () => ({
    flyToScene: (sceneId: string, turn?: TourTurn) => {
      const map = mapRef.current
      const scene = experience?.scenes.find((row) => row.id === sceneId)
      if (!map || !scene) return
      sceneMotionAbortRef.current?.abort()
      const controller = new AbortController()
      sceneMotionAbortRef.current = controller
      const bearings = [...(experience?.scenes ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((row) => row.camera.bearing)
      void playCameraMotion({
        map,
        camera: scene.camera,
        durationMs: scene.durationMs,
        bearings,
        turn: turn ?? tourTurnFromBearings(bearings),
        signal: controller.signal
      })
    },
    cancelSceneMotion: () => {
      sceneMotionAbortRef.current?.abort()
      sceneMotionAbortRef.current = null
    },
    flyToLocation: (locationId: string) => {
      const map = mapRef.current
      const location = locations.find((row) => row._id === locationId)
      if (!map || !location) return
      const point = getLocationLngLat(location.geometry)
      if (!point) return
      map.flyTo({
        center: [point.lng, point.lat],
        zoom: Math.max(map.getZoom(), 15),
        duration: 1200
      })
    },
    setPitchPreset: (mode) => {
      const map = mapRef.current
      if (!map) return
      if (mode === "3d") {
        map.easeTo({ pitch: 60, bearing: map.getBearing() || -20, duration: 700 })
        return
      }
      map.easeTo({ pitch: 0, bearing: 0, duration: 700 })
    },
    getCamera: () => {
      const map = mapRef.current
      if (!map) return null
      const center = map.getCenter()
      return {
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing()
      }
    }
  }))

  useEffect(() => {
    if (!accessToken || !containerRef.current || mapRef.current) return
    mapboxgl.accessToken = accessToken
    const centerLng = experience?.settings.centerLongitude ?? -74.08175
    const centerLat = experience?.settings.centerLatitude ?? 4.60971
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: resolveMapStyleUrl(experience?.settings.styleUrl),
      center: [centerLng, centerLat],
      zoom: experience?.settings.defaultZoom ?? 14,
      pitch: experience?.settings.pitch ?? 60,
      bearing: experience?.settings.bearing ?? -20,
      antialias: true
    })
    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }),
      "top-right"
    )
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 120 }), "bottom-right")
    map.addControl(new mapboxgl.FullscreenControl(), "top-right")
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {}
    })
    map.addControl(draw as unknown as mapboxgl.IControl)
    drawRef.current = draw
    map.on("style.load", () => {
      const restoreCamera = pendingCameraRestoreRef.current
      if (restoreCamera) {
        pendingCameraRestoreRef.current = null
        map.jumpTo({
          center: [restoreCamera.center.lng, restoreCamera.center.lat],
          zoom: restoreCamera.zoom,
          pitch: restoreCamera.pitch,
          bearing: restoreCamera.bearing
        })
      }
      // Style swaps destroy custom layers — force a fresh GLB layer on next sync.
      glbLayerRef.current = null
      const reapplyBasemapExtras = () => {
        try {
          if (terrainEnabledRef.current) {
            enableMap3d(map, terrainExaggerationRef.current)
          } else {
            disableMap3d(map)
          }
          setMapFogEnabled(map, fogEnabledRef.current)
          setBuildings3dEnabled(map, buildings3dRef.current)
          applyStudioRoadLayers(
            map,
            roadsVisibleRef.current,
            roadsStyleRef.current
          )
        } catch {
          // Basemap helpers must not block lot overlays.
        }
      }
      reapplyBasemapExtras()
      // Composite building source can lag one frame after setStyle.
      requestAnimationFrame(reapplyBasemapExtras)
      try {
        if (drawRef.current) {
          map.removeControl(drawRef.current as unknown as mapboxgl.IControl)
          map.addControl(drawRef.current as unknown as mapboxgl.IControl)
        }
      } catch {
        // Draw may already be attached on first load.
      }
      if (!map.getSource(LOC_SOURCE)) {
        map.addSource(LOC_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        })
      }
      if (!map.getLayer(LOC_FILL_LAYER)) {
        map.addLayer({
          id: LOC_FILL_LAYER,
          type: "fill",
          source: LOC_SOURCE,
          filter: ["==", ["geometry-type"], "Polygon"],
          paint: {
            "fill-color": "#38bdf8",
            "fill-opacity": 0.25
          }
        })
      }
      if (!map.getLayer(LOC_LINE_LAYER)) {
        map.addLayer({
          id: LOC_LINE_LAYER,
          type: "line",
          source: LOC_SOURCE,
          filter: [
            "any",
            ["==", ["geometry-type"], "LineString"],
            ["==", ["geometry-type"], "Polygon"]
          ],
          paint: {
            "line-color": "#7dd3fc",
            "line-width": 2.5
          }
        })
      }
      if (!map.getLayer(LOC_POINT_LAYER)) {
        map.addLayer({
          id: LOC_POINT_LAYER,
          type: "circle",
          source: LOC_SOURCE,
          filter: ["==", ["geometry-type"], "Point"],
          paint: {
            "circle-radius": 7,
            "circle-color": ["coalesce", ["get", "color"], "#fbbf24"],
            "circle-stroke-width": 1.5,
            "circle-stroke-color": "#0f172a"
          }
        })
      }
      if (!map.getSource(ASSET_SOURCE)) {
        map.addSource(ASSET_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
          promoteId: "id"
        })
      }
      if (!map.getLayer(ASSET_LAYER)) {
        map.addLayer({
          id: ASSET_LAYER,
          type: "circle",
          source: ASSET_SOURCE,
          paint: {
            "circle-radius": 9,
            "circle-color": [
              "match",
              ["get", "type"],
              "model_3d",
              "#c084fc",
              "#a78bfa"
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff"
          }
        })
      }
      if (!map.getLayer(ASSET_LABEL_LAYER)) {
        map.addLayer({
          id: ASSET_LABEL_LAYER,
          type: "symbol",
          source: ASSET_SOURCE,
          layout: {
            "text-field": ["get", "name"],
            "text-size": 12,
            "text-offset": [0, 1.4],
            "text-anchor": "top",
            "text-optional": true
          },
          paint: {
            "text-color": "#f8fafc",
            "text-halo-color": "#0f172a",
            "text-halo-width": 1.5
          }
        })
      }
      // Model layer is added later (after addModel) in the assets sync effect.
      if (!map.getSource(RADIUS_SOURCE)) {
        map.addSource(RADIUS_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        })
      }
      if (!map.getLayer(RADIUS_LAYER)) {
        map.addLayer({
          id: RADIUS_LAYER,
          type: "fill",
          source: RADIUS_SOURCE,
          paint: {
            "fill-color": "#38bdf8",
            "fill-opacity": 0.08
          }
        })
      }
      if (!map.getSource(LIVE_SOURCE)) {
        map.addSource(LIVE_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        })
      }
      if (!map.getLayer(LIVE_LAYER)) {
        map.addLayer({
          id: LIVE_LAYER,
          type: "circle",
          source: LIVE_SOURCE,
          paint: {
            "circle-radius": 6,
            "circle-color": "#34d399",
            "circle-opacity": 0.85,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#064e3b"
          }
        })
      }
      if (!map.getSource(PROJECT_SOURCE)) {
        map.addSource(PROJECT_SOURCE, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
        })
      }
      if (!map.getLayer(PROJECT_HALO_LAYER)) {
        map.addLayer({
          id: PROJECT_HALO_LAYER,
          type: "circle",
          source: PROJECT_SOURCE,
          paint: {
            "circle-radius": 16,
            "circle-color": "#38bdf8",
            "circle-opacity": 0.25
          }
        })
      }
      if (!map.getLayer(PROJECT_LAYER)) {
        map.addLayer({
          id: PROJECT_LAYER,
          type: "circle",
          source: PROJECT_SOURCE,
          paint: {
            "circle-radius": 9,
            "circle-color": "#0ea5e9",
            "circle-stroke-width": 2.5,
            "circle-stroke-color": "#f8fafc"
          }
        })
      }
      try {
        hydrateLotsLayers(map)
        // Keep interactive overlays above the lot polygons.
        ;[
          LOC_FILL_LAYER,
          LOC_LINE_LAYER,
          LOC_POINT_LAYER,
          ASSET_LAYER,
          ASSET_LABEL_LAYER,
          STUDIO_GLB_LAYER_ID,
          LIVE_LAYER,
          PROJECT_HALO_LAYER,
          PROJECT_LAYER
        ].forEach((layerId) => {
          if (!map.getLayer(layerId)) return
          try {
            map.moveLayer(layerId)
          } catch {
            // ignore
          }
        })
      } catch {
        // Lot paint must not break the rest of the studio map.
      }
      // setStyle destroys custom Three.js layers — rebuild GLBs after sources exist.
      const rebuildGlbs = () => {
        resyncStudioGlbLayer({
          map,
          layerRef: glbLayerRef,
          assets: assetsRef.current,
          modelsVisible: models3dVisibleRef.current
        })
      }
      rebuildGlbs()
      requestAnimationFrame(rebuildGlbs)
      // Style swaps wipe custom sources — nudge React effects to rehydrate overlays.
      queueMicrotask(() => setMapEpoch((epoch) => epoch + 1))
    })
    const publishCamera = () => {
      const center = map.getCenter()
      dispatch(
        setMapCameraAct({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing()
        })
      )
    }
    map.on("moveend", publishCamera)
    map.on("click", (event) => {
      const tool = activeToolRef.current
      if (tool === "setProjectPin") {
        void dispatch(
          updateProjectLatLngThunk({
            projectId,
            lat: event.lngLat.lat,
            lng: event.lngLat.lng
          })
        )
        return
      }
      if (tool === "pickAssetPosition") {
        dispatch(
          setPendingAssetPositionAct({
            lat: event.lngLat.lat,
            lng: event.lngLat.lng
          })
        )
        dispatch(setActiveToolAct("select"))
        return
      }
      if (tool === "point") {
        void dispatch(
          createLocationThunk({
            projectId,
            data: {
              name: `Punto ${Date.now().toString(36).slice(-4)}`,
              category: "other",
              geometry: {
                type: "Point",
                coordinates: [event.lngLat.lng, event.lngLat.lat]
              },
              source: "manual"
            }
          })
        )
        dispatch(setActiveToolAct("select"))
        return
      }
      if (tool === "relocateLocation") {
        const locationId = relocatingLocationIdRef.current
        if (!locationId) {
          dispatch(setActiveToolAct("select"))
          return
        }
        void dispatch(
          updateLocationThunk({
            projectId,
            locationId,
            data: {
              geometry: {
                type: "Point",
                coordinates: [event.lngLat.lng, event.lngLat.lat]
              }
            }
          })
        )
        dispatch(setActiveToolAct("select"))
        return
      }
      if (tool === "placeAsset") {
        const targetId =
          placingAssetIdRef.current ??
          (selectionRef.current?.kind === "asset"
            ? String(selectionRef.current.id)
            : null)
        // Never fall back to assets[0] — that silently moves the wrong placement.
        if (!targetId) {
          dispatch(setActiveToolAct("select"))
          return
        }
        const selected = assetsRef.current.find(
          (a) => String(a._id) === String(targetId)
        )
        if (selected) {
          void dispatch(
            updateAssetThunk({
              projectId,
              assetId: String(selected._id),
              data: {
                position: {
                  longitude: event.lngLat.lng,
                  latitude: event.lngLat.lat
                }
              }
            })
          )
          dispatch(
            setSelectionAct({ kind: "asset", id: String(selected._id) })
          )
        }
        dispatch(setPlacingAssetIdAct(null))
        dispatch(setActiveToolAct("select"))
        return
      }
      const features = map.queryRenderedFeatures(event.point, {
        layers: [LOC_POINT_LAYER, LOC_LINE_LAYER, LOC_FILL_LAYER, ASSET_LAYER]
      })
      const hit = features[0]
      const id = hit?.properties?.id
      if (typeof id === "string") {
        const kind =
          hit.layer?.id === ASSET_LAYER ? "asset" : "location"
        dispatch(setSelectionAct({ kind, id }))
      }
    })
    map.on("draw.create", (event: { features: GeoJSON.Feature[] }) => {
      const feature = event.features[0]
      if (!feature?.geometry) return
      const geometryType = feature.geometry.type
      if (geometryType !== "LineString" && geometryType !== "Polygon") return
      const category = geometryType === "LineString" ? "road" : "nature"
      void dispatch(
        createLocationThunk({
          projectId,
          data: {
            name:
              geometryType === "LineString"
                ? `Vía ${Date.now().toString(36).slice(-4)}`
                : `Área ${Date.now().toString(36).slice(-4)}`,
            category,
            geometry: {
              type: geometryType,
              coordinates: (feature.geometry as GeoJSON.LineString | GeoJSON.Polygon)
                .coordinates
            },
            source: "manual"
          }
        })
      )
      draw.deleteAll()
      dispatch(setActiveToolAct("select"))
    })
    mapRef.current = map
    publishCamera()
    appliedStyleUrlRef.current = resolveMapStyleUrl(experience?.settings.styleUrl)
    setMapEpoch((epoch) => epoch + 1)
    return () => {
      map.remove()
      mapRef.current = null
      drawRef.current = null
      appliedStyleUrlRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, projectId, dispatch])

  useEffect(() => {
    const draw = drawRef.current
    if (!draw) return
    if (activeTool === "line") {
      draw.changeMode("draw_line_string")
    } else if (activeTool === "polygon") {
      draw.changeMode("draw_polygon")
    } else {
      draw.changeMode("simple_select")
    }
  }, [activeTool])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.getCanvas().style.cursor =
      activeTool === "setProjectPin" ||
      activeTool === "pickAssetPosition" ||
      activeTool === "point" ||
      activeTool === "placeAsset" ||
      activeTool === "relocateLocation"
        ? "crosshair"
        : ""
  }, [activeTool])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const apply = () => {
      const source = map.getSource(PROJECT_SOURCE) as GeoJSONSource | undefined
      if (!source) return
      if (!projectLatLng) {
        source.setData({ type: "FeatureCollection", features: [] })
        return
      }
      source.setData({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "project" },
            geometry: {
              type: "Point",
              coordinates: [projectLatLng.lng, projectLatLng.lat]
            }
          }
        ]
      })
    }
    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [projectLatLng, mapEpoch])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (experience?.settings.terrainEnabled !== false) {
      enableMap3d(
        map,
        resolveTerrainExaggeration(experience?.settings.terrainExaggeration)
      )
    } else {
      disableMap3d(map)
    }
    setMapFogEnabled(map, experience?.settings.fogEnabled !== false)
  }, [
    experience?.settings.terrainEnabled,
    experience?.settings.terrainExaggeration,
    experience?.settings.fogEnabled,
    mapEpoch
  ])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const apply = () => {
      setBuildings3dEnabled(map, experience?.settings.buildings3DEnabled === true)
    }
    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [experience?.settings.buildings3DEnabled, mapEpoch])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const nextStyle = resolveMapStyleUrl(experience?.settings.styleUrl)
    if (appliedStyleUrlRef.current === null) {
      appliedStyleUrlRef.current = nextStyle
      return
    }
    if (appliedStyleUrlRef.current === nextStyle) return
    // Preserve view + 3D orientation across basemap swaps (setStyle resets transform).
    const center = map.getCenter()
    pendingCameraRestoreRef.current = {
      center: { lng: center.lng, lat: center.lat },
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing()
    }
    appliedStyleUrlRef.current = nextStyle
    map.setStyle(nextStyle)
  }, [experience?.settings.styleUrl])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const roadsVisible = experience?.layers.roads !== false
    const roadsStyle = experience?.settings.roadsStyle
    const apply = () => {
      applyStudioRoadLayers(map, roadsVisible, roadsStyle)
    }
    if (map.isStyleLoaded()) apply()
    else map.once("style.load", apply)
  }, [
    experience?.layers.roads,
    experience?.settings.roadsStyle?.color,
    experience?.settings.roadsStyle?.width,
    experience?.settings.roadsStyle?.opacity
  ])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapPaint?.geojson) return
    const apply = (fitToLots: boolean) => {
      hydrateLotsLayers(map)
      if (!fitToLots) return
      const bounds = computeBounds(mapPaint.geojson as LotMapGeoJson)
      if (bounds) {
        map.fitBounds(bounds, { padding: 64, maxZoom: 17, duration: 800 })
      }
    }
    if (map.isStyleLoaded()) {
      // mapEpoch bumps on style swap — rehydrate lots without stealing the camera.
      apply(false)
      requestAnimationFrame(() => {
        if (mapRef.current) hydrateLotsLayers(mapRef.current)
      })
      return
    }
    map.once("style.load", () => apply(true))
  }, [mapPaint, experience?.layers.lots, mapEpoch])

  // Fit camera to lots only when lot geometry itself changes (not on basemap swap).
  useEffect(() => {
    const map = mapRef.current
    if (!map || !mapPaint?.geojson || !map.isStyleLoaded()) return
    const bounds = computeBounds(mapPaint.geojson as LotMapGeoJson)
    if (!bounds) return
    map.fitBounds(bounds, { padding: 64, maxZoom: 17, duration: 800 })
  }, [mapPaint])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(LOC_SOURCE) as GeoJSONSource | undefined
    source?.setData(locationsGeoJson as GeoJSON.FeatureCollection)
    const show = experience?.layers.locations !== false
    ;[LOC_POINT_LAYER, LOC_LINE_LAYER, LOC_FILL_LAYER].forEach((id) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", show ? "visible" : "none")
      }
    })
  }, [locationsGeoJson, experience?.layers.locations, mapEpoch])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(ASSET_SOURCE) as GeoJSONSource | undefined
    source?.setData(assetsGeoJson as GeoJSON.FeatureCollection)
    const assetsVisible = experience?.layers.assets !== false
    const modelsVisible = experience?.layers.models3D !== false
    if (map.getLayer(ASSET_LAYER)) {
      map.setLayoutProperty(
        ASSET_LAYER,
        "visibility",
        assetsVisible ? "visible" : "none"
      )
    }
    if (map.getLayer(ASSET_LABEL_LAYER)) {
      map.setLayoutProperty(
        ASSET_LABEL_LAYER,
        "visibility",
        assetsVisible ? "visible" : "none"
      )
    }
    resyncStudioGlbLayer({
      map,
      layerRef: glbLayerRef,
      assets,
      modelsVisible
    })
  }, [
    assets,
    assetsGeoJson,
    experience?.layers.assets,
    experience?.layers.models3D,
    mapEpoch
  ])

  useEffect(() => {
    if (selection?.kind !== "asset") return
    const map = mapRef.current
    const asset = assets.find(
      (row) => String(row._id) === String(selection.id)
    )
    if (!map || !asset) return
    const longitude = Number(asset.position?.longitude)
    const latitude = Number(asset.position?.latitude)
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return
    map.flyTo({
      center: [longitude, latitude],
      zoom: Math.max(map.getZoom(), 17),
      duration: 900
    })
  }, [selection?.kind, selection?.id, assets])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(RADIUS_SOURCE) as GeoJSONSource | undefined
    source?.setData(radiusGeoJson as GeoJSON.FeatureCollection)
    if (map.getLayer(RADIUS_LAYER)) {
      map.setLayoutProperty(
        RADIUS_LAYER,
        "visibility",
        activePanel === "locations" ? "visible" : "none"
      )
    }
  }, [radiusGeoJson, activePanel])

  // Rail panel swaps change the left column layout; Mapbox must resize and
  // reassert overlay visibility so locations / GLBs stay on screen.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const frame = window.requestAnimationFrame(() => {
      try {
        map.resize()
      } catch {
        return
      }
      if (!map.isStyleLoaded()) return
      const showLocations = experience?.layers.locations !== false
      ;[LOC_POINT_LAYER, LOC_LINE_LAYER, LOC_FILL_LAYER].forEach((id) => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(
            id,
            "visibility",
            showLocations ? "visible" : "none"
          )
        }
      })
      const showAssets = experience?.layers.assets !== false
      const showModels = experience?.layers.models3D !== false
      if (map.getLayer(ASSET_LAYER)) {
        map.setLayoutProperty(
          ASSET_LAYER,
          "visibility",
          showAssets ? "visible" : "none"
        )
      }
      if (map.getLayer(ASSET_LABEL_LAYER)) {
        map.setLayoutProperty(
          ASSET_LABEL_LAYER,
          "visibility",
          showAssets ? "visible" : "none"
        )
      }
      const locSource = map.getSource(LOC_SOURCE) as GeoJSONSource | undefined
      locSource?.setData(locationsGeoJson as GeoJSON.FeatureCollection)
      const assetSource = map.getSource(ASSET_SOURCE) as GeoJSONSource | undefined
      assetSource?.setData(assetsGeoJson as GeoJSON.FeatureCollection)
      if (glbLayerRef.current && map.getLayer(STUDIO_GLB_LAYER_ID)) {
        glbLayerRef.current.setVisible(showModels)
      }
      map.triggerRepaint()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [
    activePanel,
    experience?.layers.locations,
    experience?.layers.assets,
    experience?.layers.models3D,
    locationsGeoJson,
    assetsGeoJson
  ])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource(LIVE_SOURCE) as GeoJSONSource | undefined
    source?.setData(livePreviewGeoJson as GeoJSON.FeatureCollection)
    if (map.getLayer(LIVE_LAYER)) {
      map.setLayoutProperty(
        LIVE_LAYER,
        "visibility",
        previewMode && livePreviewCandidates.length > 0 ? "visible" : "none"
      )
    }
  }, [livePreviewGeoJson, previewMode, livePreviewCandidates.length])

  if (!accessToken) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        {lotS.mapMissingToken}
      </Alert>
    )
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "#020617"
      }}
    />
  )
})

export default StudioMapCP
