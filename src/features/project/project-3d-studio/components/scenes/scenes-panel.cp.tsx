import React, { useState } from "react"
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  setActiveSceneIdAct,
  setSelectionAct,
  upsertScenesThunk
} from "../../slice/project-3d-studio.slice"
import type { ExperienceSceneType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import SceneEditorDrawerCP from "./scene-editor-drawer.cp"

type Props = {
  projectId: string
}

function createSceneId(): string {
  return `scene_${Date.now().toString(36)}`
}

export default function ScenesPanelCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const { experience, mapCamera, selection } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const [editing, setEditing] = useState<ExperienceSceneType | null>(null)
  const scenes = experience?.scenes ?? []

  const addScene = () => {
    if (!mapCamera) return
    const scene: ExperienceSceneType = {
      id: createSceneId(),
      title: `Escena ${scenes.length + 1}`,
      description: "",
      camera: { ...mapCamera },
      durationMs: 4000,
      visibleLayers: ["lots", "locations", "assets"],
      locationIds: [],
      assetIds: [],
      narrative: null,
      sortOrder: scenes.length
    }
    void dispatch(
      upsertScenesThunk({
        projectId,
        scenes: [...scenes, scene]
      })
    )
    setEditing(scene)
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addScene}
          disabled={!mapCamera}
        >
          {s.scenesAdd}
        </Button>
      </Stack>
      {scenes.length === 0 ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <Typography sx={{ color: "#f8fafc", mb: 1 }}>
            {s.scenesEmptyTitle}
          </Typography>
          <Button
            variant="contained"
            onClick={addScene}
            disabled={!mapCamera}
          >
            {s.scenesEmptyAction}
          </Button>
        </Box>
      ) : (
        <List dense sx={{ overflow: "auto", flex: 1, px: 1 }}>
          {[...scenes]
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((scene) => (
              <ListItemButton
                key={scene.id}
                selected={
                  (selection?.kind === "scene" && selection.id === scene.id) ||
                  editing?.id === scene.id
                }
                onClick={() => {
                  dispatch(setSelectionAct({ kind: "scene", id: scene.id }))
                  dispatch(setActiveSceneIdAct(scene.id))
                  setEditing(scene)
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  color: "#e2e8f0",
                  "&.Mui-selected": { bgcolor: "rgba(56,189,248,0.16)" }
                }}
              >
                <ListItemText
                  primary={scene.title}
                  secondary={
                    `${Math.max(1, Math.round(scene.durationMs / 1000))} s`
                  }
                />
              </ListItemButton>
            ))}
        </List>
      )}
      <SceneEditorDrawerCP
        projectId={projectId}
        scene={editing}
        onClose={() => setEditing(null)}
      />
    </Box>
  )
}
