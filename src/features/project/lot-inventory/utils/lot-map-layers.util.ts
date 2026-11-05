import mapboxgl, { LngLatBoundsLike, Map } from "mapbox-gl"
import type {
  LotMapGeoJson,
  ProjectLotStatus
} from "../types/lot-inventory.types"

export const STATUS_COLORS: Record<ProjectLotStatus | "default", string> = {
  available: "#059669",
  hold: "#D97706",
  locked: "#475569",
  sold: "#E11D48",
  default: "#FFFFFF"
}

export const LOTS_SOURCE_ID = "project-lots-geojson"
export const LOTS_FLAT_FILL_LAYER_ID = "project-lots-flat-fill"
export const LOTS_FILL_LAYER_ID = "project-lots-fill"
export const LOTS_LINE_LAYER_ID = "project-lots-outline"
export const TERRAIN_SOURCE_ID = "mapbox-dem"
export const SKY_LAYER_ID = "sky"
export const MAP_PITCH = 60
export const MAP_BEARING = -20
export const LOT_EXTRUSION_HEIGHT_M = 0
export const MAPBOX_STYLE = "mapbox://styles/mapbox/satellite-streets-v12"
export const EMPTY_GEOJSON: LotMapGeoJson = {
  type: "FeatureCollection",
  features: []
}

export const FILL_COLOR_EXPR: mapboxgl.ExpressionSpecification = [
  "match",
  ["coalesce", ["get", "status"], ""],
  "available",
  STATUS_COLORS.available,
  "hold",
  STATUS_COLORS.hold,
  "locked",
  STATUS_COLORS.locked,
  "sold",
  STATUS_COLORS.sold,
  STATUS_COLORS.default
]

export function computeBounds(geojson: LotMapGeoJson): LngLatBoundsLike | null {
  let minLon = Infinity
  let minLat = Infinity
  let maxLon = -Infinity
  let maxLat = -Infinity
  const visit = (value: unknown): void => {
    if (!Array.isArray(value) || value.length === 0) return
    if (typeof value[0] === "number" && typeof value[1] === "number") {
      const lon = value[0]
      const lat = value[1]
      minLon = Math.min(minLon, lon)
      maxLon = Math.max(maxLon, lon)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      return
    }
    for (const child of value) {
      visit(child)
    }
  }
  for (const feature of geojson.features) {
    visit(feature.geometry.coordinates)
  }
  if (!Number.isFinite(minLon) || !Number.isFinite(minLat)) {
    return null
  }
  return [
    [minLon, minLat],
    [maxLon, maxLat]
  ]
}

export function resolveTerrainExaggeration(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numeric)) return 1
  // Migrate previous studio default (1.2) to true-scale terrain.
  const normalized = numeric === 1.2 ? 1 : numeric
  return Math.min(5, Math.max(0, normalized))
}

export function enableMap3d(
  map: Map,
  exaggeration = 1
): void {
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14
    })
  }
  map.setTerrain({
    source: TERRAIN_SOURCE_ID,
    exaggeration: resolveTerrainExaggeration(exaggeration)
  })
  if (!map.getLayer(SKY_LAYER_ID)) {
    map.addLayer({
      id: SKY_LAYER_ID,
      type: "sky",
      paint: {
        "sky-type": "atmosphere",
        "sky-atmosphere-sun": [0, 90],
        "sky-atmosphere-sun-intensity": 12
      }
    })
  }
  map.setFog({
    color: "rgb(186, 210, 235)",
    "high-color": "rgb(36, 92, 223)",
    "horizon-blend": 0.02,
    "space-color": "rgb(11, 11, 25)",
    "star-intensity": 0.6
  })
}

export function disableMap3d(map: Map): void {
  map.setTerrain(null)
  if (map.getLayer(SKY_LAYER_ID)) {
    map.removeLayer(SKY_LAYER_ID)
  }
  map.setFog(null)
}

export function ensureLotsLayers(map: Map, mode: "2d" | "3d"): void {
  if (!map.getSource(LOTS_SOURCE_ID)) {
    map.addSource(LOTS_SOURCE_ID, {
      type: "geojson",
      data: EMPTY_GEOJSON
    })
  }
  // Flat fill stays visible on pitched/terrain views where extrusion height 0 vanishes.
  if (!map.getLayer(LOTS_FLAT_FILL_LAYER_ID)) {
    map.addLayer({
      id: LOTS_FLAT_FILL_LAYER_ID,
      type: "fill",
      source: LOTS_SOURCE_ID,
      paint: {
        "fill-color": FILL_COLOR_EXPR,
        "fill-opacity": 0.55
      }
    })
  }
  if (!map.getLayer(LOTS_FILL_LAYER_ID)) {
    map.addLayer({
      id: LOTS_FILL_LAYER_ID,
      type: "fill-extrusion",
      source: LOTS_SOURCE_ID,
      paint: {
        "fill-extrusion-color": FILL_COLOR_EXPR,
        "fill-extrusion-height": mode === "3d" ? 1.5 : 0,
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": mode === "3d" ? 0.65 : 0.35
      }
    })
  } else if (mode === "3d") {
    map.setPaintProperty(LOTS_FILL_LAYER_ID, "fill-extrusion-height", 1.5)
    map.setPaintProperty(LOTS_FILL_LAYER_ID, "fill-extrusion-opacity", 0.65)
  }
  if (!map.getLayer(LOTS_LINE_LAYER_ID)) {
    map.addLayer({
      id: LOTS_LINE_LAYER_ID,
      type: "line",
      source: LOTS_SOURCE_ID,
      paint: {
        "line-color": "#ffffff",
        "line-width": 2,
        "line-opacity": 0.95
      }
    })
  }
}

export function applyMapPerspective(
  map: Map,
  mode: "2d" | "3d",
  exaggeration = 1.05
): void {
  if (mode === "3d") {
    enableMap3d(map, exaggeration)
    if (map.getLayer(LOTS_FILL_LAYER_ID)) {
      map.setPaintProperty(
        LOTS_FILL_LAYER_ID,
        "fill-extrusion-height",
        LOT_EXTRUSION_HEIGHT_M
      )
      map.setPaintProperty(LOTS_FILL_LAYER_ID, "fill-extrusion-opacity", 0.75)
    }
    map.easeTo({
      pitch: MAP_PITCH,
      bearing: MAP_BEARING,
      duration: 700
    })
    return
  }
  disableMap3d(map)
  if (map.getLayer(LOTS_FILL_LAYER_ID)) {
    map.setPaintProperty(LOTS_FILL_LAYER_ID, "fill-extrusion-height", 0)
    map.setPaintProperty(LOTS_FILL_LAYER_ID, "fill-extrusion-opacity", 0.55)
  }
  map.easeTo({
    pitch: 0,
    bearing: 0,
    duration: 700
  })
}
