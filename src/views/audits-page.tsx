import { Divider, Paper, Typography } from "@mui/material";
import AuditsList from "../features/users-list/components/subadmin/audits-list";

export default function AuditsPage() {
  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Auditores</Typography>
        <Divider />
        <AuditsList />
      </Paper>
    </>
  )
}