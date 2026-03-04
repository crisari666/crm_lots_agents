import { Box, Paper, Typography } from "@mui/material";
import LeadAlertsListContent from "../features/alerts/components/lead-alerts-list-content";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";

export default function LeadAlertsView() {
  return (
    <>
      <Box sx={{ width: "100%", padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          Alertas de mi equipo
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
          Consulta las alertas operativas de los agentes de tu equipo
        </Typography>

        <Paper sx={{ width: "100%", padding: 2 }}>
          <LeadAlertsListContent />
        </Paper>
      </Box>
      <CustomerResumeDialog />
    </>
  );
}
