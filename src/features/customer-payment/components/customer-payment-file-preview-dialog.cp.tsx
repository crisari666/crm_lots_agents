import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { customerPaymentStrings as s } from "../../../i18n/locales/customer-payment.strings"

type FetchBlob = () => Promise<Blob>

export default function CustomerPaymentFilePreviewDialogCP({
  open,
  title,
  onClose,
  fetchBlob,
}: {
  open: boolean
  title?: string
  onClose: () => void
  fetchBlob: FetchBlob | null
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  useEffect(() => {
    if (!open || !fetchBlob) {
      setPreviewUrl(null)
      setMimeType(null)
      setLoadError(null)
      setIsLoading(false)
      return undefined
    }
    let objectUrl: string | null = null
    let cancelled = false
    setIsLoading(true)
    setLoadError(null)
    setPreviewUrl(null)
    setMimeType(null)
    void fetchBlob()
      .then((blob) => {
        if (cancelled) {
          return
        }
        objectUrl = URL.createObjectURL(blob)
        setMimeType(blob.type || null)
        setPreviewUrl(objectUrl)
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(s.evidenceLoadError)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [open, fetchBlob])
  const isPdf = mimeType === "application/pdf" || previewUrl?.includes("pdf")
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {title ?? s.previewDialogTitle}
        <IconButton
          aria-label={s.closePreviewDialog}
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, cursor: "pointer" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {loadError && !isLoading && <Alert severity="error">{loadError}</Alert>}
        {previewUrl && !isLoading && !loadError && isPdf && (
          <Box
            component="iframe"
            src={previewUrl}
            title={title ?? s.previewDialogTitle}
            sx={{ width: "100%", height: "70vh", border: 0 }}
          />
        )}
        {previewUrl && !isLoading && !loadError && !isPdf && (
          <Box
            component="img"
            src={previewUrl}
            alt=""
            sx={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              display: "block",
              mx: "auto",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
