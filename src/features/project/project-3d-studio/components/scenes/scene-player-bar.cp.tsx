import React, { useEffect, useMemo, useRef } from "react"
import { Box, IconButton, Stack, Typography } from "@mui/material"
import {
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  setActiveSceneIdAct,
  setScenePlayingAct
} from "../../slice/project-3d-studio.slice"
import { tourTurnFromBearings } from "@omega/project-experience"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  flyToScene: (sceneId: string, turn?: 1 | -1) => void
  cancelSceneMotion: () => void
}

export default function ScenePlayerBarCP({
  flyToScene,
  cancelSceneMotion
}: Props) {
  const dispatch = useAppDispatch()
  const scenePlaying = useAppSelector(
    (state: RootState) => state.project3dStudio.scenePlaying
  )
  const showSceneTitles = useAppSelector(
    (state: RootState) =>
      state.project3dStudio.experience?.settings.showSceneTitles !== false
  )
  const activeSceneId = useAppSelector(
    (state: RootState) => state.project3dStudio.activeSceneId
  )
  const rawScenes = useAppSelector(
    (state: RootState) => state.project3dStudio.experience?.scenes
  )
  const timerRef = useRef<number | null>(null)
  const turnRef = useRef<1 | -1 | null>(null)
  const scenes = useMemo(
    () => [...(rawScenes ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [rawScenes]
  )

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => () => clearTimer(), [])

  useEffect(() => {
    if (!scenePlaying || scenes.length === 0) {
      clearTimer()
      return
    }
    const currentId = activeSceneId ?? scenes[0].id
    if (activeSceneId == null) {
      dispatch(setActiveSceneIdAct(currentId))
      return
    }
    const playlistTurn = tourTurnFromBearings(
      scenes.map((row) => row.camera.bearing)
    )
    const turn = turnRef.current ?? playlistTurn
    turnRef.current = null
    flyToScene(currentId, turn)
    const scene = scenes.find((row) => row.id === currentId) ?? scenes[0]
    const travelMs = scene.durationMs
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      const idx = scenes.findIndex((row) => row.id === currentId)
      const next = scenes[(idx + 1) % scenes.length]
      dispatch(setActiveSceneIdAct(next.id))
    }, travelMs)
    return () => {
      clearTimer()
      cancelSceneMotion()
    }
  }, [scenePlaying, activeSceneId, scenes, dispatch, flyToScene, cancelSceneMotion])

  if (scenes.length === 0) return null

  const goPrev = () => {
    const idx = Math.max(
      0,
      scenes.findIndex((row) => row.id === activeSceneId)
    )
    const prev = scenes[(idx - 1 + scenes.length) % scenes.length]
    const playlistTurn = tourTurnFromBearings(
      scenes.map((row) => row.camera.bearing)
    )
    const turn: 1 | -1 = playlistTurn === 1 ? -1 : 1
    turnRef.current = turn
    dispatch(setActiveSceneIdAct(prev.id))
    if (!scenePlaying) {
      flyToScene(prev.id, turn)
      turnRef.current = null
    }
  }

  const goNext = () => {
    const idx = Math.max(
      0,
      scenes.findIndex((row) => row.id === activeSceneId)
    )
    const next = scenes[(idx + 1) % scenes.length]
    const turn = tourTurnFromBearings(scenes.map((row) => row.camera.bearing))
    turnRef.current = turn
    dispatch(setActiveSceneIdAct(next.id))
    if (!scenePlaying) {
      flyToScene(next.id, turn)
      turnRef.current = null
    }
  }

  const current =
    scenes.find((row) => row.id === activeSceneId) ?? scenes[0]

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        bottom: 16,
        transform: "translateX(-50%)",
        bgcolor: "rgba(15,23,42,0.92)",
        border: "1px solid #334155",
        borderRadius: 1.5,
        px: 0.5,
        py: 0.5,
        zIndex: 6
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.25}>
        <IconButton
          size="small"
          aria-label={s.scenesPrev}
          onClick={goPrev}
          sx={{ color: "#e2e8f0" }}
        >
          <PrevIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label={scenePlaying ? s.scenesPause : s.scenesPlay}
          onClick={() => dispatch(setScenePlayingAct(!scenePlaying))}
          sx={{ color: "#38bdf8" }}
        >
          {scenePlaying ? (
            <PauseIcon fontSize="small" />
          ) : (
            <PlayIcon fontSize="small" />
          )}
        </IconButton>
        <IconButton
          size="small"
          aria-label={s.scenesNext}
          onClick={goNext}
          sx={{ color: "#e2e8f0" }}
        >
          <NextIcon fontSize="small" />
        </IconButton>
        {showSceneTitles && (
          <Typography
            variant="caption"
            sx={{ color: "#f8fafc", maxWidth: 140, px: 0.5 }}
            noWrap
          >
            {current.title}
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
