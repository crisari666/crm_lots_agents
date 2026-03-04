import { AttachMoney, CalendarMonth, Person, PriceCheck } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { dateToInputDate } from "../../../utils/date.utils";

export default function ExpectedPaymentsTable() {
  const {paymentsResume: {expected}} = useAppSelector((state) => state.userCustomer)
  return (
    <TableContainer sx={{maxHeight: '500px'}}>
      <Table padding="none" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center"> <Person/> </TableCell>
            <TableCell align="center"> <AttachMoney/> </TableCell>
            <TableCell align="center"> <PriceCheck/> </TableCell>
            <TableCell align="center"> <CalendarMonth/> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expected.map((row, index) => (
            <TableRow key={index}>
              <TableCell> {row.customer[0].name} </TableCell>
              <TableCell align="center" sx={{paddingRight: 2}}> {numberToCurrency(row.valueExpected)} </TableCell>
              <TableCell align="center" sx={{paddingRight: 2}}> {numberToCurrency(row.valuePayed)} </TableCell>
              <TableCell> {dateToInputDate(row.dateExpected)} </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center" > {numberToCurrency(expected.reduce((prev, curr) => prev + curr.valueExpected, 0))} </TableCell>
            <TableCell align="center" > {numberToCurrency(expected.reduce((prev, curr) => prev + curr.valuePayed, 0))} </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}