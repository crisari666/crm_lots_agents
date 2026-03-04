import { Grid } from "@mui/material";
import OfficeDashboarCustomersResume from "../features/office-dashboard/components/office-dasboard-customers-resume";
import OfficeDashboarPaymentsResume from "../features/office-dashboard/components/office-dasboard-payments-resume";

export default function OfficeDashboardView() {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} p={1}>
          <OfficeDashboarCustomersResume />
        </Grid>
        <Grid item xs={12} md={6} p={1}>
          <OfficeDashboarPaymentsResume />
        </Grid>
      </Grid>
    </>
  );
}