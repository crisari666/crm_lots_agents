import React, { useRef, useState } from "react"
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material"
import { CloudUpload, Delete, AddPhotoAlternate } from "@mui/icons-material"

export type ExistingProjectImage = { name: string; url: string }

type ProjectImagePickerCPProps = {
  files: File[]
  existingImages?: ExistingProjectImage[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  projectId?: string
  onUploadImage?: (file: File) => Promise<void>
  onRemoveImage?: (imageName: string) => Promise<void>
}

export default function ProjectImagePickerCP({
  files,
  existingImages = [],
  onFilesChange,
  disabled = false,
  projectId,
  onUploadImage,
  onRemoveImage
}: ProjectImagePickerCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState<ExistingProjectImage | null>(null)

  const handleSelectForSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    const newFiles = Array.from(selected)
    onFilesChange([...files, ...newFiles])
    e.target.value = ""
  }

  const handleSelectForUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length || !onUploadImage) return
    setUploading(true)
    try {
      for (let i = 0; i < selected.length; i++) {
        await onUploadImage(selected[i])
      }
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removePendingFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  const handleConfirmRemove = () => {
    if (!removeConfirm || !onRemoveImage) return
    const { name } = removeConfirm
    setRemoveConfirm(null)
    setRemoving(true)
    onRemoveImage(name)
      .finally(() => setRemoving(false))
  }

  const canUploadImmediate = Boolean(projectId && onUploadImage)
  const canRemove = Boolean(projectId && onRemoveImage && !disabled)

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
        Project images
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {existingImages.map((img, i) => (
          <Card key={img.name} sx={{ width: 120, overflow: "hidden", position: "relative" }}>
            <CardMedia
              component="img"
              height="120"
              image={img.url}
              alt=""
              sx={{ objectFit: "cover" }}
            />
            {canRemove && (
              <IconButton
                size="small"
                color="error"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": { bgcolor: "action.hover" }
                }}
                disabled={removing}
                onClick={(e) => {
                  e.stopPropagation()
                  setRemoveConfirm(img)
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Card>
        ))}
        {files.map((file, i) => (
          <Card key={`file-${i}`} sx={{ width: 120, overflow: "hidden", position: "relative" }}>
            <CardMedia
              component="img"
              height="120"
              image={URL.createObjectURL(file)}
              alt=""
              sx={{ objectFit: "cover" }}
            />
            {!disabled && !canUploadImmediate && (
              <CardActions sx={{ justifyContent: "center", p: 0.5 }}>
                <IconButton size="small" color="error" onClick={() => removePendingFile(i)}>
                  <Delete fontSize="small" />
                </IconButton>
              </CardActions>
            )}
          </Card>
        ))}

        {!disabled && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
            {canUploadImmediate ? (
              <>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  size="medium"
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload image"}
                  <input
                    ref={uploadInputRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleSelectForUpload}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", maxWidth: 140 }}>
                  Image is saved immediately
                </Typography>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AddPhotoAlternate />}
                  size="medium"
                >
                  Pick images
                  <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleSelectForSubmit}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center", maxWidth: 140 }}>
                  Added on save
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={!!removeConfirm} onClose={() => setRemoveConfirm(null)}>
        <DialogTitle>Eliminar imagen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Quiere eliminar esta imagen del proyecto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveConfirm(null)}>Cancelar</Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained" disabled={removing}>
            {removing ? "Eliminando…" : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
