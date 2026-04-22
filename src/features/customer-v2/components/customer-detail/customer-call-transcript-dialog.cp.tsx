import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"

export type CustomerCallTranscriptDialogCPProps = {
  open: boolean
  title: string
  transcript: string
  onClose: () => void
}

export default function CustomerCallTranscriptDialogCP({
  open,
  title,
  transcript,
  onClose,
}: CustomerCallTranscriptDialogCPProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {transcript.trim() !== "" ? transcript : "Sin transcripción disponible."}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Button onClick={onClose} sx={{ cursor: "pointer" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
