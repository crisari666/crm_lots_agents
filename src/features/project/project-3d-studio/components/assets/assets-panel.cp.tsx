import React, { useState } from "react"
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography
} from "@mui/material"
import {
  CloudUpload as UploadIcon,
  DeleteOutline as DeleteIcon,
  Place as PlaceIcon,
  MyLocation as RepositionIcon
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  deleteResourceThunk,
  setActiveToolAct,
  setPlacingAssetIdAct,
  setSelectionAct
} from "../../slice/project-3d-studio.slice"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"
import ResourceUploadDialogCP from "./resource-upload-dialog.cp"
import PlaceAssetDialogCP from "./place-asset-dialog.cp"
import AssetEditorDrawerCP from "./asset-editor-drawer.cp"

type Props = {
  projectId: string
}

type AssetsTab = "library" | "placements"

export default function AssetsPanelCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const { assets, resources, selection } = useAppSelector(
    (state: RootState) => state.project3dStudio
  )
  const [tab, setTab] = useState<AssetsTab>("library")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [placeOpen, setPlaceOpen] = useState(false)
  const [placeResourceId, setPlaceResourceId] = useState<string | null>(null)
  const selectedAsset =
    selection?.kind === "asset"
      ? assets.find((a) => String(a._id) === String(selection.id)) ?? null
      : null

  const openPlace = (resourceId?: string) => {
    setPlaceResourceId(resourceId ?? null)
    setPlaceOpen(true)
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Tabs
        value={tab}
        onChange={(_e, value: AssetsTab) => setTab(value)}
        sx={{
          px: 1,
          minHeight: 40,
          "& .MuiTab-root": { minHeight: 40, color: "#94a3b8" },
          "& .Mui-selected": { color: "#38bdf8" },
          "& .MuiTabs-indicator": { bgcolor: "#38bdf8" }
        }}
      >
        <Tab value="library" label={s.assetsTabLibrary} />
        <Tab value="placements" label={s.assetsTabPlacements} />
      </Tabs>
      {tab === "library" ? (
        <>
          <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setUploadOpen(true)}
            >
              {s.assetsUpload}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<PlaceIcon />}
              disabled={resources.length === 0}
              onClick={() => openPlace()}
              sx={{ color: "#e2e8f0", borderColor: "#334155" }}
            >
              {s.assetsPlaceFromLibrary}
            </Button>
          </Stack>
          {resources.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#f8fafc", mb: 1 }}>
                {s.assetsLibraryEmptyTitle}
              </Typography>
              <Button variant="contained" onClick={() => setUploadOpen(true)}>
                {s.assetsLibraryEmptyAction}
              </Button>
            </Box>
          ) : (
            <List dense sx={{ overflow: "auto", flex: 1, px: 1 }}>
              {resources.map((resource) => (
                <ListItemButton
                  key={resource._id}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    color: "#e2e8f0",
                    pr: 10
                  }}
                  onClick={() => openPlace(resource._id)}
                >
                  <ListItemText
                    primary={resource.name}
                    secondary={`${resource.type} · ${s.assetsReuseResource}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={s.assetsPlaceFromLibrary}
                      onClick={() => openPlace(resource._id)}
                      sx={{ color: "#38bdf8" }}
                    >
                      <PlaceIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={s.delete}
                      onClick={(event) => {
                        event.stopPropagation()
                        const placementCount = assets.filter(
                          (asset) => asset.resourceId === resource._id
                        ).length
                        const message =
                          placementCount > 0
                            ? `${s.assetsDeleteResourceConfirm} (${placementCount})`
                            : s.assetsDeleteResourceConfirm
                        if (!window.confirm(message)) return
                        void dispatch(
                          deleteResourceThunk({
                            projectId,
                            resourceId: resource._id
                          })
                        )
                      }}
                      sx={{ color: "#f87171" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItemButton>
              ))}
            </List>
          )}
        </>
      ) : (
        <>
          <Stack direction="row" spacing={1} sx={{ p: 1.5 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<PlaceIcon />}
              disabled={resources.length === 0}
              onClick={() => openPlace()}
            >
              {s.assetsPlaceFromLibrary}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<RepositionIcon />}
              disabled={
                selection?.kind !== "asset" || !selection?.id
              }
              onClick={() => {
                if (selection?.kind !== "asset" || !selection.id) return
                dispatch(setPlacingAssetIdAct(String(selection.id)))
                dispatch(setActiveToolAct("placeAsset"))
              }}
              sx={{ color: "#e2e8f0", borderColor: "#334155" }}
            >
              {s.assetsPlaceHint}
            </Button>
          </Stack>
          {assets.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography sx={{ color: "#f8fafc", mb: 1 }}>
                {s.assetsEmptyTitle}
              </Typography>
              <Button
                variant="contained"
                disabled={resources.length === 0}
                onClick={() => openPlace()}
              >
                {s.assetsEmptyAction}
              </Button>
            </Box>
          ) : (
            <List dense sx={{ overflow: "auto", flex: 1, px: 1 }}>
              {assets.map((asset) => (
                <ListItemButton
                  key={String(asset._id)}
                  selected={
                    selection?.kind === "asset" &&
                    String(selection.id) === String(asset._id)
                  }
                  onClick={() =>
                    dispatch(
                      setSelectionAct({
                        kind: "asset",
                        id: String(asset._id)
                      })
                    )
                  }
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    color: "#e2e8f0",
                    "&.Mui-selected": { bgcolor: "rgba(56,189,248,0.16)" }
                  }}
                >
                  <ListItemText
                    primary={asset.name}
                    secondary={`${asset.type} · ${Number(
                      asset.position?.latitude
                    ).toFixed(5)}, ${Number(
                      asset.position?.longitude
                    ).toFixed(5)}${
                      asset.visible ? "" : ` · ${s.hidden}`
                    }`}
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </>
      )}
      <ResourceUploadDialogCP
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        projectId={projectId}
      />
      <PlaceAssetDialogCP
        open={placeOpen}
        onClose={() => {
          setPlaceOpen(false)
          setPlaceResourceId(null)
        }}
        projectId={projectId}
        initialResourceId={placeResourceId}
      />
      <AssetEditorDrawerCP
        projectId={projectId}
        asset={selectedAsset}
        onClose={() => dispatch(setSelectionAct(null))}
      />
    </Box>
  )
}
