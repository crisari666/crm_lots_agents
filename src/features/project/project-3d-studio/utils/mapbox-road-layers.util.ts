import type { ExpressionSpecification, Map, AnyLayer } from "mapbox-gl"
import { applyRoadLineStyle, resolveRoadLine } from "@omega/project-experience"
import {
  DEFAULT_ROADS_STYLE,
  type ExperienceRoadsStyleType
} from "../types/project-experience.types"

const ROAD_SOURCE_LAYERS = new Set(["road", "road_label"])
const ROAD_ID_PREFIXES = ["road-", "bridge-", "tunnel-", "ferry-", "road "] as const

function isRoadLayer(layer: AnyLayer): boolean {
  const sourceLayer =
    "source-layer" in layer && typeof layer["source-layer"] === "string"
      ? layer["source-layer"]
      : ""
  if (ROAD_SOURCE_LAYERS.has(sourceLayer)) return true
  const id = layer.id.toLowerCase()
  return ROAD_ID_PREFIXES.some((prefix) => id.startsWith(prefix))
}

function listRoadLayers(map: Map): AnyLayer[] {
  const style = map.getStyle()
  if (!style?.layers) return []
  return style.layers.filter(isRoadLayer)
}

function resolveRoadsStyle(
  style?: Partial<ExperienceRoadsStyleType> | null
): ExperienceRoadsStyleType {
  return {
    color: style?.color?.trim() || DEFAULT_ROADS_STYLE.color,
    width:
      typeof style?.width === "number" && style.width >= 1
        ? style.width
        : DEFAULT_ROADS_STYLE.width,
    opacity:
      typeof style?.opacity === "number" && style.opacity >= 0.2
        ? style.opacity
        : DEFAULT_ROADS_STYLE.opacity,
    line: resolveRoadLine(style?.line)
  }
}

function buildLineWidth(baseWidth: number): ExpressionSpecification {
  const at10 = Math.max(0.8, baseWidth * 0.45)
  const at14 = baseWidth
  const at18 = Math.min(18, baseWidth * 2.2)
  return [
    "interpolate",
    ["linear"],
    ["zoom"],
    10,
    at10,
    14,
    at14,
    18,
    at18
  ]
}

/**
 * Show or hide basemap road network + road labels only.
 */
export function setRoadsVisibility(map: Map, visible: boolean): void {
  const visibility = visible ? "visible" : "none"
  for (const layer of listRoadLayers(map)) {
    if (!map.getLayer(layer.id)) continue
    map.setLayoutProperty(layer.id, "visibility", visibility)
  }
}

/**
 * Apply solid road color / weight / opacity from experience settings.
 */
export function enhanceRoadColors(
  map: Map,
  roadsStyle?: Partial<ExperienceRoadsStyleType> | null
): void {
  const style = resolveRoadsStyle(roadsStyle)
  const lineWidth = buildLineWidth(style.width)
  for (const layer of listRoadLayers(map)) {
    if (layer.type !== "line") continue
    if (!map.getLayer(layer.id)) continue
    try {
      map.setPaintProperty(layer.id, "line-color", style.color)
      map.setPaintProperty(layer.id, "line-width", lineWidth)
      map.setPaintProperty(layer.id, "line-opacity", style.opacity)
    } catch {
      // Layer may not support all paint props (casing/outline variants).
    }
  }
}

/**
 * Apply Studio road style then visibility from experience.layers.roads.
 */
export function applyStudioRoadLayers(
  map: Map,
  roadsVisible: boolean,
  roadsStyle?: Partial<ExperienceRoadsStyleType> | null
): void {
  enhanceRoadColors(map, roadsStyle)
  setRoadsVisibility(map, roadsVisible)
  applyRoadLineStyle(map, resolveRoadLine(roadsStyle?.line), roadsVisible)
}
