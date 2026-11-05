import React from "react"
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography
} from "@mui/material"
import {
  ArrowBack as BackIcon,
  Visibility as PreviewIcon,
  VisibilityOff as ExitPreviewIcon,
  Publish as PublishIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  publishExperienceThunk,
  setPreviewModeAct
} from "../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
  projectTitle: string
}

function statusLabel(status: string | undefined): string {
  if (status === "published") return s.statusPublished
  if (status === "disabled") return s.statusDisabled
  return s.statusDraft
}

export default function StudioTopbarCP({ projectId, projectTitle }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { experience, previewMode, actionLoading, dirty } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )

  const goBack = () => {
    if (dirty && !window.confirm(s.unsavedWarn)) return
    navigate(`/dashboard/lot-inventory/${projectId}`)
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        px: 2,
        py: 1,
        bgcolor: "#0b1220",
        borderBottom: "1px solid #1e293b",
        minHeight: 56
      }}
    >
      <IconButton aria-label={s.backToInventory} onClick={goBack} sx={{ color: "#e2e8f0" }}>
        <BackIcon />
      </IconButton>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ color: "#f8fafc" }}>
          {projectTitle} · {s.studioTitle}
        </Typography>
      </Box>
      <Chip
        size="small"
        label={statusLabel(experience?.status)}
        color={experience?.status === "published" ? "success" : "default"}
        sx={{ cursor: "default" }}
      />
      {experience && (
        <Chip
          size="small"
          variant="outlined"
          label={s.versionLabel.replace("{version}", String(experience.version))}
          sx={{ color: "#94a3b8", borderColor: "#334155", cursor: "default" }}
        />
      )}
      <Button
        size="small"
        variant="outlined"
        startIcon={previewMode ? <ExitPreviewIcon /> : <PreviewIcon />}
        onClick={() => dispatch(setPreviewModeAct(!previewMode))}
        sx={{ color: "#e2e8f0", borderColor: "#334155" }}
      >
        {previewMode ? s.exitPreview : s.previewClient}
      </Button>
      <Button
        size="small"
        variant="contained"
        startIcon={<PublishIcon />}
        disabled={actionLoading}
        onClick={() => void dispatch(publishExperienceThunk(projectId))}
      >
        {actionLoading ? s.publishing : s.publish}
      </Button>
    </Stack>
  )
}
