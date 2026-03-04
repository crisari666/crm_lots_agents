import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface CallLogTranscriptionModalProps {
  open: boolean;
  transcription: string;
  onClose: () => void;
}

export default function CallLogTranscriptionModal({
  open,
  transcription,
  onClose,
}: CallLogTranscriptionModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        className="closeDialog"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Close />
      </IconButton>
      <DialogTitle>Transcripción de la llamada</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mt: 1 }}>
          {transcription || "No hay transcripción disponible"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

