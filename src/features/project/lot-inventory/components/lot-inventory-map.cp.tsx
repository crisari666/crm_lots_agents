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
import mapboxgl, { GeoJSONSource, Map } from "mapbox-gl"
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
import {
  applyMapPerspective,
  computeBounds,
  ensureLotsLayers,
  LOTS_FILL_LAYER_ID,
  LOTS_SOURCE_ID,
  MAP_BEARING,
  MAP_PITCH,
  MAPBOX_STYLE,
  STATUS_COLORS,
  enableMap3d,
  disableMap3d
} from "../utils/lot-map-layers.util"

function resolveMapboxToken(): string {
  return (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined)?.trim() ?? ""
}

function readFeatureProperties(feature: unknown): LotMapFeatureProperties | null {
  if (!feature || typeof feature !== "object") return null
  const properties = (feature as { properties?: unknown }).properties
  if (!properties || typeof properties !== "object") return null
  return properties as LotMapFeatureProperties
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
      style: MAPBOX_STYLE,
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
