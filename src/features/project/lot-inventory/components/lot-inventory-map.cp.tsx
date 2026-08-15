import React, { useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material"
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import type { PathOptions, Layer } from "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchLotsMapThunk,
  setDrawerLotIdAct
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type {
  LotMapFeatureProperties,
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

function FitBounds({ geojson }: { geojson: FeatureCollection }) {
  const map = useMap()
  useEffect(() => {
    if (!geojson.features.length) return
    const layer = L.geoJSON(geojson)
    const bounds = layer.getBounds()
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] })
    }
  }, [geojson, map])
  return null
}

function styleForFeature(feature?: Feature): PathOptions {
  const status = (feature?.properties as LotMapFeatureProperties | undefined)
    ?.status
  const fill =
    status && status in STATUS_COLORS
      ? STATUS_COLORS[status as ProjectLotStatus]
      : STATUS_COLORS.default
  return {
    color: "#666666",
    weight: 1.2,
    fillColor: fill,
    fillOpacity: status ? 0.55 : 0.35
  }
}

type Props = {
  projectId: string
}

export default function LotInventoryMapCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const {
    mapPaint,
    mapLoading,
    mapError,
    stageFilter,
    statusFilter
  } = useAppSelector((state: RootState) => state.lotInventory)

  useEffect(() => {
    void dispatch(fetchLotsMapThunk(projectId))
  }, [dispatch, projectId])

  const filteredGeoJson = useMemo((): FeatureCollection | null => {
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

  if (mapLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (mapError || !filteredGeoJson) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {mapError ? s.mapMissing : s.mapEmpty}
      </Alert>
    )
  }

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
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
          {mapPaint?.matchedCount ?? 0}/{mapPaint?.featureCount ?? 0}{" "}
          {s.mapMatched}
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 560,
          borderRadius: 2,
          overflow: "hidden",
          border: 1,
          borderColor: "divider"
        }}
      >
        <MapContainer
          center={[4.123, -74.763]}
          zoom={16}
          style={{ height: "100%", width: "100%", cursor: "pointer" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds geojson={filteredGeoJson} />
          <GeoJSON
            key={`${stageFilter}-${statusFilter}-${mapPaint?.lotsMapGeojson}-${filteredGeoJson.features.length}`}
            data={filteredGeoJson as FeatureCollection<Geometry>}
            style={styleForFeature}
            onEachFeature={(feature, layer: Layer) => {
              const props = feature.properties as LotMapFeatureProperties
              const label = `${s.drawerTitle} ${props.lotNumber} · ${props.stageName}`
              layer.bindTooltip(label)
              layer.on("click", () => {
                if (props.lotId) {
                  dispatch(setDrawerLotIdAct(props.lotId))
                }
              })
            }}
          />
        </MapContainer>
      </Box>
    </Box>
  )
}
