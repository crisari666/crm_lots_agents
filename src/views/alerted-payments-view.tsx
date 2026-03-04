import { Paper } from "@mui/material"
import AlertedPaysList from "../features/payments/alerted-payments/alerted-payments-list"
import AlertedPaymentsFilter from "../features/payments/alerted-payments/alerted-payments-filter"

export default function AlertedPaymentsView() {
  return (
    <>
      <Paper sx={{p: 2}}>
        <AlertedPaymentsFilter />
        <AlertedPaysList />
      </Paper>
    </>
  )
}