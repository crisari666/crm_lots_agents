import React, { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

type LotInventoryDesistDialogProps = {
  open: boolean
  loading: boolean
  onClose: () => void
  onConfirm: (params: { files: File[]; note: string }) => void
}

export default function LotInventoryDesistDialogCP({
  open,
  loading,
  onClose,
  onConfirm
}: LotInventoryDesistDialogProps) {
  const [note, setNote] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const handleClose = () => {
    if (loading) return
    setNote("")
    setFiles([])
    setFileError(null)
    onClose()
  }

  const handleConfirm = () => {
    if (files.length === 0) {
      setFileError(s.desistFilesRequired)
      return
    }
    onConfirm({ files, note })
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{s.desistTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2">{s.desistHint}</Typography>
          <Button variant="outlined" component="label">
            {s.desistFiles}
            <input
              hidden
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const next = Array.from(e.target.files ?? [])
                setFiles(next)
                setFileError(next.length === 0 ? s.desistFilesRequired : null)
              }}
            />
          </Button>
          {files.length > 0 ? (
            <Typography variant="caption">{files.map((f) => f.name).join(", ")}</Typography>
          ) : null}
          {fileError ? (
            <Typography variant="caption" color="error">
              {fileError}
            </Typography>
          ) : null}
          <TextField
            label={s.desistNote}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {s.desistCancel}
        </Button>
        <Button variant="contained" onClick={handleConfirm} disabled={loading}>
          {s.desistConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
