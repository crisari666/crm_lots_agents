import type { ExpressionSpecification, Map } from "mapbox-gl"
import { MAPBOX_STYLE } from "../../lot-inventory/utils/lot-map-layers.util"

export type MapStylePresetId =
  | "satellite-streets"
  | "streets"
  | "outdoors"
  | "light"
  | "dark"

export type MapStylePreset = {
  id: MapStylePresetId
  url: string
  labelKey:
    | "mapStyleSatellite"
    | "mapStyleStreets"
    | "mapStyleOutdoors"
    | "mapStyleLight"
    | "mapStyleDark"
}

export const MAP_STYLE_PRESETS: readonly MapStylePreset[] = [
  {
    id: "satellite-streets",
    url: MAPBOX_STYLE,
    labelKey: "mapStyleSatellite"
  },
  {
    id: "streets",
    url: "mapbox://styles/mapbox/streets-v12",
    labelKey: "mapStyleStreets"
  },
  {
    id: "outdoors",
    url: "mapbox://styles/mapbox/outdoors-v12",
    labelKey: "mapStyleOutdoors"
  },
  {
    id: "light",
    url: "mapbox://styles/mapbox/light-v11",
    labelKey: "mapStyleLight"
  },
  {
    id: "dark",
    url: "mapbox://styles/mapbox/dark-v11",
    labelKey: "mapStyleDark"
  }
] as const

export const BUILDINGS_LAYER_ID = "studio-3d-buildings"

export function resolveMapStylePresetId(styleUrl: string | undefined): MapStylePresetId {
  const match = MAP_STYLE_PRESETS.find((preset) => preset.url === styleUrl)
  return match?.id ?? "satellite-streets"
}

export function resolveMapStyleUrl(styleUrl: string | undefined): string {
  if (!styleUrl?.trim()) return MAPBOX_STYLE
  const known = MAP_STYLE_PRESETS.find((preset) => preset.url === styleUrl)
  return known?.url ?? styleUrl
}

/**
 * Toggle Mapbox composite building extrusions for a more interactive 3D city view.
 */
export function setBuildings3dEnabled(map: Map, enabled: boolean): void {
  if (!enabled) {
    if (map.getLayer(BUILDINGS_LAYER_ID)) {
      map.setLayoutProperty(BUILDINGS_LAYER_ID, "visibility", "none")
    }
    return
  }
  if (!map.getSource("composite")) return
  if (!map.getLayer(BUILDINGS_LAYER_ID)) {
    const beforeId = map
      .getStyle()
      ?.layers?.find((layer) => layer.type === "symbol")?.id
    const layer = {
      id: BUILDINGS_LAYER_ID,
      source: "composite",
      "source-layer": "building",
      filter: ["==", ["get", "extrude"], "true"] as ExpressionSpecification,
      type: "fill-extrusion" as const,
      minzoom: 14,
      paint: {
        "fill-extrusion-color": "#94a3b8",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          14.5,
          ["get", "height"]
        ] as ExpressionSpecification,
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          14,
          0,
          14.5,
          ["get", "min_height"]
        ] as ExpressionSpecification,
        "fill-extrusion-opacity": 0.72
      }
    }
    try {
      if (beforeId && map.getLayer(beforeId)) {
        map.addLayer(layer, beforeId)
      } else {
        map.addLayer(layer)
      }
    } catch {
      try {
        map.addLayer(layer)
      } catch {
        return
      }
    }
  }
  if (map.getLayer(BUILDINGS_LAYER_ID)) {
    map.setLayoutProperty(BUILDINGS_LAYER_ID, "visibility", "visible")
  }
}

export function setMapFogEnabled(map: Map, enabled: boolean): void {
  if (!enabled) {
    map.setFog(null)
    return
  }
  map.setFog({
    color: "rgb(186, 210, 235)",
    "high-color": "rgb(36, 92, 223)",
    "horizon-blend": 0.02,
    "space-color": "rgb(11, 11, 25)",
    "star-intensity": 0.6
  })
}
