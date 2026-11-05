import React, { useEffect, useMemo, useState } from "react"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"
import { RootState } from "../../../../../app/store"
import {
  setActiveToolAct,
  setPendingAssetPositionAct,
  uploadAssetThunk
} from "../../slice/project-3d-studio.slice"
import type { ProjectExperienceAssetType } from "../../types/project-experience.types"
import { compressPanoramaFile } from "../../utils/compress-panorama-file.util"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
}

function parseCoord(value: string): number | null {
  const numeric = Number(value.trim())
  return Number.isFinite(numeric) ? numeric : null
}

export default function AssetUploadDialogCP({
  open,
  onClose,
  projectId
}: Props) {
  const dispatch = useAppDispatch()
  const { mapCamera, pendingAssetPosition, activeTool, projectLatLng } =
    useAppSelector((state: RootState) => state.project3dStudio)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [type, setType] = useState<ProjectExperienceAssetType>("model_3d")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [loading, setLoading] = useState(false)
  const [minimizedForPick, setMinimizedForPick] = useState(false)

  useEffect(() => {
    if (!open) {
      setMinimizedForPick(false)
      return
    }
    if (pendingAssetPosition) {
      setLat(String(pendingAssetPosition.lat))
      setLng(String(pendingAssetPosition.lng))
      setMinimizedForPick(false)
    }
  }, [open, pendingAssetPosition])

  useEffect(() => {
    if (!open) return
    if (lat || lng) return
    if (projectLatLng) {
      setLat(String(projectLatLng.lat))
      setLng(String(projectLatLng.lng))
    }
  }, [open, projectLatLng, lat, lng])

  const parsedLat = useMemo(() => parseCoord(lat), [lat])
  const parsedLng = useMemo(() => parseCoord(lng), [lng])
  const hasValidPosition =
    parsedLat !== null &&
    parsedLng !== null &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180
  const isPicking = activeTool === "pickAssetPosition"

  const useCamera = () => {
    if (!mapCamera) return
    setLat(String(mapCamera.latitude))
    setLng(String(mapCamera.longitude))
    dispatch(
      setPendingAssetPositionAct({
        lat: mapCamera.latitude,
        lng: mapCamera.longitude
      })
    )
  }

  const pickOnMap = () => {
    setMinimizedForPick(true)
    dispatch(setActiveToolAct("pickAssetPosition"))
  }

  const resetForm = () => {
    setFile(null)
    setName("")
    setType("model_3d")
    setLat("")
    setLng("")
    setMinimizedForPick(false)
    dispatch(setPendingAssetPositionAct(null))
    if (activeTool === "pickAssetPosition") {
      dispatch(setActiveToolAct("select"))
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const onUpload = async () => {
    if (!file || !hasValidPosition || parsedLat === null || parsedLng === null) {
      return
    }
    setLoading(true)
    try {
      const uploadFile =
        type === "panorama" ? await compressPanoramaFile(file) : file
      await dispatch(
        uploadAssetThunk({
          projectId,
          file: uploadFile,
          type,
          name: name || undefined,
          longitude: parsedLng,
          latitude: parsedLat
        })
      ).unwrap()
      resetForm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {minimizedForPick && open && (
      <Alert
        severity="info"
        sx={{
          position: "fixed",
          top: 88,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1500,
          maxWidth: 420
        }}
      >
        {s.assetsPickingOnMap}
      </Alert>
    )}
    <Dialog
      open={open && !minimizedForPick}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{s.assetsUpload}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth size="small" sx={{ mt: 1, mb: 2 }}>
          <InputLabel>{s.assetsType}</InputLabel>
          <Select
            label={s.assetsType}
            value={type}
            onChange={(e) =>
              setType(e.target.value as ProjectExperienceAssetType)
            }
          >
            <MenuItem value="image">image</MenuItem>
            <MenuItem value="video">video</MenuItem>
            <MenuItem value="panorama">panorama</MenuItem>
            <MenuItem value="model_3d">model_3d (GLB)</MenuItem>
            <MenuItem value="geojson">geojson</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          size="small"
          label={s.name}
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept={type === "panorama" ? "image/jpeg,image/png,image/webp" : undefined}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {type === "panorama" && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {s.assetsPanoramaCompress}
          </Typography>
        )}
        <Typography variant="subtitle2" sx={{ mt: 2.5, mb: 1 }}>
          {s.assetsPositionRequired}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
          {s.assetsPositionHint}
        </Typography>
        {isPicking && (
          <Alert severity="info" sx={{ mb: 1.5 }}>
            {s.assetsPickingOnMap}
          </Alert>
        )}
        {!isPicking && hasValidPosition && (
          <Alert severity="success" sx={{ mb: 1.5 }}>
            {s.assetsPositionSet}: {parsedLat?.toFixed(6)}, {parsedLng?.toFixed(6)}
          </Alert>
        )}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <TextField
            size="small"
            label={s.assetsLat}
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            fullWidth
            required
            error={lat !== "" && parsedLat === null}
          />
          <TextField
            size="small"
            label={s.assetsLng}
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            fullWidth
            required
            error={lng !== "" && parsedLng === null}
          />
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            onClick={useCamera}
            disabled={!mapCamera}
          >
            {s.assetsUseCamera}
          </Button>
          <Button
            size="small"
            variant={isPicking ? "contained" : "outlined"}
            onClick={pickOnMap}
          >
            {s.assetsPickOnMap}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          disabled={!file || !hasValidPosition || loading}
          onClick={() => void onUpload()}
        >
          {s.assetsUpload}
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}
