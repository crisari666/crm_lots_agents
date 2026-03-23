import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material"
import PictureAsPdf from "@mui/icons-material/PictureAsPdf"
import VideoFile from "@mui/icons-material/VideoFile"
import Image from "@mui/icons-material/Image"
import Visibility from "@mui/icons-material/Visibility"
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
  existingFileName = null,
  onOpenPreview,
}: ProjectFileUploadFieldCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

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
          <Stack direction="row" flexWrap="wrap" gap={1}>
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
                variant="text"
                size="small"
                startIcon={<Visibility />}
                onClick={handlePreview}
              >
                {s.openPreview}
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
    </Paper>
  )
}
