import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { fetchCallLogRecordingWithRetry } from "../../services/call-recording-fetch.util"

export type CallLogRecordingDialogCPProps = {
  open: boolean
  callSid: string
  onClose: () => void
}

export default function CallLogRecordingDialogCP({
  open,
  callSid,
  onClose,
}: CallLogRecordingDialogCPProps) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || callSid.trim() === "") {
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    setAudioSrc(null)
    void fetchCallLogRecordingWithRetry(callSid)
      .then((result) => {
        if (!cancelled) {
          setAudioSrc(`data:${result.contentType};base64,${result.audioBase64}`)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "No se pudo reproducir la grabación de la llamada."
          setError(message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [open, callSid])

  const handleClose = () => {
    setAudioSrc(null)
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Grabación · {callSid}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" alignItems="center" gap={1.5} py={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Cargando grabación…
            </Typography>
          </Box>
        ) : null}
        {!loading && error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : null}
        {!loading && !error && audioSrc ? (
          <audio controls src={audioSrc} style={{ width: "100%", marginTop: 4 }} />
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={handleClose} sx={{ cursor: "pointer" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
