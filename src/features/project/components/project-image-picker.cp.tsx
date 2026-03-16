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
  Paper
} from "@mui/material"
import { CloudUpload, Delete, AddPhotoAlternate } from "@mui/icons-material"

type ProjectImagePickerCPProps = {
  files: File[]
  existingUrls?: string[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  projectId?: string
  onUploadImage?: (file: File) => Promise<void>
}

export default function ProjectImagePickerCP({
  files,
  existingUrls = [],
  onFilesChange,
  disabled = false,
  projectId,
  onUploadImage
}: ProjectImagePickerCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

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

  const canUploadImmediate = Boolean(projectId && onUploadImage)

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
        Project images
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {existingUrls.map((url, i) => (
          <Card key={`existing-${i}`} sx={{ width: 120, overflow: "hidden" }}>
            <CardMedia
              component="img"
              height="120"
              image={url}
              alt=""
              sx={{ objectFit: "cover" }}
            />
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
    </Paper>
  )
}
