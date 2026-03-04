import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Link,
} from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { getCustomerResumeThunk } from "../../customers/customer-view/customer-view.slice";
import { AlertInterface } from "../../../app/services/alerts.service";
import { dateUTCToFriendly } from "../../../utils/date.utils";
import { verifyAlertReq } from "../../../app/services/alerts.service";

interface AlertsListProps {
  alerts: AlertInterface[];
  onAlertUpdate?: () => void;
  readOnly?: boolean;
}

export default function AlertsList({ alerts, onAlertUpdate = () => {}, readOnly = false }: AlertsListProps) {
  const dispatch = useAppDispatch();
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertInterface | null>(
    null
  );
  const [verifyAction, setVerifyAction] = useState<"VERIFIED" | "REJECTED" | null>(null);

  const handleCustomerNameClick = (customerId: string) => {
    dispatch(getCustomerResumeThunk(customerId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "IN_PROGRESS":
        return "info";
      case "RESOLVED":
        return "success";
      case "VERIFIED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const handleVerifyClick = (alert: AlertInterface, action: "VERIFIED" | "REJECTED") => {
    setSelectedAlert(alert);
    setVerifyAction(action);
    setVerifyDialogOpen(true);
  };

  const handleVerify = async () => {
    if (selectedAlert && verifyAction) {
      try {
        await verifyAlertReq({
          alertId: selectedAlert._id,
          data: { status: verifyAction },
        });
        setVerifyDialogOpen(false);
        setSelectedAlert(null);
        setVerifyAction(null);
        onAlertUpdate();
      } catch (error) {
        console.error("Error verifying alert:", error);
      }
    }
  };

  if (alerts.length === 0) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No hay alertas en esta categoría
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {alerts.map((alert) => (
            <Card key={alert._id} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {alert.reason}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Creada: {dateUTCToFriendly(alert.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={alert.status}
                    color={getStatusColor(alert.status) as any}
                    size="small"
                  />
                </Box>

                <Divider sx={{ marginY: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Cliente
                    </Typography>
                    <Link
                      component="button"
                      variant="body1"
                      onClick={() => handleCustomerNameClick(alert.clientId._id)}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "primary.main",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      {alert.clientId.name} {alert.clientId.lastName}
                    </Link>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {alert.clientId.phone}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Agente Asignado
                    </Typography>
                    <Typography variant="body1">
                      {alert.agentId.name} {alert.agentId.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {alert.agentId.email}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1">{alert.description}</Typography>
                  </Grid>

                  {alert.agentResponse && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          padding: 2,
                          bgcolor: "grey.100",
                          borderRadius: 1,
                          marginTop: 1,
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Respuesta del Agente
                        </Typography>
                        <Typography variant="body1" sx={{ marginTop: 1 }}>
                          {alert.agentResponse.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Respondido: {dateUTCToFriendly(alert.agentResponse.respondedAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  )}

                  {alert.verifiedBy && (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          padding: 2,
                          bgcolor: "success.light",
                          borderRadius: 1,
                          marginTop: 1,
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Verificado por: {alert.verifiedBy.name}{" "}
                          {alert.verifiedBy.lastName}
                        </Typography>
                        {alert.verifiedAt && (
                          <Typography variant="caption" color="text.secondary">
                            {dateUTCToFriendly(alert.verifiedAt)}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {!readOnly && alert.status === "RESOLVED" && (
                  <Box sx={{ marginTop: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleVerifyClick(alert, "VERIFIED")}
                    >
                      Verificar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleVerifyClick(alert, "REJECTED")}
                    >
                      Rechazar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
      </Box>

      <Dialog
        open={verifyDialogOpen}
        onClose={() => {
          setVerifyDialogOpen(false);
          setSelectedAlert(null);
          setVerifyAction(null);
        }}
      >
        <DialogTitle>
          {verifyAction === "VERIFIED"
            ? "Verificar Alerta"
            : verifyAction === "REJECTED"
            ? "Rechazar Alerta"
            : "Confirmar Acción"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            ¿Estás seguro de que deseas{" "}
            {verifyAction === "VERIFIED"
              ? "verificar"
              : verifyAction === "REJECTED"
              ? "rechazar"
              : "procesar"}{" "}
            esta alerta?
          </Typography>
          {selectedAlert && (
            <Box sx={{ marginTop: 2 }}>
              <Typography variant="subtitle2">Motivo:</Typography>
              <Typography variant="body2">{selectedAlert.reason}</Typography>
              {selectedAlert.agentResponse && (
                <>
                  <Typography variant="subtitle2" sx={{ marginTop: 1 }}>
                    Respuesta del Agente:
                  </Typography>
                  <Typography variant="body2">
                    {selectedAlert.agentResponse.comment}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setVerifyDialogOpen(false);
              setSelectedAlert(null);
              setVerifyAction(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleVerify}
            variant="contained"
            color={verifyAction === "VERIFIED" ? "success" : "error"}
          >
            {verifyAction === "VERIFIED"
              ? "Verificar"
              : verifyAction === "REJECTED"
              ? "Rechazar"
              : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
