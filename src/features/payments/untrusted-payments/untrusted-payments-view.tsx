import { Paper, Typography } from "@mui/material";
import UntrustedPaymentsListCP from "./components/untrusted-payments-list.cp";

export default function UntrustedPaymentsView() {
  return (
    <>
      <Paper>
        <Typography variant="h6">Unstrusted payments</Typography>
      </Paper>
      <UntrustedPaymentsListCP />
    </>
  )
}