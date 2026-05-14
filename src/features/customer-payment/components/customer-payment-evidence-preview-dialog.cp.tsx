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
import { fetchCustomerPaymentEvidenceBlob } from "../../customer-v2/services/customer-payments-ms.http"
import { customerPaymentStrings as s } from "../../../i18n/locales/customer-payment.strings"

export default function CustomerPaymentEvidencePreviewDialogCP({
  open,
  paymentId,
  onClose,
}: {
  open: boolean
  paymentId: string | null
  onClose: () => void
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  useEffect(() => {
    if (!open || !paymentId) {
      setPreviewUrl(null)
      setLoadError(null)
      setIsLoading(false)
      return undefined
    }
    let objectUrl: string | null = null
    let cancelled = false
    setIsLoading(true)
    setLoadError(null)
    setPreviewUrl(null)
    void fetchCustomerPaymentEvidenceBlob(paymentId)
      .then((blob) => {
        if (cancelled) {
          return
        }
        objectUrl = URL.createObjectURL(blob)
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
  }, [open, paymentId])
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pr: 6 }}>
        {s.previewDialogTitle}
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
        {previewUrl && !isLoading && !loadError && (
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
