import { CalendarMonth, CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

export default function LeadResumeDialogSituationsTable() {
  const { leadResumeDetail } = useAppSelector(state => state.leadsAuditory)
  
  return (
    <>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center"> <CalendarMonth/>  </TableCell>
              <TableCell align="center"> <CheckBoxOutlineBlank color="warning"/> </TableCell>
              <TableCell align="center"> <CheckBox color="success"/> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadResumeDetail!.situations.map((payment) => (
              <TableRow key={`situation${payment._id.date}`}>
                <TableCell align="center"> {payment._id.date} </TableCell>
                <TableCell align="center"> {payment.unconfirmed} </TableCell>
                <TableCell align="center"> {payment.confirmed} </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}