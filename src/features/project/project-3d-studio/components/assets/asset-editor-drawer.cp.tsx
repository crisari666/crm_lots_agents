import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography
} from "@mui/material"
import { useAppDispatch } from "../../../../../app/hooks"
import {
  deleteAssetThunk,
  setActiveToolAct,
  setPlacingAssetIdAct,
  updateAssetThunk
} from "../../slice/project-3d-studio.slice"
import type { ExperienceAssetType } from "../../types/project-experience.types"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  projectId: string
  asset: ExperienceAssetType | null
  onClose: () => void
}

function normalizeDegrees(value: number): number {
  if (!Number.isFinite(value)) return 0
  const wrapped = ((value % 360) + 360) % 360
  return wrapped > 180 ? wrapped - 360 : wrapped
}

export default function AssetEditorDrawerCP({
  projectId,
  asset,
  onClose
}: Props) {
  const dispatch = useAppDispatch()
  const editingAssetIdRef = useRef<string | null>(null)
  const [name, setName] = useState("")
  const [scale, setScale] = useState("1")
  const [altitude, setAltitude] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [rotPitch, setRotPitch] = useState(0)
  const [rotHeading, setRotHeading] = useState(0)
  const [rotRoll, setRotRoll] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!asset) {
      editingAssetIdRef.current = null
      return
    }
    editingAssetIdRef.current = String(asset._id)
    setName(asset.name)
    setScale(String(asset.transform.scale))
    setAltitude(
      asset.position.altitude != null ? String(asset.position.altitude) : ""
    )
    setLatitude(String(asset.position.latitude))
    setLongitude(String(asset.position.longitude))
    const rotation = asset.transform.rotation ?? [0, 0, 0]
    setRotPitch(Number(rotation[0]) || 0)
    setRotHeading(Number(rotation[1]) || 0)
    setRotRoll(Number(rotation[2]) || 0)
    setVisible(asset.visible)
  }, [asset?._id])

  if (!asset) return null

  const assetId = String(asset._id)
  const isModel3d = asset.type === "model_3d"
  const isPanorama = asset.type === "panorama"

  const save = async () => {
    const targetId = editingAssetIdRef.current ?? assetId
    const lat = Number(latitude)
    const lng = Number(longitude)
    await dispatch(
      updateAssetThunk({
        projectId,
        assetId: targetId,
        data: {
          name,
          visible,
          transform: {
            scale: Number(scale) || 1,
            rotation: [
              normalizeDegrees(rotPitch),
              normalizeDegrees(rotHeading),
              normalizeDegrees(rotRoll)
            ]
          },
          position: {
            latitude: Number.isFinite(lat) ? lat : asset.position.latitude,
            longitude: Number.isFinite(lng) ? lng : asset.position.longitude,
            altitude: altitude.trim() === "" ? null : Number(altitude)
          }
        }
      })
    )
    onClose()
  }

  const placeOnMap = () => {
    const targetId = editingAssetIdRef.current ?? assetId
    // Lock target id, then close drawer so the map is clickable.
    dispatch(setPlacingAssetIdAct(targetId))
    dispatch(setActiveToolAct("placeAsset"))
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={Boolean(asset)}
      onClose={onClose}
      PaperProps={{ sx: { width: 360, bgcolor: "#0f172a", color: "#e2e8f0" } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {asset.type}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label={s.name}
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.assetsScale}
            size="small"
            type="number"
            value={scale}
            onChange={(e) => setScale(e.target.value)}
            fullWidth
            inputProps={{ step: 0.1, min: 0.01 }}
          />
          {(isModel3d || isPanorama) && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, color: "#f8fafc" }}>
                {isPanorama ? s.assetsPanoramaHeading : s.assetsRotation}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                {s.assetsRotationHeading}: {Math.round(rotHeading)}°
              </Typography>
              <Slider
                value={rotHeading}
                min={-180}
                max={180}
                step={1}
                onChange={(_e, value) =>
                  setRotHeading(typeof value === "number" ? value : value[0])
                }
                sx={{ color: "#38bdf8", mb: 1 }}
              />
              {isModel3d && (
              <Stack direction="row" spacing={1}>
                <TextField
                  label={s.assetsRotationPitch}
                  size="small"
                  type="number"
                  value={rotPitch}
                  onChange={(e) => setRotPitch(Number(e.target.value) || 0)}
                  fullWidth
                  inputProps={{ step: 1 }}
                />
                <TextField
                  label={s.assetsRotationRoll}
                  size="small"
                  type="number"
                  value={rotRoll}
                  onChange={(e) => setRotRoll(Number(e.target.value) || 0)}
                  fullWidth
                  inputProps={{ step: 1 }}
                />
              </Stack>
              )}
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setRotHeading((prev) => normalizeDegrees(prev - 15))
                  }
                  sx={{ color: "#e2e8f0", borderColor: "#334155" }}
                >
                  −15°
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() =>
                    setRotHeading((prev) => normalizeDegrees(prev + 15))
                  }
                  sx={{ color: "#e2e8f0", borderColor: "#334155" }}
                >
                  +15°
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setRotPitch(0)
                    setRotHeading(0)
                    setRotRoll(0)
                  }}
                  sx={{ color: "#e2e8f0", borderColor: "#334155" }}
                >
                  0°
                </Button>
              </Stack>
            </Box>
          )}
          <TextField
            label={s.assetsLat}
            size="small"
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.assetsLng}
            size="small"
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            fullWidth
          />
          <TextField
            label={s.assetsAltitude}
            size="small"
            type="number"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
            helperText={isPanorama ? s.assetsPanoramaAltitude : undefined}
            fullWidth
          />
          <Button
            size="small"
            variant="outlined"
            onClick={placeOnMap}
            sx={{ color: "#e2e8f0", borderColor: "#334155" }}
          >
            {s.assetsPickOnMap}
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
              />
            }
            label={visible ? s.visible : s.hidden}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={() => void save()}>
              {s.save}
            </Button>
            <Button
              color="error"
              onClick={() => {
                const targetId = editingAssetIdRef.current ?? assetId
                void dispatch(
                  deleteAssetThunk({ projectId, assetId: targetId })
                ).then(onClose)
              }}
            >
              {s.delete}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}
