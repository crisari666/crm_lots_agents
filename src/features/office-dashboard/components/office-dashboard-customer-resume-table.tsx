import { CalendarMonth, PermContactCalendar, Person, PointOfSale, PriceCheck } from "@mui/icons-material";
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { OfficeCustomersResumeRow } from "../../../app/models/office-customers-resume-row";
import { ro } from "date-fns/locale";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { dateToInputDate } from "../../../utils/date.utils";

export default function OfficeDashboardCustomerResumeTable({rows} : {rows: OfficeCustomersResumeRow[]}) {

  const resolveSituation = (row: OfficeCustomersResumeRow) => {
    if(row.situation.length === 0) return '--'
    if(row.situation[0].situation.length === 0) return '--'
    return row.situation[0].situation[0].title
  }

  const resolveExpected = (row: OfficeCustomersResumeRow) => {
    if(row["payments-expected"].length === 0) return 0
    return row["payments-expected"][0].payments
  }
  const resolveFee = (row: OfficeCustomersResumeRow) => {
    if(row.fees.length === 0) return 0
    return row.fees[0].payments
  }
  return (
    <>
      <TableContainer sx={{maxHeight: '500px'}}>
        <Table padding="none" stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center"> User </TableCell>
              <TableCell align="center"> Customer </TableCell>
              <TableCell align="center"> Situation </TableCell>
              <TableCell align="center"> <PointOfSale/> </TableCell>
              <TableCell align="center"> <PriceCheck/> </TableCell>
              <TableCell align="center"> <CalendarMonth/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id}>
                <TableCell sx={{paddingX: 1}}>{row.userAssigned[0].lastName}</TableCell>
                <TableCell sx={{paddingX: 1}}>{row.name}</TableCell>
                <TableCell sx={{paddingX: 1}}>{resolveSituation(row)}</TableCell>
                <TableCell align="center" sx={{paddingX: 1}}> {numberToCurrency(resolveExpected(row))} </TableCell>
                <TableCell align="center" sx={{paddingX: 1}}> {numberToCurrency(resolveFee(row))} </TableCell>
                <TableCell sx={{paddingX: 1}}>{dateToInputDate(row.dateAssigned)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell align="center"> {numberToCurrency(rows.reduce((prev, curr) => prev + resolveExpected(curr) , 0))} </TableCell>
              <TableCell align="center"> {numberToCurrency(rows.reduce((prev, curr) => prev + resolveFee(curr) , 0))} </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  )
}