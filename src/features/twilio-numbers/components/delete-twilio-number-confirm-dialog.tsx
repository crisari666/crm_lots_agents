import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { twilioNumbersStrings as s } from "../../../i18n/locales/twilio-numbers.strings"
import {
  closeDeleteTwilioNumberDialogAct,
  deleteTwilioNumberThunk,
} from "../slice/twilio-numbers.slice"

export default function DeleteTwilioNumberConfirmDialog() {
  const dispatch = useAppDispatch()
  const {
    displayDeleteTwilioNumberDialog,
    deleteTwilioNumberTarget,
    deleteTwilioNumberError,
    loading,
  } = useAppSelector((state) => state.twilioNumbers)

  const closeDialog = () => {
    if (!loading) {
      dispatch(closeDeleteTwilioNumberDialogAct())
    }
  }

  const confirmDelete = () => {
    if (deleteTwilioNumberTarget == null) {
      return
    }
    dispatch(deleteTwilioNumberThunk(deleteTwilioNumberTarget.PNID))
  }

  return (
    <Dialog
      open={displayDeleteTwilioNumberDialog}
      onClose={loading ? undefined : closeDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{s.deleteConfirmTitle}</DialogTitle>
      <DialogContent>
        {deleteTwilioNumberError != null ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {deleteTwilioNumberError}
          </Alert>
        ) : null}
        {deleteTwilioNumberTarget != null ? (
          <Typography variant="body2" color="text.secondary">
            {s.deleteConfirmBody({
              pnid: deleteTwilioNumberTarget.PNID,
              number: deleteTwilioNumberTarget.number,
              friendlyNumber: deleteTwilioNumberTarget.friendlyNumber,
              userEmail: deleteTwilioNumberTarget.userEmail,
            })}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} disabled={loading}>
          {s.deleteCancel}
        </Button>
        <Button
          onClick={confirmDelete}
          color="error"
          variant="contained"
          disabled={loading || deleteTwilioNumberTarget == null}
        >
          {loading ? s.deleting : s.deleteConfirmAction}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
