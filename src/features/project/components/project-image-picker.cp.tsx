import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Chip,
} from "@mui/material"
import CloudUpload from "@mui/icons-material/CloudUpload"
import Delete from "@mui/icons-material/Delete"
import AddPhotoAlternate from "@mui/icons-material/AddPhotoAlternate"
import ChevronLeft from "@mui/icons-material/ChevronLeft"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Visibility from "@mui/icons-material/Visibility"
import { ProjectPreviewItem } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"

export type ExistingProjectImage = { name: string; url: string }

type ImageSlide = {
  key: string
  url: string
  displayName: string
  existingName?: string
  pendingIndex?: number
}

type ProjectImagePickerCPProps = {
  files: File[]
  existingImages?: ExistingProjectImage[]
  onFilesChange: (files: File[]) => void
  disabled?: boolean
  projectId?: string
  onUploadImages?: (files: File[]) => Promise<void>
  onRemoveImage?: (imageName: string) => Promise<void>
  onOpenImagesPreview: (items: ProjectPreviewItem[], startIndex: number) => void
  /** Overrides the panel heading (default: project images title) */
  sectionTitle?: string
  maxFileBytes?: number
}

export default function ProjectImagePickerCP({
  files,
  existingImages = [],
  onFilesChange,
  disabled = false,
  projectId,
  onUploadImages,
  onRemoveImage,
  onOpenImagesPreview,
  sectionTitle = s.projectImagesTitle,
  maxFileBytes,
}: ProjectImagePickerCPProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [fileSizeError, setFileSizeError] = useState<string | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removeConfirm, setRemoveConfirm] = useState<ExistingProjectImage | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [blobUrls, setBlobUrls] = useState<string[]>([])

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f))
    setBlobUrls(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [files])

  const slides: ImageSlide[] = useMemo(() => {
    const existing: ImageSlide[] = existingImages.map((img) => ({
      key: `ex-${img.name}`,
      url: img.url,
      displayName: img.name,
      existingName: img.name,
    }))
    const pending: ImageSlide[] = files.map((file, i) => ({
      key: `pen-${i}-${file.name}-${file.size}`,
      url: blobUrls[i] ?? "",
      displayName: file.name,
      pendingIndex: i,
    }))
    return [...existing, ...pending]
  }, [existingImages, files, blobUrls])

  useEffect(() => {
    if (activeIndex >= slides.length && slides.length > 0) {
      setActiveIndex(slides.length - 1)
    }
    if (slides.length === 0) setActiveIndex(0)
  }, [slides.length, activeIndex])

  const current = slides[activeIndex]
  const total = slides.length

  const handleSelectForSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length) return
    let newFiles = Array.from(selected)
    e.target.value = ""
    if (maxFileBytes !== undefined) {
      const valid = newFiles.filter((f) => f.size <= maxFileBytes)
      const invalid = newFiles.filter((f) => f.size > maxFileBytes)
      if (invalid.length) setFileSizeError(s.imageFileTooLarge)
      else setFileSizeError(null)
      newFiles = valid
    } else {
      setFileSizeError(null)
    }
    if (!newFiles.length) return
    onFilesChange([...files, ...newFiles])
  }

  const handleSelectForUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files
    if (!selected?.length || !onUploadImages) return
    let list = Array.from(selected)
    e.target.value = ""
    if (maxFileBytes !== undefined) {
      const valid = list.filter((f) => f.size <= maxFileBytes)
      const invalid = list.filter((f) => f.size > maxFileBytes)
      if (invalid.length) setFileSizeError(s.imageFileTooLarge)
      else setFileSizeError(null)
      list = valid
    } else {
      setFileSizeError(null)
    }
    if (!list.length) return
    setUploading(true)
    try {
      await onUploadImages(list)
    } finally {
      setUploading(false)
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
    onRemoveImage(name).finally(() => setRemoving(false))
  }

  const canUploadImmediate = Boolean(projectId && onUploadImages)
  const canRemove = Boolean(projectId && onRemoveImage && !disabled)

  const openCarouselPreview = () => {
    if (!total) return
    const items: ProjectPreviewItem[] = slides.map((sl) => ({
      kind: "image" as const,
      src: sl.url,
      title: sl.displayName,
    }))
    onOpenImagesPreview(items, activeIndex)
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          {sectionTitle}
        </Typography>
        {total > 0 && (
          <Chip size="small" label={`${activeIndex + 1} / ${total}`} variant="outlined" />
        )}
      </Stack>

      <Box
        sx={{
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "action.hover",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {current && (
          <Card elevation={0} sx={{ width: "100%", bgcolor: "transparent" }}>
            <CardMedia
              component="img"
              image={current.url}
              alt=""
              sx={{
                maxHeight: 280,
                width: "100%",
                objectFit: "contain",
                bgcolor: "grey.100",
              }}
            />
          </Card>
        )}
        {!current && (
          <Typography color="text.secondary" sx={{ py: 6 }}>
            {s.noImagesYet}
          </Typography>
        )}
        {total > 1 && (
          <>
            <IconButton
              aria-label={s.carouselPrev}
              onClick={() => setActiveIndex((i) => (i <= 0 ? total - 1 : i - 1))}
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              aria-label={s.carouselNext}
              onClick={() => setActiveIndex((i) => (i >= total - 1 ? 0 : i + 1))}
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "background.paper",
                boxShadow: 2,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
        {current && (
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {slides.map((_, i) => (
              <Box
                key={slides[i].key}
                onClick={() => setActiveIndex(i)}
                sx={{
                  width: i === activeIndex ? 14 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: i === activeIndex ? "primary.main" : "action.disabled",
                  cursor: "pointer",
                  transition: "width 0.2s",
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ mt: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        {current && (
          <>
            <Button size="small" variant="outlined" startIcon={<Visibility />} onClick={openCarouselPreview}>
              {s.previewImage}
            </Button>
            {current.existingName && canRemove && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                disabled={removing}
                startIcon={<Delete />}
                onClick={() =>
                  setRemoveConfirm({
                    name: current.existingName!,
                    url: current.url,
                  })
                }
              >
                {s.removeImage}
              </Button>
            )}
            {current.pendingIndex !== undefined && !disabled && !canUploadImmediate && (
              <Button
                size="small"
                color="error"
                variant="outlined"
                startIcon={<Delete />}
                onClick={() => removePendingFile(current.pendingIndex!)}
              >
                {s.removePendingMedia}
              </Button>
            )}
          </>
        )}
      </Stack>

      {!disabled && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1, alignItems: "center" }}>
          {fileSizeError && (
            <Alert
              severity="error"
              onClose={() => setFileSizeError(null)}
              sx={{ alignSelf: "stretch", maxWidth: 480 }}
            >
              {fileSizeError}
            </Alert>
          )}
          {canUploadImmediate ? (
            <>
              <Button
                variant="contained"
                component="label"
                startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                size="medium"
                disabled={uploading}
              >
                {uploading ? s.uploading : s.uploadImages}
                <input
                  ref={uploadInputRef}
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleSelectForUpload}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                {s.imageSavedImmediate}
              </Typography>
            </>
          ) : (
            <>
              <Button variant="outlined" component="label" startIcon={<AddPhotoAlternate />} size="medium">
                {s.pickImages}
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  onChange={handleSelectForSubmit}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                {s.imageAddedOnSave}
              </Typography>
            </>
          )}
        </Box>
      )}

      <Dialog open={!!removeConfirm} onClose={() => setRemoveConfirm(null)}>
        <DialogTitle>{s.removeImageConfirmTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{s.removeImageConfirmBody}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveConfirm(null)}>{s.cancel}</Button>
          <Button onClick={handleConfirmRemove} color="error" variant="contained" disabled={removing}>
            {removing ? s.deleting : s.delete}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}
