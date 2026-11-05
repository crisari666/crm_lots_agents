import React, { useEffect, useState } from "react"
import { Box, Button, Drawer, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import { upsertScenesThunk } from "../../slice/project-3d-studio.slice"
import type { ExperienceSceneType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
  scene: ExperienceSceneType | null
  onClose: () => void
}

export default function SceneEditorDrawerCP({
  projectId,
  scene,
  onClose
}: Props) {
  const dispatch = useAppDispatch()
  const { experience, mapCamera } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [transitionSeconds, setTransitionSeconds] = useState("4")
  const [narrativeTitle, setNarrativeTitle] = useState("")
  const [narrativeText, setNarrativeText] = useState("")
  const [camera, setCamera] = useState(scene?.camera ?? null)

  useEffect(() => {
    if (!scene) return
    setTitle(scene.title)
    setDescription(scene.description ?? "")
    setTransitionSeconds(String(Math.max(1, Math.round(scene.durationMs / 1000)) || 4))
    setNarrativeTitle(scene.narrative?.title ?? "")
    setNarrativeText(scene.narrative?.text ?? "")
    setCamera(scene.camera)
  }, [scene])

  if (!scene || !experience) return null

  const save = async () => {
    const seconds = Number(transitionSeconds) || 4
    const nextScenes = experience.scenes.map((row) =>
      row.id === scene.id
        ? {
            ...row,
            title,
            description,
            durationMs: Math.max(500, Math.round(seconds * 1000)),
            camera: camera ?? row.camera,
            narrative:
              narrativeTitle.trim() || narrativeText.trim()
                ? { title: narrativeTitle, text: narrativeText }
                : null
          }
        : row
    )
    await dispatch(upsertScenesThunk({ projectId, scenes: nextScenes }))
    onClose()
  }

  const useCurrentCamera = () => {
    if (!mapCamera) return
    setCamera({ ...mapCamera })
  }

  const remove = async () => {
    const nextScenes = experience.scenes.filter((row) => row.id !== scene.id)
    await dispatch(upsertScenesThunk({ projectId, scenes: nextScenes }))
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={Boolean(scene)}
      onClose={onClose}
      PaperProps={{ sx: { width: 380, bgcolor: "#0f172a", color: "#e2e8f0" } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {s.panelScenes}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={s.name}
            size="small"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.description}
            size="small"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label={s.scenesDuration}
            size="small"
            type="number"
            value={transitionSeconds}
            onChange={(e) => setTransitionSeconds(e.target.value)}
            helperText={s.scenesDurationHint}
            fullWidth
            inputProps={{ min: 1, step: 1 }}
          />
          <TextField
            label={s.scenesNarrativeTitle}
            size="small"
            value={narrativeTitle}
            onChange={(e) => setNarrativeTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.scenesNarrativeText}
            size="small"
            value={narrativeText}
            onChange={(e) => setNarrativeText(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <Button variant="outlined" onClick={useCurrentCamera}>
            {s.scenesUseCamera}
          </Button>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => void save()}>
              {s.save}
            </Button>
            <Button color="error" onClick={() => void remove()}>
              {s.delete}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}
