import React, { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Slider,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from "@mui/material"
import {
  CameraAlt as CameraIcon,
  Tune as RoadsStyleIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  setDirtyAct,
  updateExperienceThunk
} from "../../slice/project-3d-studio.slice"
import {
  DEFAULT_ROADS_STYLE,
  LOCATION_CATEGORIES,
  type ExperiencePoiSettingsType,
  type ExperienceRoadsStyleType,
  type ProjectLocationCategory,
  type ProjectLocationImportance
} from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import { getCategoryLabel } from "../../utils/category-label.util"
import RoadsStyleTileCP from "./roads-style-tile.cp"
import {
  MAP_STYLE_PRESETS,
  resolveMapStylePresetId,
  type MapStylePresetId
} from "../../utils/mapbox-map-presets.util"

type Props = {
  projectId: string
}

const DEFAULT_POI: ExperiencePoiSettingsType = {
  publicRadiusMeters: 10000,
  publicCategories: [],
  liveMapboxEnabled: false,
  minImportance: "low"
}

export default function MapSettingsPanelCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const { experience, mapCamera } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const [roadsAnchor, setRoadsAnchor] = useState<HTMLElement | null>(null)
  if (!experience) return null

  const poi: ExperiencePoiSettingsType = {
    ...DEFAULT_POI,
    ...(experience.poi ?? {})
  }
  const roadsStyle: ExperienceRoadsStyleType = {
    ...DEFAULT_ROADS_STYLE,
    ...(experience.settings.roadsStyle ?? {})
  }

  const patchSettings = (
    patch: Partial<typeof experience.settings>
  ) => {
    dispatch(setDirtyAct(true))
    void dispatch(
      updateExperienceThunk({
        projectId,
        data: { settings: patch }
      })
    )
  }

  const patchLayers = (patch: Partial<typeof experience.layers>) => {
    dispatch(setDirtyAct(true))
    void dispatch(
      updateExperienceThunk({
        projectId,
        data: { layers: patch }
      })
    )
  }

  const patchPoi = (patch: Partial<ExperiencePoiSettingsType>) => {
    dispatch(setDirtyAct(true))
    void dispatch(
      updateExperienceThunk({
        projectId,
        data: { poi: patch }
      })
    )
  }

  const captureCamera = () => {
    if (!mapCamera) return
    patchSettings({
      centerLongitude: mapCamera.longitude,
      centerLatitude: mapCamera.latitude,
      defaultZoom: mapCamera.zoom,
      pitch: mapCamera.pitch,
      bearing: mapCamera.bearing
    })
  }

  const togglePublicCategory = (
    category: ProjectLocationCategory,
    checked: boolean
  ) => {
    const current = poi.publicCategories ?? []
    const next = checked
      ? [...current, category]
      : current.filter((c) => c !== category)
    patchPoi({ publicCategories: next })
  }

  const patchRoadsStyle = (next: ExperienceRoadsStyleType) => {
    patchSettings({ roadsStyle: next })
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ color: "#f8fafc", mb: 2 }}>
        {s.panelMap}
      </Typography>
      <Button
        fullWidth
        variant="contained"
        startIcon={<CameraIcon />}
        onClick={captureCamera}
        sx={{ mb: 2 }}
      >
        {s.mapCaptureCamera}
      </Button>
      <Stack spacing={2}>
        <Typography variant="subtitle2" sx={{ color: "#94a3b8" }}>
          {s.mapTypeTitle}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={resolveMapStylePresetId(experience.settings.styleUrl)}
          onChange={(_e, value: MapStylePresetId | null) => {
            if (!value) return
            const preset = MAP_STYLE_PRESETS.find((row) => row.id === value)
            if (!preset) return
            patchSettings({ styleUrl: preset.url })
          }}
          sx={{
            flexWrap: "wrap",
            gap: 0.5,
            "& .MuiToggleButton-root": {
              color: "#cbd5e1",
              borderColor: "#334155",
              textTransform: "none",
              "&.Mui-selected": {
                color: "#e0f2fe",
                bgcolor: "rgba(56,189,248,0.18)",
                borderColor: "#38bdf8"
              }
            }
          }}
        >
          {MAP_STYLE_PRESETS.map((preset) => (
            <ToggleButton key={preset.id} value={preset.id}>
              {s[preset.labelKey]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <FormControlLabel
          control={
            <Switch
              checked={experience.settings.terrainEnabled}
              onChange={(e) =>
                patchSettings({ terrainEnabled: e.target.checked })
              }
            />
          }
          label={s.mapTerrain}
          sx={{ color: "#e2e8f0" }}
        />
        <Box>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {s.mapTerrainExaggeration}
          </Typography>
          <Slider
            size="small"
            min={0}
            max={5}
            step={0.1}
            value={
              typeof experience.settings.terrainExaggeration === "number"
                ? experience.settings.terrainExaggeration
                : 1
            }
            onChangeCommitted={(_e, value) =>
              patchSettings({
                terrainExaggeration: Array.isArray(value) ? value[0] : value
              })
            }
          />
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={experience.settings.buildings3DEnabled}
              onChange={(e) =>
                patchSettings({ buildings3DEnabled: e.target.checked })
              }
            />
          }
          label={s.mapBuildings}
          sx={{ color: "#e2e8f0" }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={experience.settings.fogEnabled}
              onChange={(e) =>
                patchSettings({ fogEnabled: e.target.checked })
              }
            />
          }
          label={s.mapFog}
          sx={{ color: "#e2e8f0" }}
        />
        <Typography variant="subtitle2" sx={{ color: "#94a3b8", pt: 1 }}>
          {s.mapLayers}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={experience.layers.lots !== false}
              onChange={(e) => patchLayers({ lots: e.target.checked })}
            />
          }
          label={s.layerLots}
          sx={{ color: "#e2e8f0" }}
        />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <FormControlLabel
            sx={{ color: "#e2e8f0", flex: 1, mr: 0 }}
            control={
              <Switch
                checked={experience.layers.roads !== false}
                onChange={(e) => patchLayers({ roads: e.target.checked })}
              />
            }
            label={s.layerRoads}
          />
          <Tooltip title={s.roadsStyleOpen}>
            <IconButton
              size="small"
              aria-label={s.roadsStyleOpen}
              onClick={(e) => setRoadsAnchor(e.currentTarget)}
              sx={{
                color: roadsAnchor ? "#38bdf8" : "#94a3b8",
                border: "1px solid",
                borderColor: roadsAnchor ? "#38bdf8" : "#334155",
                borderRadius: 1
              }}
            >
              <RoadsStyleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        <RoadsStyleTileCP
          open={Boolean(roadsAnchor)}
          anchorEl={roadsAnchor}
          roadsStyle={roadsStyle}
          onClose={() => setRoadsAnchor(null)}
          onChange={patchRoadsStyle}
        />
        {(
          [
            ["locations", s.layerLocations],
            ["assets", s.layerAssets],
            ["models3D", s.layerModels3d]
          ] as const
        ).map(([key, label]) => (
          <FormControlLabel
            key={key}
            control={
              <Switch
                checked={experience.layers[key] !== false}
                onChange={(e) => patchLayers({ [key]: e.target.checked })}
              />
            }
            label={label}
            sx={{ color: "#e2e8f0" }}
          />
        ))}
        <Typography variant="subtitle2" sx={{ color: "#f8fafc", pt: 2 }}>
          {s.poiPublicTitle}
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {s.poiPublicHint}
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {s.poiPublicRadius}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={poi.publicRadiusMeters}
          onChange={(_e, value: number | null) => {
            if (value) patchPoi({ publicRadiusMeters: value })
          }}
          sx={{ flexWrap: "wrap" }}
        >
          <ToggleButton value={5000}>{s.discoverRadius5}</ToggleButton>
          <ToggleButton value={10000}>{s.discoverRadius10}</ToggleButton>
          <ToggleButton value={20000}>{s.discoverRadius20}</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {s.poiPublicCategories}
        </Typography>
        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5}>
          {LOCATION_CATEGORIES.filter((c) => c !== "road" && c !== "other").map(
            (cat) => (
              <FormControlLabel
                key={cat}
                control={
                  <Checkbox
                    size="small"
                    checked={poi.publicCategories.includes(cat)}
                    onChange={(e) =>
                      togglePublicCategory(cat, e.target.checked)
                    }
                  />
                }
                label={getCategoryLabel(cat)}
                sx={{ color: "#e2e8f0", mr: 0 }}
              />
            )
          )}
        </Stack>
        <TextField
          select
          size="small"
          label={s.poiMinImportance}
          value={poi.minImportance}
          onChange={(e) =>
            patchPoi({
              minImportance: e.target.value as ProjectLocationImportance
            })
          }
          sx={{
            "& .MuiInputBase-root": { color: "#e2e8f0" },
            "& .MuiInputLabel-root": { color: "#94a3b8" }
          }}
        >
          <MenuItem value="low">{s.importanceLow}</MenuItem>
          <MenuItem value="medium">{s.importanceMedium}</MenuItem>
          <MenuItem value="high">{s.importanceHigh}</MenuItem>
          <MenuItem value="featured">{s.importanceFeatured}</MenuItem>
        </TextField>
        <FormControlLabel
          control={
            <Switch
              checked={poi.liveMapboxEnabled}
              onChange={(e) =>
                patchPoi({ liveMapboxEnabled: e.target.checked })
              }
            />
          }
          label={s.poiLiveMapbox}
          sx={{ color: "#e2e8f0" }}
        />
      </Stack>
    </Box>
  )
}
