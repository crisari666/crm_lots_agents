import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@mui/material"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type Props = {
  open: boolean
  onClose: () => void
  selectedCount: number
  isDeleting: boolean
  errorText: string | null
  onConfirm: () => void
}

export default function UsersOnboardingDeleteFlowsConfirmDialogCP({
  open,
  onClose,
  selectedCount,
  isDeleting,
  errorText,
  onConfirm
}: Props) {
  return (
    <Dialog open={open} onClose={isDeleting ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{s.deleteOrphanFlowsConfirmTitle}</DialogTitle>
      <DialogContent>
        {errorText ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorText}
          </Alert>
        ) : null}
        <Typography variant="body2" color="text.secondary">
          {s.deleteOrphanFlowsConfirmBody(selectedCount)}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isDeleting}>
          {s.deleteFlowsCancel}
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? s.sending : s.deleteFlowsConfirmAction}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
