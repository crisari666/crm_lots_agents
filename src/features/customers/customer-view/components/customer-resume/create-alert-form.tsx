import {
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { RootState } from "../../../../../app/store";
import {
  createAlertThunk,
  updateAlertFormAct,
  resetAlertFormAct,
} from "../../../../alerts/alerts.slice";
import LoadingIndicator from "../../../../../app/components/loading-indicator";

interface CreateAlertFormProps {
  customerId: string;
  customerName: string;
  onAlertCreated: () => void;
}

export default function CreateAlertForm({
  customerId,
  customerName,
  onAlertCreated,
}: CreateAlertFormProps) {
  const dispatch = useAppDispatch();
  const { alertForm, loading } = useAppSelector((state: RootState) => state.alerts);

  type AlertFormKey = keyof typeof alertForm;

  const handleInputChange = ({ name, val }: { name: AlertFormKey; val: string }) => {
    dispatch(updateAlertFormAct({ key: name, value: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId && alertForm.reason && alertForm.description) {
      dispatch(
        createAlertThunk({
          clientId: customerId,
          data: {
            reason: alertForm.reason,
            description: alertForm.description,
          },
        })
      ).then(() => {
        dispatch(resetAlertFormAct());
        onAlertCreated();
      });
    }
  };

  return (
    <>
      <LoadingIndicator open={loading} />
      <Paper sx={{ padding: 1.5, marginBottom: 1.5 }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: "1.1rem" }}>
          Crear Alerta Operativa
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1.5, fontSize: "0.85rem" }}>
          Cliente: {customerName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1.5, fontSize: "0.85rem" }}>
          La alerta será asignada automáticamente al agente asignado a este cliente.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Motivo"
                name="reason"
                value={alertForm.reason}
                onChange={(e) =>
                  handleInputChange({ name: "reason", val: e.target.value })
                }
                required
                size="small"
                placeholder="Ej: Problema de pago, Revisar situación, etc."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción"
                name="description"
                value={alertForm.description}
                onChange={(e) =>
                  handleInputChange({
                    name: "description",
                    val: e.target.value,
                  })
                }
                required
                multiline
                rows={3}
                size="small"
                placeholder="Describe el problema o acción requerida para el agente..."
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!alertForm.reason || !alertForm.description}
                size="small"
              >
                Crear Alerta
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </>
  );
}
