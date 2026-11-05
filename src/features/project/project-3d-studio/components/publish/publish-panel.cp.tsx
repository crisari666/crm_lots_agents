import React, { useMemo, useState } from "react"
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {
  CheckCircle as OkIcon,
  ErrorOutline as ErrIcon,
  ContentCopy as CopyIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  disableExperienceThunk,
  publishExperienceThunk
} from "../../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
}

export default function PublishPanelCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const { experience, locations, assets, actionLoading } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const [copied, setCopied] = useState(false)

  const checklist = useMemo(() => {
    const centerOk =
      experience?.settings.centerLongitude != null &&
      experience?.settings.centerLatitude != null
    const scenesOk = (experience?.scenes.length ?? 0) > 0
    const unverified = locations.filter((l) => !l.isVerified).length
    const hidden =
      locations.filter((l) => !l.isVisible).length +
      assets.filter((a) => !a.visible).length
    return { centerOk, scenesOk, unverified, hidden }
  }, [experience, locations, assets])

  const publicUrl = useMemo(() => {
    const base = (import.meta.env.VITE_URL_RAG_AGENT as string | undefined)
      ?.trim()
      .replace(/\/$/, "")
    if (!base) return ""
    return `${base}/projects/${projectId}/experience/public`
  }, [projectId])

  const copyUrl = async () => {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ color: "#f8fafc", mb: 2 }}>
        {s.publishChecklist}
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            {checklist.centerOk ? (
              <OkIcon color="success" />
            ) : (
              <ErrIcon color="warning" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              checklist.centerOk
                ? s.publishCenterOk
                : s.publishCenterMissing
            }
            sx={{ color: "#e2e8f0" }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {checklist.scenesOk ? (
              <OkIcon color="success" />
            ) : (
              <ErrIcon color="warning" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={
              checklist.scenesOk
                ? s.publishScenesOk
                : s.publishScenesMissing
            }
            sx={{ color: "#e2e8f0" }}
          />
        </ListItem>
        {checklist.unverified > 0 && (
          <ListItem>
            <ListItemIcon>
              <ErrIcon color="warning" />
            </ListItemIcon>
            <ListItemText
              primary={s.publishUnverified.replace(
                "{count}",
                String(checklist.unverified)
              )}
              sx={{ color: "#e2e8f0" }}
            />
          </ListItem>
        )}
        {checklist.hidden > 0 && (
          <ListItem>
            <ListItemIcon>
              <ErrIcon color="info" />
            </ListItemIcon>
            <ListItemText
              primary={s.publishHidden.replace(
                "{count}",
                String(checklist.hidden)
              )}
              sx={{ color: "#e2e8f0" }}
            />
          </ListItem>
        )}
      </List>
      <Stack spacing={1.5} sx={{ mt: 2 }}>
        <Button
          variant="contained"
          disabled={
            actionLoading || !checklist.centerOk || !checklist.scenesOk
          }
          onClick={() => void dispatch(publishExperienceThunk(projectId))}
        >
          {actionLoading ? s.publishing : s.publish}
        </Button>
        {experience?.status === "published" && (
          <Alert severity="success">{s.publishSuccess}</Alert>
        )}
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {s.publishPublicUrl}
        </Typography>
        <TextField
          size="small"
          value={publicUrl}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <Button
          startIcon={<CopyIcon />}
          variant="outlined"
          onClick={() => void copyUrl()}
          sx={{ color: "#e2e8f0", borderColor: "#334155" }}
        >
          {copied ? s.publishCopied : s.publishCopyUrl}
        </Button>
        <Button
          color="warning"
          onClick={() => void dispatch(disableExperienceThunk(projectId))}
        >
          {s.publishDisable}
        </Button>
        {experience?.publishedVersion != null && (
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            published v{experience.publishedVersion}
            {experience.publishedAt
              ? ` · ${new Date(experience.publishedAt).toLocaleString()}`
              : ""}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
