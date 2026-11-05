import React, { useCallback, useEffect, useRef } from "react"
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  loadLivePreviewThunk,
  loadStudioThunk,
  resetStudioAct,
  setActivePanelAct,
  setActiveSceneIdAct,
  setActiveToolAct,
  setPreviewModeAct,
  setScenePlayingAct
} from "../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"
import StudioTopbarCP from "./studio-topbar.cp"
import StudioRailCP from "./studio-rail.cp"
import StudioMapCP, { StudioMapHandle } from "./studio-map.cp"
import LocationsPanelCP from "./locations/locations-panel.cp"
import MapSettingsPanelCP from "./map-settings/map-settings-panel.cp"
import AssetsPanelCP from "./assets/assets-panel.cp"
import ScenesPanelCP from "./scenes/scenes-panel.cp"
import PublishPanelCP from "./publish/publish-panel.cp"
import ScenePlayerBarCP from "./scenes/scene-player-bar.cp"
import ProjectPinControlCP from "./project-pin-control.cp"
import MapChromeControlsCP from "./map-chrome-controls.cp"
import StudioExperiencePreviewCP from "./studio-experience-preview.cp"

type Props = {
  projectId: string
}

export default function StudioShellCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const mapRef = useRef<StudioMapHandle | null>(null)
  const {
    loading,
    error,
    activePanel,
    previewMode,
    experience,
    dirty
  } = useAppSelector((state: RootState) => state.project3dStudio)
  const hubRows = useAppSelector(
    (state: RootState) => state.lotInventory.hubRows
  )
  const projectTitle =
    hubRows.find((row) => row.projectId === projectId)?.title ?? projectId

  useEffect(() => {
    void dispatch(loadStudioThunk(projectId))
    return () => {
      dispatch(resetStudioAct())
    }
  }, [dispatch, projectId])

  useEffect(() => {
    if (!previewMode || !experience?.poi?.liveMapboxEnabled) return
    void dispatch(
      loadLivePreviewThunk({
        projectId,
        radiusMeters: experience.poi.publicRadiusMeters || 10000,
        categories:
          (experience.poi.publicCategories?.length ?? 0) > 0
            ? experience.poi.publicCategories
            : undefined
      })
    )
  }, [dispatch, previewMode, projectId, experience?.poi])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "v" || e.key === "V") dispatch(setActiveToolAct("select"))
      if (e.key === "p" || e.key === "P") dispatch(setActiveToolAct("point"))
      if (e.key === "l" || e.key === "L") dispatch(setActiveToolAct("line"))
      if (e.key === "g" || e.key === "G") dispatch(setActiveToolAct("polygon"))
      if (e.key === "Escape") {
        dispatch(setActiveToolAct("select"))
        dispatch(setPreviewModeAct(false))
      }
      if (e.key === " ") {
        e.preventDefault()
        dispatch(setScenePlayingAct(true))
        dispatch(setActivePanelAct("scenes"))
      }
      if (e.key === "]") {
        const scenes = [...(experience?.scenes ?? [])].sort(
          (a, b) => a.sortOrder - b.sortOrder
        )
        if (scenes.length === 0) return
        dispatch(setActiveSceneIdAct(scenes[0].id))
        mapRef.current?.flyToScene(scenes[0].id)
      }
      if (e.key === "[") {
        const scenes = [...(experience?.scenes ?? [])].sort(
          (a, b) => a.sortOrder - b.sortOrder
        )
        if (scenes.length === 0) return
        const last = scenes[scenes.length - 1]
        dispatch(setActiveSceneIdAct(last.id))
        mapRef.current?.flyToScene(last.id)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dispatch, experience?.scenes])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = s.unsavedWarn
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  const flyToScene = useCallback((sceneId: string, turn?: 1 | -1) => {
    mapRef.current?.flyToScene(sceneId, turn)
  }, [])
  const cancelSceneMotion = useCallback(() => {
    mapRef.current?.cancelSceneMotion()
  }, [])

  const flyToLocation = useCallback((locationId: string) => {
    mapRef.current?.flyToLocation(locationId)
  }, [])

  const setPitchPreset = useCallback((mode: "3d" | "flat") => {
    mapRef.current?.setPitchPreset(mode)
  }, [])

  // Keep panels mounted (hidden) so map overlays / dialogs are not torn down
  // when switching the studio rail.
  const panelNodes: Array<{ id: typeof activePanel; node: React.ReactNode }> = [
    {
      id: "locations",
      node: (
        <LocationsPanelCP
          projectId={projectId}
          flyToLocation={flyToLocation}
        />
      )
    },
    {
      id: "map",
      node: <MapSettingsPanelCP projectId={projectId} />
    },
    {
      id: "assets",
      node: <AssetsPanelCP projectId={projectId} />
    },
    {
      id: "scenes",
      node: <ScenesPanelCP projectId={projectId} />
    },
    {
      id: "publish",
      node: <PublishPanelCP projectId={projectId} />
    }
  ]

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 128px)",
        minHeight: 480,
        overflow: "hidden",
        bgcolor: "#020617",
        borderRadius: 1,
        border: "1px solid #1e293b"
      }}
    >
      <StudioTopbarCP projectId={projectId} projectTitle={projectTitle} />
      <Box sx={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {!previewMode && (
          <Box
            sx={{
              width: 380,
              flexShrink: 0,
              bgcolor: "#0b1220",
              borderRight: "1px solid #1e293b",
              overflow: "hidden"
            }}
          >
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                <CircularProgress size={28} />
                <Typography variant="caption" sx={{ color: "#94a3b8", mt: 1 }}>
                  {s.loading}
                </Typography>
              </Stack>
            ) : error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                {s.loadError}
              </Alert>
            ) : (
              panelNodes.map(({ id, node }) => (
                <Box
                  key={id}
                  sx={{
                    display: activePanel === id ? "flex" : "none",
                    flexDirection: "column",
                    height: "100%",
                    overflow: "hidden"
                  }}
                >
                  {node}
                </Box>
              ))
            )}
          </Box>
        )}
        <Box sx={{ flex: 1, position: "relative", minWidth: 0 }}>
          <StudioMapCP ref={mapRef} projectId={projectId} />
          {!previewMode && <ProjectPinControlCP />}
          {!previewMode && (
            <MapChromeControlsCP
              projectId={projectId}
              onPitchPreset={setPitchPreset}
            />
          )}
          {(activePanel === "scenes" || previewMode) && (
            <ScenePlayerBarCP
              flyToScene={flyToScene}
              cancelSceneMotion={cancelSceneMotion}
            />
          )}
          {previewMode && (
            <Box sx={{ position: "absolute", inset: 0, zIndex: 4, bgcolor: "#020617" }}>
              <StudioExperiencePreviewCP projectId={projectId} />
            </Box>
          )}
        </Box>
        {!previewMode && <StudioRailCP />}
      </Box>
    </Box>
  )
}
