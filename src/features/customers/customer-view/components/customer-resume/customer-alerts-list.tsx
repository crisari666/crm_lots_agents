import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Grid,
  CircularProgress,
} from "@mui/material";
import { AlertInterface } from "../../../../../app/services/alerts.service";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";

interface CustomerAlertsListProps {
  alerts: AlertInterface[];
  loading: boolean;
}

export default function CustomerAlertsList({
  alerts,
  loading,
}: CustomerAlertsListProps) {
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ padding: 1.5 }}>
        No hay alertas operativas para este cliente.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {alerts.map((alert) => (
        <Card key={alert._id} variant="outlined" sx={{ padding: 0 }}>
          <CardContent sx={{ padding: 1.5, "&:last-child": { paddingBottom: 1.5 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontSize: "0.95rem", fontWeight: 600 }}>
                  {alert.reason}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                  Creada: {dateUTCToFriendly(alert.createdAt)}
                </Typography>
              </Box>
              <Chip
                label={alert.status}
                color={getStatusColor(alert.status) as any}
                size="small"
                sx={{ fontSize: "0.7rem", height: "22px" }}
              />
            </Box>

            <Divider sx={{ marginY: 1 }} />

            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  Descripción
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                  {alert.description}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  Agente Asignado
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                  {alert.agentId.name} {alert.agentId.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  {alert.agentId.email}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  Creada por
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                  {alert.createdBy.name} {alert.createdBy.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                  {alert.createdBy.email}
                </Typography>
              </Grid>

              {alert.agentResponse && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      padding: 1,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      marginTop: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                      Respuesta del Agente
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 0.5, fontSize: "0.85rem" }}>
                      {alert.agentResponse.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                      Respondido: {dateUTCToFriendly(alert.agentResponse.respondedAt)}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {alert.verifiedBy && (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      padding: 1,
                      bgcolor: "success.light",
                      borderRadius: 1,
                      marginTop: 0.5,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                      Verificado por: {alert.verifiedBy.name}{" "}
                      {alert.verifiedBy.lastName}
                    </Typography>
                    {alert.verifiedAt && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", display: "block" }}>
                        {dateUTCToFriendly(alert.verifiedAt)}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
