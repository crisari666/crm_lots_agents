import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

type LotInventoryClearDialogProps = {
  open: boolean
  loading: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LotInventoryClearDialogCP({
  open,
  loading,
  onClose,
  onConfirm
}: LotInventoryClearDialogProps) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{s.excelClearInventoryTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">{s.excelClearInventoryHint}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {s.excelClearInventoryCancel}
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {s.excelClearInventoryConfirm}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
