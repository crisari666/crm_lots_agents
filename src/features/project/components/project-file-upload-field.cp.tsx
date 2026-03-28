import React, { useEffect, useRef, useState } from "react"
import {
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
import PictureAsPdf from "@mui/icons-material/PictureAsPdf"
import VideoFile from "@mui/icons-material/VideoFile"
import Image from "@mui/icons-material/Image"
import Visibility from "@mui/icons-material/Visibility"
import Delete from "@mui/icons-material/Delete"
import { ProjectPreviewItem, ProjectPreviewMediaKind } from "../types/project.types"
import { buildProjectAssetUrl } from "../utils/project-uploads.util"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

function previewKindFromName(name: string, variant: "reel" | "plane" | "brochure"): ProjectPreviewMediaKind {
  const lower = name.toLowerCase()
  if (variant === "reel") return "video"
  if (variant === "brochure") return "pdf"
  if (lower.endsWith(".pdf")) return "pdf"
  return "image"
}

function previewKindFromFile(file: File, variant: "reel" | "plane" | "brochure"): ProjectPreviewMediaKind {
  if (variant === "reel") return "video"
  if (variant === "brochure") return "pdf"
  if (file.type === "application/pdf") return "pdf"
  return "image"
}

function removeConfirmStrings(variant: "reel" | "plane" | "brochure") {
  if (variant === "reel") {
    return { label: s.removeReelVideo, title: s.removeReelVideoConfirmTitle, body: s.removeReelVideoConfirmBody }
  }
  if (variant === "plane") {
    return { label: s.removePlane, title: s.removePlaneConfirmTitle, body: s.removePlaneConfirmBody }
  }
  return { label: s.removeBrochure, title: s.removeBrochureConfirmTitle, body: s.removeBrochureConfirmBody }
}

type ProjectFileUploadFieldCPProps = {
  label: string
  helperText: string
  accept: string
  disabled?: boolean
  uploadsBaseUrl: string
  variant: "reel" | "plane" | "brochure"
  /** Create flow: controlled pending file */
  pendingFile?: File | null
  onPendingChange?: (file: File | null) => void
  /** Edit flow: upload immediately */
  onUpload?: (file: File) => Promise<void>
  /** Edit flow: remove server file (DELETE endpoint) */
  onRemove?: () => Promise<void>
  existingFileName?: string | null
  onOpenPreview: (item: ProjectPreviewItem) => void
}

export default function ProjectFileUploadFieldCP({
  label,
  helperText,
  accept,
  disabled = false,
  uploadsBaseUrl,
  variant,
  pendingFile = null,
  onPendingChange,
  onUpload,
  onRemove,
  existingFileName = null,
  onOpenPreview,
}: ProjectFileUploadFieldCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const removeUi = removeConfirmStrings(variant)
  const canRemoveServer =
    Boolean(onRemove && existingFileName?.trim() && !pendingFile && !disabled)

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
  const kind: ProjectPreviewMediaKind = pendingFile
    ? previewKindFromFile(pendingFile, variant)
    : existingFileName
      ? previewKindFromName(existingFileName, variant)
      : variant === "reel"
        ? "video"
        : variant === "brochure"
          ? "pdf"
          : "pdf"

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    e.target.value = ""
    if (!f) return
    if (onUpload) {
      setUploading(true)
      try {
        await onUpload(f)
      } finally {
        setUploading(false)
      }
    } else if (onPendingChange) {
      onPendingChange(f)
    }
  }

  const handlePreview = () => {
    if (!previewSrc) return
    onOpenPreview({
      kind,
      src: previewSrc,
      title: label,
    })
  }

  const handleConfirmRemove = () => {
    if (!onRemove) return
    setConfirmRemove(false)
    setRemoving(true)
    onRemove().finally(() => setRemoving(false))
  }

  const Icon =
    variant === "reel" ? VideoFile : variant === "brochure" ? PictureAsPdf : PictureAsPdf

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
        <Box
          sx={{
            width: { xs: "100%", sm: 120 },
            height: 100,
            borderRadius: 1,
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {kind === "image" && hasPreview && (
            <Box
              component="img"
              src={previewSrc}
              alt=""
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {kind === "video" && hasPreview && (
            <Box
              component="video"
              src={previewSrc}
              muted
              playsInline
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
          {kind === "pdf" && (
            <PictureAsPdf sx={{ fontSize: 48, color: "text.secondary" }} />
          )}
          {!hasPreview && variant === "reel" && (
            <Icon sx={{ fontSize: 48, color: "text.secondary" }} />
          )}
          {!hasPreview && variant === "brochure" && (
            <PictureAsPdf sx={{ fontSize: 48, color: "text.secondary" }} />
          )}
          {!hasPreview && variant === "plane" && (
            <Image sx={{ fontSize: 48, color: "text.secondary" }} />
          )}
        </Box>
        <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
          <Typography variant="caption" color="text.secondary">
            {helperText}
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
            <Button
              variant="outlined"
              component="label"
              size="small"
              disabled={disabled || uploading}
              startIcon={uploading ? <CircularProgress size={16} /> : undefined}
            >
              {existingFileName || pendingFile ? s.replaceFile : s.chooseFile}
              <input
                ref={inputRef}
                type="file"
                hidden
                accept={accept}
                onChange={handleChange}
              />
            </Button>
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
            {canRemoveServer && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                disabled={removing}
                startIcon={<Delete />}
                onClick={() => setConfirmRemove(true)}
              >
                {removeUi.label}
              </Button>
            )}
            {!onUpload && pendingFile && onPendingChange && (
              <Button variant="text" size="small" color="inherit" onClick={() => onPendingChange(null)}>
                {s.cancel}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Dialog open={confirmRemove} onClose={() => setConfirmRemove(false)}>
        <DialogTitle>{removeUi.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{removeUi.body}</DialogContentText>
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
