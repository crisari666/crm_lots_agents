import { Divider, Paper, Typography } from "@mui/material";
import ResultSituations from "./results-situations";
import ResultPaymentRequestsCP from "./results-payment-request.cp";
import ResultsPaymentsCP from "./results-payment.cp";
import ResultCallReports from "./result-calls-report";
import ResultCallAssignedReports from "./result-calls-assigned-report";
import ReportUsersDidNotCalls from "./report-users-did-not-calls";

export default function ReportsResultCP() {
  return (
    <Paper sx={{padding: 2, marginTop: 2}}>
      
      <Typography variant="h6">Reportes</Typography>
      <Divider className="divider" />
      <ResultSituations />
      <ResultPaymentRequestsCP />
      <ResultsPaymentsCP />
      <ResultCallReports />
      <ResultCallAssignedReports />
      <ReportUsersDidNotCalls />
    </Paper>
  )
}