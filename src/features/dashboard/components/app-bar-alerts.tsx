import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import {
  getAgentAlertsThunk,
  respondToAlertThunk,
} from "../../alerts/alerts.slice";
import { getAuditorAlertsReq } from "../../../app/services/alerts.service";
import { dateUTCToFriendly } from "../../../utils/date.utils";
import LoadingIndicator from "../../../app/components/loading-indicator";

export default function AppBarAlerts() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state: RootState) => state.login);
  const { agentAlerts, loading } = useAppSelector(
    (state: RootState) => state.alerts
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [responseComment, setResponseComment] = useState("");
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [auditorAlertsCount, setAuditorAlertsCount] = useState(0);

  const open = Boolean(anchorEl);
  const isAgent = currentUser?.level && currentUser?.level >= 2;
  const isAuditor = currentUser?.level === 0 || currentUser?.level === 1;

  useEffect(() => {
    console.log({isAgent, isAuditor, currentUser});
    if (isAgent) {
      dispatch(getAgentAlertsThunk());
      // Refresh alerts every 30 seconds
      // const interval = setInterval(() => {
      //   dispatch(getAgentAlertsThunk());
      // }, 30000);
    }
    if (isAuditor) {
      loadAuditorAlertsCount();
      // Refresh alerts count every 30 seconds
      // const interval = setInterval(() => {
      //   loadAuditorAlertsCount();
      // }, 30000);
    }
  }, [currentUser]);

  useEffect(() => {
  }, [isAuditor]);

  const loadAuditorAlertsCount = async () => {
    try {
      const alerts = await getAuditorAlertsReq({ status: "PENDING,IN_PROGRESS,RESOLVED" });
      setAuditorAlertsCount(alerts.length);
    } catch (error) {
      console.error("Error loading auditor alerts count:", error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRespondClick = (alertId: string) => {
    setSelectedAlert(alertId);
    setResponseDialogOpen(true);
    handleClose();
  };

  const handleSubmitResponse = () => {
    if (selectedAlert && responseComment.trim()) {
      dispatch(
        respondToAlertThunk({
          alertId: selectedAlert,
          data: { comment: responseComment },
        })
      ).then(() => {
        setResponseDialogOpen(false);
        setResponseComment("");
        setSelectedAlert(null);
        dispatch(getAgentAlertsThunk());
      });
    }
  };

  const pendingAlerts = agentAlerts.filter(
    (alert) => alert.status === "PENDING" || alert.status === "IN_PROGRESS"
  );
  const resolvedAlerts = agentAlerts.filter(
    (alert) => alert.status === "RESOLVED"
  );

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

  const handleAuditorClick = () => {
    navigate("/dashboard/alerts");
  };

  // For auditors: show only badge, redirect to alerts panel
  if (isAuditor) {
    return (
      <IconButton color="inherit" onClick={handleAuditorClick}>
        <Badge badgeContent={auditorAlertsCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
    );
  }

  // For agents: show full menu
  if (!isAgent) {
    return null;
  }

  return (
    <>
      <LoadingIndicator open={loading} />
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={pendingAlerts.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            maxHeight: 500,
            width: "400px",
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6">Mis Alertas</Typography>
          <Divider sx={{ marginY: 1 }} />
        </Box>

        {pendingAlerts.length === 0 && resolvedAlerts.length === 0 && (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No hay alertas
            </Typography>
          </MenuItem>
        )}

        {pendingAlerts.length > 0 && (
          <>
            <Box sx={{ paddingX: 2, paddingY: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Pendientes ({pendingAlerts.length})
              </Typography>
            </Box>
            {pendingAlerts.map((alert) => (
              <MenuItem
                key={alert._id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 2,
                }}
              >
                <Box sx={{ width: "100%", marginBottom: 1 }}>
                  <Chip
                    label={alert.status}
                    color={getStatusColor(alert.status) as any}
                    size="small"
                    sx={{ marginRight: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {dateUTCToFriendly(alert.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {alert.reason}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginY: 1 }}>
                  Cliente: {alert.clientId.name} {alert.clientId.lastName}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1, whiteSpace: "pre-wrap" }}>
                  {alert.description}
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleRespondClick(alert._id)}
                  sx={{ marginTop: 1 }}
                >
                  Responder
                </Button>
              </MenuItem>
            ))}
          </>
        )}

        {resolvedAlerts.length > 0 && (
          <>
            <Divider sx={{ marginY: 1 }} />
            <Box sx={{ paddingX: 2, paddingY: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Resueltas ({resolvedAlerts.length})
              </Typography>
            </Box>
            {resolvedAlerts.map((alert) => (
              <MenuItem
                key={alert._id}
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 2,
                }}
              >
                <Box sx={{ width: "100%", marginBottom: 1 }}>
                  <Chip
                    label={alert.status}
                    color={getStatusColor(alert.status) as any}
                    size="small"
                    sx={{ marginRight: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {dateUTCToFriendly(alert.createdAt)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {alert.reason}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginY: 1 }}>
                  Cliente: {alert.clientId.name} {alert.clientId.lastName}
                </Typography>
                {alert.agentResponse && (
                  <Box sx={{ marginTop: 1, padding: 1, bgcolor: "grey.100", borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Mi respuesta:
                    </Typography>
                    <Typography variant="body2">
                      {alert.agentResponse.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dateUTCToFriendly(alert.agentResponse.respondedAt)}
                    </Typography>
                  </Box>
                )}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>

      <Dialog
        open={responseDialogOpen}
        onClose={() => {
          setResponseDialogOpen(false);
          setResponseComment("");
          setSelectedAlert(null);
        }}
      >
        <DialogTitle>Responder Alerta</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentario / Respuesta"
            fullWidth
            multiline
            rows={4}
            value={responseComment}
            onChange={(e) => setResponseComment(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setResponseDialogOpen(false);
              setResponseComment("");
              setSelectedAlert(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitResponse}
            variant="contained"
            disabled={!responseComment.trim()}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
