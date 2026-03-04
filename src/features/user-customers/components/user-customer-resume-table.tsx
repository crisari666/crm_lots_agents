import { IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { UserResumeRow } from "../user-customers.state";
import { AccountBox, AttachMoney, PriceCheck, Visibility } from "@mui/icons-material";
import { numberToCurrency } from "../../../utils/numbers.utils";
import { useNavigate } from "react-router-dom";
import { dateToInputDate } from "../../../utils/date.utils";

export default function UserCustomerResumeTable({rows} : {rows: UserResumeRow[]}){
  const navigate = useNavigate()
  const resolveSituationTitle = (row: UserResumeRow): string => {
    if(row.situation.length > 0 && row.situation[0].situation.length > 0) {
      return row.situation[0].situation[0].title
    }
    return "--"
  }

  const resolveFeeValue = (row: UserResumeRow): number => {
    if(row.fees.length > 0) {
      return row.fees[0].payments
    }
    return 0
  }

  const resolveExpectedPayment = (row: UserResumeRow): number => {
    if(row['payments-expected'].length > 0) {
      return row['payments-expected'][0].payments;
    }
    return 0
  }

  return(
    <TableContainer sx={{maxHeight: '500px'}}>
      <Table padding="none" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>  <AccountBox/> </TableCell>
            <TableCell>  <AccountBox/> </TableCell>
            <TableCell>  Situation </TableCell>
            <TableCell> <AttachMoney/> </TableCell>
            <TableCell> <PriceCheck/></TableCell>
            <TableCell> <Visibility/> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell sx={{paddingX: 1}}> {dateToInputDate(row.dateAssigned)} </TableCell>
              <TableCell sx={{paddingX: 1}}> {row.name} </TableCell>
              <TableCell sx={{paddingX: 1}}> {resolveSituationTitle(row)} </TableCell>
              <TableCell sx={{paddingX: 1}}> {numberToCurrency(resolveExpectedPayment(row))} </TableCell>
              <TableCell sx={{paddingX: 1}}> {numberToCurrency(resolveFeeValue(row))} </TableCell>
              <TableCell sx={{paddingX: 1}}> 
                <IconButton  onClick={() => navigate(`/dashboard/customer/${row._id}`)} color="info"> 
                  <Visibility/>
                </IconButton> 
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}></TableCell>
            <TableCell sx={{paddingRight: 2}}> {numberToCurrency(rows.reduce((prev, curr) => prev + resolveFeeValue(curr), 0))} </TableCell>
            <TableCell>{numberToCurrency(rows.reduce((prev, curr) =>  prev + resolveFeeValue(curr), 0))}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  )
}