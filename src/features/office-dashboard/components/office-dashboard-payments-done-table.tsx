import { TableContainer, Table, TableHead, TableBody, TableFooter, TableRow, TableCell } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { OfficeDonePaymentRow } from "../../../app/models/office-dashboard-payment-row";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { CalendarMonth, PointOfSale, PriceCheck } from "@mui/icons-material";
import { dateToInputDate } from "../../../utils/date.utils";

export default function OfficeDashboardPaymentsDoneTable() {
  const { paymentsResume: {expected} } = useAppSelector(state => state.officeDashboard)

  return (
    <>
      <TableContainer sx={{maxHeight: '500px'}}>
        <Table stickyHeader padding="none">
          <TableHead>
            <TableRow>
              <TableCell> User </TableCell>
              <TableCell> Customer </TableCell>
              <TableCell align="center"> <PointOfSale/> </TableCell>
              <TableCell align="center"> <PriceCheck/> </TableCell>
              <TableCell align="center"> <CalendarMonth/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expected.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{paddingX: 1}}>{row.user[0].lastName}</TableCell>
                <TableCell sx={{paddingX: 1}}>{row.customer[0].name}</TableCell>
                <TableCell align="center" sx={{paddingX: 1}}>{numberToCurrency(row.valueExpected)}</TableCell>
                <TableCell align="center" sx={{paddingX: 1}}>{numberToCurrency(row.valuePayed)}</TableCell>
                <TableCell align="center" sx={{paddingX: 1}}>{dateToInputDate(row.dateExpected)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}></TableCell>
              <TableCell align="center" > {numberToCurrency(expected.reduce((prev, curr) =>prev + curr.valueExpected , 0))} </TableCell>
              <TableCell align="center" > {numberToCurrency(expected.reduce((prev, curr) =>prev + curr.valuePayed , 0))} </TableCell>
              <TableCell> </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}