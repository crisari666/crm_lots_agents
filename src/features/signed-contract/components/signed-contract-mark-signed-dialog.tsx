import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import Typography from "@mui/material/Typography"

export default function SignedContractMarkSignedDialog({
  open,
  contractName,
  contractEmail,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: {
  readonly open: boolean
  readonly contractName: string
  readonly contractEmail: string
  readonly isSubmitting: boolean
  readonly errorMessage: string | null
  readonly onClose: () => void
  readonly onConfirm: () => void
}) {
  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="mark-signed-dialog-title"
      aria-describedby="mark-signed-dialog-description"
    >
      <DialogTitle id="mark-signed-dialog-title" sx={{ pb: 0.5 }}>
        ¿Marcar como firmado?
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <DialogContentText
          id="mark-signed-dialog-description"
          component="div"
          color="text.primary"
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            El contrato quedará registrado como firmado en el CRM. Si aplica, se
            enviarán los correos de bienvenida y copia del contrato.
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {contractName.trim() !== "" ? contractName : "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {contractEmail}
          </Typography>
        </DialogContentText>
        {errorMessage != null && errorMessage !== "" ? (
          <Typography variant="caption" color="error" sx={{ mt: 1.5, display: "block" }}>
            {errorMessage}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 2, py: 1.5, gap: 0.5 }}>
        <Button
          size="small"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ cursor: isSubmitting ? "default" : "pointer" }}
        >
          Cancelar
        </Button>
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          onClick={onConfirm}
          autoFocus
          sx={{ cursor: isSubmitting ? "default" : "pointer", minWidth: 88 }}
        >
          {isSubmitting ? "Guardando…" : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
