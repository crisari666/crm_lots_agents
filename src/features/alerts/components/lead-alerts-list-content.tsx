import { useEffect } from "react";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { getLeadTeamAlertsThunk } from "../alerts.slice";
import AlertsList from "./alerts-list";

export default function LeadAlertsListContent() {
  const dispatch = useAppDispatch();
  const { leadTeamAlerts, loading } = useAppSelector(
    (state: RootState) => state.alerts
  );

  useEffect(() => {
    dispatch(getLeadTeamAlertsThunk());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getLeadTeamAlertsThunk());
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!leadTeamAlerts?.length) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No hay alertas del equipo en esta categoría
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 3 }}>
      {leadTeamAlerts.map((item) => (
        <Paper key={item.userId} variant="outlined" sx={{ overflow: "hidden" }}>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "grey.100",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {item.user.name} {item.user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.user.email}
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <AlertsList
              alerts={item.alerts}
              onAlertUpdate={handleRefresh}
              readOnly
            />
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
