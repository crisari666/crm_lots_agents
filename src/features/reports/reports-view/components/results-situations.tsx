import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { dateUTCToFriendly } from "../../../../utils/date.utils"
import { Check, ImageOutlined, ImageSearch } from "@mui/icons-material"
import { confirmLogSituationThunk, setImageToPreviewReportsAct } from "../reports.slice"

export default function ResultSituations() {
  const {filter, customerLogResults} = useAppSelector(state => state.reports) 
  const dispatch = useAppDispatch()

  const resolveCustomer = (customer: any): string => {
    if(customer.length === 0) return ""
    return `${customer[0].name}`
  }
  const resolveSituation = (situation: any): string => {
    if(situation.length === 0) return ""
    return `${situation[0].title}`
  }
  const resolveUser = (user: any): string => {
    if(user.length === 0) return ""
    return `${user[0].lastName}`
  }

  const resolveCurrentUser = (log: any): string => {
    if( log.customer === undefined || log.customer === null || log.customer.length === 0) {
      return "undefined customer"
    } else {
      if(log.customer[0].userAssigned === undefined || log.customer[0].userAssigned === null || log.customer[0].userAssigned.length === 0) {
        return "undefined user"
      } else {
        return log.customer[0].userAssigned[0].lastName
      }
    } 
  }

  const resolveLead = (user: any): string => {
    if(user.length === 0) return ""
    if(user[0].lead === undefined || user[0].lead === null || user[0].lead.length === 0) return ""
    return `${user[0].lead[0].lastName}`
  }

  return(
    <>
      {filter.type === "situations" && customerLogResults !== undefined && <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Reporter</TableCell>
                <TableCell>Lead</TableCell>
                <TableCell>Situation</TableCell>
                <TableCell>Note</TableCell>
                <TableCell> <ImageSearch/> </TableCell>
                <TableCell> <Check/> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerLogResults.map((log, i) => (
                <TableRow key={i}>
                  <TableCell>{dateUTCToFriendly(log.date)}</TableCell>
                  <TableCell>{resolveCustomer(log.customer)}</TableCell>
                  <TableCell>{resolveCurrentUser(log)}</TableCell>
                  <TableCell>{resolveUser(log.user)}</TableCell>
                  <TableCell>{resolveLead(log.user)}</TableCell>
                  <TableCell>{resolveSituation(log.situation)}</TableCell>
                  <TableCell>{log.note}</TableCell>
                  <TableCell> <Button variant='outlined' size="small" disabled={!log.image} onClick={() => dispatch(setImageToPreviewReportsAct(`uploads/situations/${log.image}`))}> <ImageOutlined/> </Button> </TableCell>
                  <TableCell> <Checkbox disabled={log.confirmed === true} checked={log.confirmed} onChange={(e, checked) => dispatch(confirmLogSituationThunk({index: i, logSituadionId: log._id}))} /> </TableCell>
                </TableRow>
              
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </>}
    </>
  )
}