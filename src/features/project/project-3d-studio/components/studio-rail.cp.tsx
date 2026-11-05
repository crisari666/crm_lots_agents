import React from "react"
import { IconButton, Stack, Tooltip } from "@mui/material"
import {
  Place as LocationsIcon,
  Layers as MapIcon,
  PermMedia as AssetsIcon,
  MovieFilter as ScenesIcon,
  Publish as PublishIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { setActivePanelAct } from "../slice/project-3d-studio.slice"
import type { StudioPanel } from "../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"

const ITEMS: Array<{ panel: StudioPanel; label: string; Icon: typeof LocationsIcon }> = [
  { panel: "locations", label: s.panelLocations, Icon: LocationsIcon },
  { panel: "map", label: s.panelMap, Icon: MapIcon },
  { panel: "assets", label: s.panelAssets, Icon: AssetsIcon },
  { panel: "scenes", label: s.panelScenes, Icon: ScenesIcon },
  { panel: "publish", label: s.panelPublish, Icon: PublishIcon }
]

export default function StudioRailCP() {
  const dispatch = useAppDispatch()
  const activePanel = useAppSelector(
    (state: RootState) => state.project3dStudio.activePanel
  )
  return (
    <Stack
      spacing={1}
      sx={{
        width: 56,
        flexShrink: 0,
        py: 1.5,
        px: 0.5,
        bgcolor: "#0f172a",
        borderLeft: "1px solid #1e293b",
        alignItems: "center",
        zIndex: 2
      }}
    >
      {ITEMS.map(({ panel, label, Icon }) => {
        const active = activePanel === panel
        return (
          <Tooltip key={panel} title={label} placement="left">
            <IconButton
              aria-label={label}
              onClick={() => dispatch(setActivePanelAct(panel))}
              sx={{
                color: active ? "#38bdf8" : "#94a3b8",
                bgcolor: active ? "rgba(56,189,248,0.12)" : "transparent",
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(148,163,184,0.12)" }
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      })}
    </Stack>
  )
}
