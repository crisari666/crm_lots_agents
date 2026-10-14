import React from "react"
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"

type Props = {
  open: boolean
  title: string
  body: string
  confirmLabel: string
  isDestructive: boolean
  isRunning: boolean
  errorText: string | null
  onClose: () => void
  onConfirm: () => void
}

export default function LeadConversationConfirmDialogCP({
  open,
  title,
  body,
  confirmLabel,
  isDestructive,
  isRunning,
  errorText,
  onClose,
  onConfirm,
}: Props): React.ReactElement {
  return (
    <Dialog open={open} onClose={isRunning ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {errorText ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorText}
          </Alert>
        ) : null}
        <Typography variant="body2" color="text.secondary">
          {body}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isRunning}>
          {s.cancel}
        </Button>
        <Button
          onClick={onConfirm}
          color={isDestructive ? "error" : "primary"}
          variant="contained"
          disabled={isRunning}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
