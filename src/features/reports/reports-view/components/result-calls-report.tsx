import { Button, ButtonGroup, createTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { getCallsResume } from "../../../../utils/customer.utils"
import { AddIcCall, PhoneForwarded, PhoneMissed, Visibility } from "@mui/icons-material"
import { ThemeProvider } from "@emotion/react"
import { RowCallReportItem } from "../../reports.state"
import { dateToInputDate } from "../../../../utils/date.utils"
import { getCallLogByIdWittCallNotesRelatedThunk } from "../reports.slice"

const theme = createTheme({
  components: {
    MuiTableCell: { styleOverrides: { root: { padding: '1px', minWidth: "30px" } }},
    MuiButtonGroup: { defaultProps: { size: 'small'}},
    MuiButton: { defaultProps: { size: 'small'}, styleOverrides: { root: { padding: '2px', minWidth: "30px" } }},
    MuiIconButton: { defaultProps: { size: 'small'}},
    MuiSvgIcon: { defaultProps: { fontSize: "small" } , styleOverrides: { root: { fontSize: "16px" } } },
    MuiIcon: { defaultProps: { fontSize: 'small' } }
  }
})
export default function ResultCallReports() {
  const dispatch = useAppDispatch() 
  const {filter, callsReport} = useAppSelector((state: RootState) => state.reports)
  const resolveCustomer = (customer: any): string => {
    if(customer.length === 0) return ""
    return `${customer[0].name} ${customer[0].phone}`
  }

  const resolveUser = (user: any): string => {
    if(user.length === 0) return ""
    return `${user[0].name}`
  }

  const resolveDate  = (call: RowCallReportItem) => {
    if(call.calls.length === 0) return "--"
    if(call.calls[0].items.length === 0) return "--"
    return dateToInputDate(call.calls[0].items[0].date)
  }

  const getResumeCalLogs = (call: RowCallReportItem) => {
    if(call.calls.length === 0) return
    const ids = []
    const indexAnswer = call.calls.findIndex(call => call._id === 3) 
    if(indexAnswer !== -1) ids.push(...(call.calls[indexAnswer] as any).items.map((item: any) => item._id))
    const indexUnanswer = call.calls.findIndex(call => call._id === 2) 
    if(indexUnanswer !== -1)  ids.push(...(call.calls[indexUnanswer] as any).items.map((item: any) => item._id))
    dispatch(getCallLogByIdWittCallNotesRelatedThunk(ids)) 
  }

  return(
    <ThemeProvider theme={theme}>
         {filter.type === "calls" && callsReport !== undefined && <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Calls</TableCell>
                <TableCell>Reciclar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callsReport.map((call, i) => {
                
                const resumeCalls = getCallsResume({calls: call.calls})         
                return (
                  <TableRow key={i}>
                    <TableCell> {i + 1} </TableCell>
                    <TableCell>{resolveDate(call)}</TableCell>
                    <TableCell>{resolveCustomer(call.customer)}</TableCell>
                    <TableCell>{resolveUser(call.user)}</TableCell>
                    <TableCell>
                    <ButtonGroup>
                        <Button color="secondary"> <AddIcCall/> {resumeCalls.push} </Button>
                        <Button color="success"> <PhoneForwarded/> {resumeCalls.answer} </Button>
                        <Button color="error"> <PhoneMissed/> {resumeCalls.unanswer} </Button>
                        <Button onClick={() => getResumeCalLogs(call)} color="info"> <Visibility/> </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                )}
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </>}
    </ThemeProvider>
  )
}