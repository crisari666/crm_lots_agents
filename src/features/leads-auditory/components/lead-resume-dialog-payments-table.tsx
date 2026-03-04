import { CalendarMonth, MoneyOff, PriceCheck } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

export default function LeadResumeDialogPaymentsTable() {
  const { leadResumeDetail } = useAppSelector(state => state.leadsAuditory)
  
  return (
    <>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center"> <CalendarMonth/>  </TableCell>
              <TableCell align="center"> <MoneyOff color="warning"/> </TableCell>
              <TableCell align="center"> <PriceCheck color="success"/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadResumeDetail!.payments.map((payment) => (
              <TableRow key={`pay_${payment._id.date}`}>
                <TableCell align="center"> {payment._id.date} </TableCell>
                <TableCell align="center"> {payment.untrusted} </TableCell>
                <TableCell align="center"> {payment.trusted} </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}