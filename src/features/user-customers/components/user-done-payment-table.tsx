import { CalendarMonth, Info, MonetizationOn, Person } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { dateUTCToFriendly } from "../../../utils/date.utils";
import { UserPaymentRowI } from "../../../app/models/user-payments-row.interface";

export default function UserDonePaymentsTable() {
  const { paymentsResume: {done} } = useAppSelector((state) => state.userCustomer)

  const resolveStatus = (pay: UserPaymentRowI): string => {
    if(pay.trusted === true && !pay.received === false && pay.confirmed === false) {
      return "Verified"
    } else if(pay.trusted === true && !pay.received === false && pay.confirmed === true) {
      return "Confirmed"
    } else if(pay.trusted === true && !pay.received === false && pay.confirmed === true) {
      return "Received"
    }
    return 'undefined'
  }
  return (
    <TableContainer>
      <Table padding="none">
        <TableHead>
          <TableRow>
            <TableCell align="center"> <Person/> </TableCell>
            <TableCell align="center"> <MonetizationOn/> </TableCell>
            <TableCell align="center"> <Info/> </TableCell>
            <TableCell align="center"> <CalendarMonth/> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {done.map((row, index) => (
            <TableRow key={index}>
              <TableCell> {row.customer[0].name} </TableCell>
              <TableCell sx={{paddingLeft: 2}}> {numberToCurrency(row.value)} </TableCell>
              <TableCell align="right" sx={{paddingLeft: 2}}> {resolveStatus(row)} </TableCell>
              <TableCell sx={{paddingLeft: 2}}> {dateUTCToFriendly(row.date)} </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">{numberToCurrency(done.reduce((prev, current) => prev + current.value, 0)) }</TableCell>
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}