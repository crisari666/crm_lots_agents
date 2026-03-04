import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  getAuditorAlertsPanelThunk,
  selectAlertsPanelAllAlerts,
  selectAlertsPanelPendingAlerts,
  selectAlertsPanelRejectedAlerts,
  selectAlertsPanelResolvedAlerts,
  selectAlertsPanelVerifiedAlerts,
} from "../alerts.slice"
import AlertsList from "./alerts-list"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`alerts-tabpanel-${index}`}
      aria-labelledby={`alerts-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AlertsPanel() {
  const dispatch = useAppDispatch()
  const [tabValue, setTabValue] = useState(0)
  const loading = useAppSelector((state) => state.alerts.loading)
  const allAlerts = useAppSelector(selectAlertsPanelAllAlerts)
  const pendingAlerts = useAppSelector(selectAlertsPanelPendingAlerts)
  const resolvedAlerts = useAppSelector(selectAlertsPanelResolvedAlerts)
  const verifiedAlerts = useAppSelector(selectAlertsPanelVerifiedAlerts)
  const rejectedAlerts = useAppSelector(selectAlertsPanelRejectedAlerts)

  useEffect(() => {
    dispatch(getAuditorAlertsPanelThunk())
  }, [dispatch])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleAlertUpdate = () => {
    dispatch(getAuditorAlertsPanelThunk())
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Alertas Operativas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
        Gestiona y verifica las alertas creadas para los agentes
      </Typography>

      <Paper sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="alerts tabs"
          >
            <Tab
              label={`Pendientes (${pendingAlerts.length})`}
              id="alerts-tab-0"
              aria-controls="alerts-tabpanel-0"
            />
            <Tab
              label={`Resueltas (${resolvedAlerts.length})`}
              id="alerts-tab-1"
              aria-controls="alerts-tabpanel-1"
            />
            <Tab
              label={`Verificadas (${verifiedAlerts.length})`}
              id="alerts-tab-2"
              aria-controls="alerts-tabpanel-2"
            />
            <Tab
              label={`Rechazadas (${rejectedAlerts.length})`}
              id="alerts-tab-3"
              aria-controls="alerts-tabpanel-3"
            />
            <Tab
              label={`Todas (${allAlerts.length})`}
              id="alerts-tab-4"
              aria-controls="alerts-tabpanel-4"
            />
          </Tabs>
        </Box>

        {loading && (
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
        )}

        {!loading && (
          <>
            <TabPanel value={tabValue} index={0}>
              <AlertsList
                alerts={pendingAlerts}
                onAlertUpdate={handleAlertUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <AlertsList
                alerts={resolvedAlerts}
                onAlertUpdate={handleAlertUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <AlertsList
                alerts={verifiedAlerts}
                onAlertUpdate={handleAlertUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <AlertsList
                alerts={rejectedAlerts}
                onAlertUpdate={handleAlertUpdate}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <AlertsList
                alerts={allAlerts}
                onAlertUpdate={handleAlertUpdate}
              />
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
}
