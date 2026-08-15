import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material"
import mapboxgl, { GeoJSONSource, LngLatBoundsLike, Map } from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchLotsMapThunk,
  setDrawerLotIdAct
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type {
  LotMapFeatureProperties,
  LotMapGeoJson,
  ProjectLotStatus
} from "../types/lot-inventory.types"
import { getStatusLabel } from "./lot-status-chip.cp"

const STATUS_COLORS: Record<ProjectLotStatus | "default", string> = {
  available: "#059669",
  hold: "#D97706",
  locked: "#475569",
  sold: "#E11D48",
  default: "#FFFFFF"
}

const LOTS_SOURCE_ID = "project-lots-geojson"
const LOTS_FILL_LAYER_ID = "project-lots-fill"
const LOTS_LINE_LAYER_ID = "project-lots-outline"
const TERRAIN_SOURCE_ID = "mapbox-dem"
const SKY_LAYER_ID = "sky"
const MAP_PITCH = 60
const MAP_BEARING = -20
const LOT_EXTRUSION_HEIGHT_M = 1
const EMPTY_GEOJSON: LotMapGeoJson = {
  type: "FeatureCollection",
  features: []
}

const FILL_COLOR_EXPR: mapboxgl.ExpressionSpecification = [
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

function resolveMapboxToken(): string {
  return (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined)?.trim() ?? ""
}

function computeBounds(geojson: LotMapGeoJson): LngLatBoundsLike | null {
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

function readFeatureProperties(feature: unknown): LotMapFeatureProperties | null {
  if (!feature || typeof feature !== "object") return null
  const properties = (feature as { properties?: unknown }).properties
  if (!properties || typeof properties !== "object") return null
  return properties as LotMapFeatureProperties
}

function enableMap3d(map: Map): void {
  if (!map.getSource(TERRAIN_SOURCE_ID)) {
    map.addSource(TERRAIN_SOURCE_ID, {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      maxzoom: 14
    })
  }
  map.setTerrain({ source: TERRAIN_SOURCE_ID, exaggeration: 1 })
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

function disableMap3d(map: Map): void {
  map.setTerrain(null)
  if (map.getLayer(SKY_LAYER_ID)) {
    map.removeLayer(SKY_LAYER_ID)
  }
  map.setFog(null)
}

function applyMapPerspective(map: Map, mode: "2d" | "3d"): void {
  if (mode === "3d") {
    enableMap3d(map)
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

function ensureLotsLayers(map: Map, mode: "2d" | "3d"): void {
  if (!map.getSource(LOTS_SOURCE_ID)) {
    map.addSource(LOTS_SOURCE_ID, {
      type: "geojson",
      data: EMPTY_GEOJSON
    })
  }
  if (!map.getLayer(LOTS_FILL_LAYER_ID)) {
    map.addLayer({
      id: LOTS_FILL_LAYER_ID,
      type: "fill-extrusion",
      source: LOTS_SOURCE_ID,
      paint: {
        "fill-extrusion-color": FILL_COLOR_EXPR,
        "fill-extrusion-height":
          mode === "3d" ? LOT_EXTRUSION_HEIGHT_M : 0,
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": mode === "3d" ? 0.75 : 0.55
      }
    })
  }
  if (!map.getLayer(LOTS_LINE_LAYER_ID)) {
    map.addLayer({
      id: LOTS_LINE_LAYER_ID,
      type: "line",
      source: LOTS_SOURCE_ID,
      paint: {
        "line-color": "#ffffff",
        "line-width": 1.5,
        "line-opacity": 0.85
      }
    })
  }
}

type Props = {
  projectId: string
}

export default function LotInventoryMapCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const fittedKeyRef = useRef<string>("")
  const [perspective, setPerspective] = useState<"2d" | "3d">("2d")
  const perspectiveRef = useRef<"2d" | "3d">(perspective)
  perspectiveRef.current = perspective
  const {
    mapPaint,
    mapLoading,
    mapError,
    stageFilter,
    statusFilter
  } = useAppSelector((state: RootState) => state.lotInventory)
  const accessToken = resolveMapboxToken()

  useEffect(() => {
    void dispatch(fetchLotsMapThunk(projectId))
  }, [dispatch, projectId])

  const filteredGeoJson = useMemo((): LotMapGeoJson | null => {
    if (!mapPaint?.geojson) return null
    const features = mapPaint.geojson.features.filter((feature) => {
      const props = feature.properties
      if (stageFilter !== "all" && props.stageKey !== stageFilter) return false
      if (statusFilter !== "all") {
        if (!props.status || props.status !== statusFilter) return false
      }
      return true
    })
    return { type: "FeatureCollection", features }
  }, [mapPaint, stageFilter, statusFilter])

  const hasMapData = Boolean(mapPaint)

  useEffect(() => {
    if (!accessToken || !containerRef.current || !hasMapData) return
    if (mapRef.current) return
    mapboxgl.accessToken = accessToken
    const initialMode = perspectiveRef.current
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-74.08175, 4.60971],
      zoom: 14,
      pitch: initialMode === "3d" ? MAP_PITCH : 0,
      bearing: initialMode === "3d" ? MAP_BEARING : 0,
      antialias: true
    })
    map.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
      }),
      "top-right"
    )
    map.dragRotate.enable()
    map.touchZoomRotate.enableRotation()
    popupRef.current = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 8
    })
    map.on("style.load", () => {
      const mode = perspectiveRef.current
      if (mode === "3d") {
        enableMap3d(map)
      } else {
        disableMap3d(map)
      }
      ensureLotsLayers(map, mode)
    })
    map.on("click", LOTS_FILL_LAYER_ID, (event) => {
      const props = readFeatureProperties(event.features?.[0])
      if (props?.lotId) {
        dispatch(setDrawerLotIdAct(String(props.lotId)))
      }
    })
    map.on("mouseenter", LOTS_FILL_LAYER_ID, (event) => {
      map.getCanvas().style.cursor = "pointer"
      const props = readFeatureProperties(event.features?.[0])
      if (!props || !popupRef.current) return
      const label = `${s.drawerTitle} ${props.lotNumber} · ${props.stageName}`
      popupRef.current
        .setLngLat(event.lngLat)
        .setHTML(`<strong>${label}</strong>`)
        .addTo(map)
    })
    map.on("mousemove", LOTS_FILL_LAYER_ID, (event) => {
      popupRef.current?.setLngLat(event.lngLat)
    })
    map.on("mouseleave", LOTS_FILL_LAYER_ID, () => {
      map.getCanvas().style.cursor = ""
      popupRef.current?.remove()
    })
    mapRef.current = map
    return () => {
      popupRef.current?.remove()
      popupRef.current = null
      map.remove()
      mapRef.current = null
      fittedKeyRef.current = ""
    }
  }, [accessToken, hasMapData, dispatch])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    applyMapPerspective(map, perspective)
  }, [perspective])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !filteredGeoJson) return
    const apply = (): void => {
      ensureLotsLayers(map, perspectiveRef.current)
      const source = map.getSource(LOTS_SOURCE_ID) as GeoJSONSource | undefined
      if (!source) return
      source.setData(filteredGeoJson)
      const fitKey = `${mapPaint?.lotsMapGeojson ?? ""}:${stageFilter}:${statusFilter}:${filteredGeoJson.features.length}`
      if (fitKey === fittedKeyRef.current) return
      const bounds = computeBounds(filteredGeoJson)
      if (!bounds) return
      const mode = perspectiveRef.current
      map.fitBounds(bounds, {
        padding: 48,
        maxZoom: 18,
        pitch: mode === "3d" ? MAP_PITCH : 0,
        bearing: mode === "3d" ? MAP_BEARING : 0,
        duration: 900
      })
      fittedKeyRef.current = fitKey
    }
    if (map.isStyleLoaded()) {
      apply()
      return
    }
    map.once("style.load", apply)
  }, [filteredGeoJson, mapPaint?.lotsMapGeojson, stageFilter, statusFilter])

  if (!accessToken) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {s.mapMissingToken}
      </Alert>
    )
  }

  if (mapLoading && !mapPaint) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!mapPaint || mapError) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {mapError ? s.mapMissing : s.mapEmpty}
      </Alert>
    )
  }

  if (!filteredGeoJson) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {s.mapEmpty}
      </Alert>
    )
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 1.5 }}
        flexWrap="wrap"
        useFlexGap
        alignItems="center"
      >
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
          {s.mapLegend}:
        </Typography>
        {(
          [
            "available",
            "hold",
            "locked",
            "sold"
          ] as ProjectLotStatus[]
        ).map((st) => (
          <Chip
            key={st}
            size="small"
            label={getStatusLabel(st)}
            sx={{
              bgcolor: STATUS_COLORS[st],
              color: "#fff",
              cursor: "default"
            }}
          />
        ))}
        <Chip
          size="small"
          label={s.mapUnmatched}
          variant="outlined"
          sx={{ cursor: "default" }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
          {mapPaint.matchedCount}/{mapPaint.featureCount} {s.mapMatched}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={perspective}
          onChange={(_e, value: "2d" | "3d" | null) => {
            if (value) setPerspective(value)
          }}
        >
          <ToggleButton value="2d">{s.mapView2d}</ToggleButton>
          <ToggleButton value="3d">{s.mapView3d}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Box
        ref={containerRef}
        sx={{
          height: 560,
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider",
          position: "relative"
        }}
      />
    </Box>
  )
}
