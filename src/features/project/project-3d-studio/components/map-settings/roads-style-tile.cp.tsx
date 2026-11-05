import React, { useEffect, useMemo, useState } from "react"
import {
  Box,
  Button,
  Popover,
  Slider,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {
  DEFAULT_ROADS_STYLE,
  type ExperienceRoadsStyleType
} from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  anchorEl: HTMLElement | null
  open: boolean
  roadsStyle: ExperienceRoadsStyleType
  onClose: () => void
  onChange: (next: ExperienceRoadsStyleType) => void
}

function normalizeHex(value: string): string {
  const trimmed = value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase()
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const [, a, b, c] = trimmed
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase()
  }
  return DEFAULT_ROADS_STYLE.color
}

export default function RoadsStyleTileCP({
  anchorEl,
  open,
  roadsStyle,
  onClose,
  onChange
}: Props) {
  const [draftColor, setDraftColor] = useState(roadsStyle.color)
  const styleKey = useMemo(
    () => `${roadsStyle.color}|${roadsStyle.width}|${roadsStyle.opacity}`,
    [roadsStyle.color, roadsStyle.width, roadsStyle.opacity]
  )

  useEffect(() => {
    setDraftColor(roadsStyle.color)
  }, [styleKey, roadsStyle.color])

  const commitColor = (raw: string) => {
    const color = normalizeHex(raw)
    setDraftColor(color)
    onChange({ ...roadsStyle, color })
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          p: 2,
          width: 280,
          bgcolor: "#0f172a",
          border: "1px solid #334155",
          color: "#e2e8f0"
        }
      }}
    >
      <Typography variant="subtitle2" sx={{ color: "#f8fafc", mb: 1.5 }}>
        {s.roadsStyleTitle}
      </Typography>
      <Stack spacing={2}>
        <Box>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {s.roadsStyleColor}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Box
              component="input"
              type="color"
              value={normalizeHex(draftColor)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                commitColor(e.target.value)
              }
              sx={{
                width: 40,
                height: 36,
                border: "1px solid #334155",
                borderRadius: 1,
                bgcolor: "transparent",
                cursor: "pointer",
                p: 0.25
              }}
            />
            <TextField
              size="small"
              value={draftColor}
              onChange={(e) => setDraftColor(e.target.value)}
              onBlur={() => commitColor(draftColor)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitColor(draftColor)
              }}
              sx={{
                flex: 1,
                "& .MuiInputBase-root": { color: "#e2e8f0" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" }
              }}
            />
          </Stack>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {s.roadsStyleWeight}: {roadsStyle.width}
          </Typography>
          <Slider
            size="small"
            min={1}
            max={12}
            step={0.5}
            value={roadsStyle.width}
            onChangeCommitted={(_e, value) =>
              onChange({
                ...roadsStyle,
                width: Array.isArray(value) ? value[0] : value
              })
            }
          />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            {s.roadsStyleOpacity}: {Math.round(roadsStyle.opacity * 100)}%
          </Typography>
          <Slider
            size="small"
            min={0.2}
            max={1}
            step={0.05}
            value={roadsStyle.opacity}
            onChangeCommitted={(_e, value) =>
              onChange({
                ...roadsStyle,
                opacity: Array.isArray(value) ? value[0] : value
              })
            }
          />
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onChange({ ...DEFAULT_ROADS_STYLE })}
          sx={{ color: "#e2e8f0", borderColor: "#334155" }}
        >
          {s.roadsStyleReset}
        </Button>
      </Stack>
    </Popover>
  )
}
