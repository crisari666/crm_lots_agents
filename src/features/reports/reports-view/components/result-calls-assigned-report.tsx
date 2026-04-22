import { Box, Button, ButtonGroup, createTheme, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { getCallsResume } from "../../../../utils/customer.utils"
import { AddIcCall, CrisisAlert, PhoneForwarded, PhoneMissed, Recycling, SimCardAlert, TimerOff, Visibility, Warning, WarningAmber } from "@mui/icons-material"
import { ThemeProvider } from "@emotion/react"
import { Call, RowCallAssignedCustomer } from "../../reports.state"
import { dateUTCToFriendly } from "../../../../utils/date.utils"
import { getCallLogByIdWittCallNotesRelatedThunk, logCustomerAtNotCalledThunk, recycleCustomerThunk } from "../reports.slice"
import { useState } from "react"
import CustomerAlertsDialog, { CustomerAlertsDialogCustomer } from "./customer-alerts-dialog"

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
export default function ResultCallAssignedReports() {
  const dispatch = useAppDispatch() 
  const {filter, callAssignedCustomer} = useAppSelector((state: RootState) => state.reports)
  const [alertsDialogCustomer, setAlertsDialogCustomer] = useState<CustomerAlertsDialogCustomer | null>(null)

  const resolveUser = (user: any): string => {
    if(user.length === 0) return ""
    return `${user[0].name}`
  }

  const getResumeCalLogs = (call: RowCallAssignedCustomer) => {
    console.log({call});
    
    if(call.calls.length === 0) return
    const ids = []
    const indexAnswer = call.calls.findIndex(call => call._id === 3) 
    if(indexAnswer !== -1) ids.push(...(call.calls[indexAnswer] as any).items.map((item: any) => item._id))
    const indexUnanswer = call.calls.findIndex(call => call._id === 2) 
    if(indexUnanswer !== -1)  ids.push(...(call.calls[indexUnanswer] as any).items.map((item: any) => item._id))
    console.log({ids});
    
    dispatch(getCallLogByIdWittCallNotesRelatedThunk(ids))
  }

  const recycleCustomer = (customerId: string, index: number) => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm("¿Está seguro de reciclar este cliente?")) {
      dispatch(recycleCustomerThunk({customerId, typeReport: "call-customers-assigned", index}))
    }
  }

  const logCustomerAtNotCalled = ({row, index} : {row: RowCallAssignedCustomer, index: number}) => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm('¿Está seguro de loguear este cliente como no llamado?')) {
      dispatch(logCustomerAtNotCalledThunk({
        customer: row._id,
        dateAssigned: row.dateAssigned,
        index,
        userId: row.user[0]._id
      }))
    }
  }

  const getFirstCallItemDate = (calls: Call[]): string | null => {
    if(calls.length === 0) return null
    const allItems = []
    for(const call of calls) {
      if(call._id > 1) allItems.push(...call.items)
    }
    if(allItems.length === 0) return null
    return allItems.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date
  }


  return(
    <ThemeProvider theme={theme}>
         {filter.type === "call-customers-assigned" && callAssignedCustomer !== undefined && <>
        <CustomerAlertsDialog
          open={alertsDialogCustomer !== null}
          onClose={() => setAlertsDialogCustomer(null)}
          customer={alertsDialogCustomer}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>N</TableCell>
                <TableCell>Alert</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell> <TimerOff/> </TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Call</TableCell>
                <TableCell>Acciones</TableCell>
                <TableCell>Reciclar</TableCell>
                <TableCell> <SimCardAlert/> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {callAssignedCustomer.map((row, i) => {
                const resumeCalls = getCallsResume({calls: row.calls})         
                const actionCalls = resumeCalls.push + resumeCalls.answer + resumeCalls.unanswer
                const firstCallItemDate = getFirstCallItemDate(row.calls)
                const diferenceTimeToAssignedAndCalledInMinutes = firstCallItemDate ? Number(((new Date(firstCallItemDate).getTime() - new Date(row.dateAssigned).getTime()) / (1000 * 60)).toFixed(0)) : null

                
                
                //If row was assigned before 12:00 the had 3 hours to call, if was assigned after 12:00 the had 30 minutes to call
                const hourAssigned = new Date(row.dateAssigned).getUTCHours()
                const before2pm = hourAssigned < 14
                
                //Called in time should be true if row was assigned before 2 pm the user has until 3pm to call and if was assigned after 2pm the user has 1 hour to call
                let calledInTime = false

                if(before2pm && firstCallItemDate && new Date(firstCallItemDate).getHours() < 15) {
                  //console.log("before2pm");
                  calledInTime = true
                } else if(!before2pm && diferenceTimeToAssignedAndCalledInMinutes && diferenceTimeToAssignedAndCalledInMinutes < 60) {
                  //console.log("after2pm");
                  calledInTime = true
                }
                return (
                  <TableRow key={i}>
                    <TableCell> {i + 1} </TableCell>
                    <TableCell>
                        <Tooltip title="Ver alertas del cliente">
                          <IconButton
                            size="small"
                            onClick={() => setAlertsDialogCustomer({ _id: row._id, name: row.name, isProspect: row.isProspect })}
                            color="primary"
                            sx={{ padding: "2px" }}
                            >
                            <WarningAmber fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    </TableCell>
                    <TableCell>{dateUTCToFriendly(row.dateAssigned)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography component="span">{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{paddingRight: 1}}> 
                      {!firstCallItemDate ? <Typography variant="caption" noWrap><CrisisAlert color="error"/> Sin llamar </Typography>: null} 
                      <Typography variant="caption" noWrap>
                        {!calledInTime && Boolean(firstCallItemDate) ? <><Warning color="warning"/> Plazo expirado <br /></>  : null} 
                        [{dateUTCToFriendly(firstCallItemDate!).split(' ')[1]}]{diferenceTimeToAssignedAndCalledInMinutes ?<>{`[${diferenceTimeToAssignedAndCalledInMinutes}`} mins]</> : null}
                      </Typography>

                    </TableCell>
                    <TableCell>{resolveUser(row.user)}</TableCell>
                    <TableCell>
                      <ButtonGroup>
                          <Button size="small" color="secondary"> <AddIcCall/> {resumeCalls.push} </Button>
                          <Button size="small" color="success"> <PhoneForwarded/> {resumeCalls.answer} </Button>
                          <Button size="small" color="error"> <PhoneMissed/> {resumeCalls.unanswer} </Button>
                          <Button size="small" onClick={() => getResumeCalLogs(row)} color="info"> <Visibility/> </Button>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell>
                      AC: {actionCalls} <br/>
                    </TableCell>
                    <TableCell>

                      <Button onClick={() => recycleCustomer(row._id, i)} disabled={row.recycle === true} size="small" variant="outlined" color="secondary"> <Recycling /> </Button>
                    </TableCell>
                    <TableCell>
                      <Button disabled={row.notCalled} onClick={() => logCustomerAtNotCalled({row, index: i })} variant="outlined"> <SimCardAlert/> </Button>
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