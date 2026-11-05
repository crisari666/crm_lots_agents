import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material"
import { useAppDispatch } from "../../../../../app/hooks"
import { uploadResourceThunk } from "../../slice/project-3d-studio.slice"
import type { ProjectExperienceAssetType } from "../../types/project-experience.types"
import { compressPanoramaFile } from "../../utils/compress-panorama-file.util"
import { project3dStudioStrings as s } from "../../../../../i18n/locales/project-3d-studio.strings"

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
}

export default function ResourceUploadDialogCP({
  open,
  onClose,
  projectId
}: Props) {
  const dispatch = useAppDispatch()
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [type, setType] = useState<ProjectExperienceAssetType>("model_3d")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setFile(null)
    setName("")
    setType("model_3d")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const onUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const uploadFile =
        type === "panorama" ? await compressPanoramaFile(file) : file
      await dispatch(
        uploadResourceThunk({
          projectId,
          file: uploadFile,
          type,
          name: name || undefined
        })
      ).unwrap()
      resetForm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
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
            <MenuItem value="model_3d">model_3d (GLB)</MenuItem>
            <MenuItem value="image">image</MenuItem>
            <MenuItem value="video">video</MenuItem>
            <MenuItem value="panorama">panorama</MenuItem>
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
          accept={
            type === "model_3d"
              ? ".glb,.gltf"
              : type === "panorama"
                ? "image/jpeg,image/png,image/webp"
                : undefined
          }
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {type === "panorama" && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {s.assetsPanoramaCompress}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{s.cancel}</Button>
        <Button
          variant="contained"
          disabled={!file || loading}
          onClick={() => void onUpload()}
        >
          {s.assetsUpload}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
