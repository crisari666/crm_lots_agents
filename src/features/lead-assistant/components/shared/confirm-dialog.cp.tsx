import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"

type Props = {
  readonly open: boolean
  readonly title: string
  readonly body: string
  readonly confirmLabel: string
  readonly cancelLabel?: string
  readonly isDestructive?: boolean
  readonly isLoading?: boolean
  readonly onConfirm: () => void
  readonly onCancel: () => void
}

/** Accessible confirmation used before destructive or data-losing actions. */
export default function ConfirmDialogCP(props: Props) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onCancel}
      aria-labelledby="lead-assistant-confirm-title"
      aria-describedby="lead-assistant-confirm-body"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="lead-assistant-confirm-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="lead-assistant-confirm-body">{props.body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} autoFocus>
          {props.cancelLabel ?? s.cancel}
        </Button>
        <Button
          onClick={props.onConfirm}
          color={props.isDestructive === true ? "error" : "primary"}
          variant="contained"
          disabled={props.isLoading === true}
        >
          {props.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
