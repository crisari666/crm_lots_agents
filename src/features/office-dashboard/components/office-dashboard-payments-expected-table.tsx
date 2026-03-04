import { TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { OfficeDonePaymentRow } from "../../../app/models/office-dashboard-payment-row";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { CalendarMonth } from "@mui/icons-material";
import { dateToInputDate } from "../../../utils/date.utils";

export default function OfficeDashboardPaymentsExpectedTable() {
  const { paymentsResume: {done} } = useAppSelector(state => state.officeDashboard)

  const resolveValueStatus = (row: OfficeDonePaymentRow) => {
    if(row.trusted === true && row.confirmed === false && row.received === false) return 'Confirmed'
    if(row.trusted === true && row.confirmed === true && row.received === false) return 'Received'
    if(row.trusted === true && row.confirmed === true && row.received === true) return 'Payed'
    return 'Pending'
  }
  return (
    <>
      <TableContainer sx={{maxHeight: '500px'}}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell> User </TableCell>
              <TableCell> Customer </TableCell>
              <TableCell> Value </TableCell>
              <TableCell> Status </TableCell>
              <TableCell> <CalendarMonth/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {done.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.customer[0].userAssigned[0].lastName}</TableCell>
                <TableCell>{row.customer[0].name}</TableCell>
                <TableCell>{numberToCurrency(row.value)}</TableCell>
                <TableCell>{resolveValueStatus(row)}</TableCell>
                <TableCell>{dateToInputDate(row.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell align="center"> {numberToCurrency( done.reduce((prev, curr) => prev + curr.value ,0) )} </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}