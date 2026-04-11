import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import Image from "@mui/icons-material/Image"
import Visibility from "@mui/icons-material/Visibility"
import Delete from "@mui/icons-material/Delete"
import { ProjectPreviewItem } from "../types/project.types"
import { buildProjectAssetUrl } from "../utils/project-uploads.util"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

type ProjectCardImageCPProps = {
  pendingFile: File | null
  onPendingChange: (file: File | null) => void
  uploadsBaseUrl: string
  existingFileName?: string | null
  disabled?: boolean
  projectId?: string
  onUploadCard?: (file: File) => Promise<void>
  onRemoveCard?: () => Promise<void>
  onOpenPreview: (item: ProjectPreviewItem) => void
  maxFileBytes?: number
}

export default function ProjectCardImageCP({
  pendingFile,
  onPendingChange,
  uploadsBaseUrl,
  existingFileName = null,
  disabled = false,
  projectId,
  onUploadCard,
  onRemoveCard,
  onOpenPreview,
  maxFileBytes,
}: ProjectCardImageCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)

  useEffect(() => {
    if (!pendingFile) {
      setBlobUrl(null)
      return
    }
    const url = URL.createObjectURL(pendingFile)
    setBlobUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [pendingFile])

  const serverUrl =
    existingFileName && uploadsBaseUrl
      ? buildProjectAssetUrl(uploadsBaseUrl, existingFileName)
      : ""

  const previewSrc = blobUrl || serverUrl
  const hasPreview = Boolean(previewSrc)
  const canUploadImmediate = Boolean(projectId && onUploadCard)
  const canRemoveServerCard = Boolean(
    projectId &&
      onRemoveCard &&
      existingFileName?.trim() &&
      !pendingFile &&
      !disabled
  )

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ""
    if (!f) return
    if (maxFileBytes !== undefined && f.size > maxFileBytes) {
      setFileSizeError(s.imageFileTooLarge)
      return
    }
    setFileSizeError(null)
    if (canUploadImmediate) {
      setUploading(true)
      try {
        await onUploadCard!(f)
      } finally {
        setUploading(false)
      }
    } else {
      onPendingChange(f)
    }
  }

  const handlePreview = () => {
    if (!previewSrc) return
    onOpenPreview({
      kind: "image",
      src: previewSrc,
      title: s.projectCardImageTitle,
    })
  }

  const handleConfirmRemove = () => {
    if (!onRemoveCard) return
    setConfirmRemove(false)
    setRemoving(true)
    onRemoveCard().finally(() => setRemoving(false))
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {s.projectCardImageTitle}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Box
          sx={{
            width: { xs: "100%", sm: 160 },
            height: 120,
            borderRadius: 1,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {hasPreview && (
            <Box
              component="img"
              src={previewSrc}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {!hasPreview && <Image sx={{ fontSize: 48, color: "text.secondary" }} />}
        </Box>
        <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
          {fileSizeError && (
            <Alert severity="error" onClose={() => setFileSizeError(null)} sx={{ py: 0 }}>
              {fileSizeError}
            </Alert>
          )}
          <Typography variant="caption" color="text.secondary">
            {s.projectCardImageHelper}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
            {!disabled && (
              <Button
                variant="outlined"
                component="label"
                size="small"
                disabled={uploading}
                startIcon={uploading ? <CircularProgress size={16} /> : undefined}
              >
                {existingFileName || pendingFile ? s.replaceFile : s.chooseFile}
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleChange}
                />
              </Button>
            )}
            {hasPreview && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={handlePreview}
              >
                {s.openPreview}
              </Button>
            )}
            {canRemoveServerCard && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                disabled={removing}
                startIcon={<Delete />}
                onClick={() => setConfirmRemove(true)}
              >
                {s.removeCardImage}
              </Button>
            )}
            {!canUploadImmediate && pendingFile && onPendingChange && !disabled && (
              <Button variant="text" size="small" color="inherit" onClick={() => onPendingChange(null)}>
                {s.cancel}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}>
        <DialogTitle>{s.removeCardImageConfirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{s.removeCardImageConfirmBody}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRemove(false)}>{s.cancel}</Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained" disabled={removing}>
            {removing ? s.deleting : s.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
