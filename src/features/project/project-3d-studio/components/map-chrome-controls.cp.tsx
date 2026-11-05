import React from "react"
import {
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography
} from "@mui/material"
import {
  NearMe as SelectIcon,
  Place as PointIcon,
  Timeline as LineIcon,
  Pentagon as PolygonIcon,
  ThreeDRotation as Pitch3dIcon,
  Map as FlatIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  setActiveToolAct,
  setDirtyAct,
  updateExperienceThunk
} from "../slice/project-3d-studio.slice"
import type { StudioTool } from "../types/project-experience.types"
import {
  MAP_STYLE_PRESETS,
  resolveMapStylePresetId,
  type MapStylePresetId
} from "../utils/mapbox-map-presets.util"
import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
  onPitchPreset: (mode: "3d" | "flat") => void
}

const DRAW_TOOLS: Array<{
  tool: StudioTool
  label: string
  Icon: typeof SelectIcon
}> = [
  { tool: "select", label: s.toolSelect, Icon: SelectIcon },
  { tool: "point", label: s.toolPoint, Icon: PointIcon },
  { tool: "line", label: s.toolLine, Icon: LineIcon },
  { tool: "polygon", label: s.toolPolygon, Icon: PolygonIcon }
]

export default function MapChromeControlsCP({
  projectId,
  onPitchPreset
}: Props) {
  const dispatch = useAppDispatch()
  const { experience, activeTool } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  if (!experience) return null

  const presetId = resolveMapStylePresetId(experience.settings.styleUrl)

  const setStyle = (id: MapStylePresetId | null) => {
    if (!id) return
    const preset = MAP_STYLE_PRESETS.find((row) => row.id === id)
    if (!preset) return
    dispatch(setDirtyAct(true))
    void dispatch(
      updateExperienceThunk({
        projectId,
        data: { settings: { styleUrl: preset.url } }
      })
    )
  }

  return (
    <Stack
      spacing={1}
      sx={{
        position: "absolute",
        left: 12,
        bottom: 12,
        zIndex: 2,
        maxWidth: "min(520px, calc(100% - 24px))",
        pointerEvents: "none",
        "& > *": { pointerEvents: "auto" }
      }}
    >
      <Stack
        spacing={0.75}
        sx={{
          p: 1,
          bgcolor: "rgba(15,23,42,0.92)",
          border: "1px solid #334155",
          borderRadius: 1.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
        }}
      >
        <Typography variant="caption" sx={{ color: "#94a3b8", px: 0.5 }}>
          {s.mapTypeTitle}
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={presetId}
          onChange={(_e, value: MapStylePresetId | null) => setStyle(value)}
          sx={{
            flexWrap: "wrap",
            gap: 0.5,
            "& .MuiToggleButton-root": {
              color: "#cbd5e1",
              borderColor: "#334155",
              px: 1,
              py: 0.25,
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
      </Stack>
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        sx={{
          p: 0.75,
          bgcolor: "rgba(15,23,42,0.92)",
          border: "1px solid #334155",
          borderRadius: 1.5,
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "#94a3b8", px: 0.5, display: { xs: "none", sm: "block" } }}
        >
          {s.mapToolsTitle}
        </Typography>
        {DRAW_TOOLS.map(({ tool, label, Icon }) => {
          const active = activeTool === tool
          return (
            <Tooltip key={tool} title={label}>
              <IconButton
                size="small"
                aria-label={label}
                onClick={() => dispatch(setActiveToolAct(tool))}
                sx={{
                  color: active ? "#38bdf8" : "#94a3b8",
                  bgcolor: active ? "rgba(56,189,248,0.14)" : "transparent",
                  borderRadius: 1
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          )
        })}
        <Tooltip title={s.mapPitch3d}>
          <IconButton
            size="small"
            aria-label={s.mapPitch3d}
            onClick={() => onPitchPreset("3d")}
            sx={{ color: "#94a3b8" }}
          >
            <Pitch3dIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title={s.mapPitchFlat}>
          <IconButton
            size="small"
            aria-label={s.mapPitchFlat}
            onClick={() => onPitchPreset("flat")}
            sx={{ color: "#94a3b8" }}
          >
            <FlatIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  )
}
