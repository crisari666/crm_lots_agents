import { Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close, History, Visibility } from "@mui/icons-material";
import { buildCallLogsResumeAudit, getCallsResumeAudit } from "../../../utils/customer.utils";
import { closeDialogUserAuditResumeAct } from "../audit-resume.slice";
import { ThemeProvider } from "@emotion/react";
import { themeCondense } from "../../../app/themes/theme-condense";
import { getCustomerCallActionsThunk } from "../../customers/customers-list/customers.slice";
import { getCustomerResumeThunk } from "../../customers/customer-view/customer-view.slice";

export default function AuditUserResumeDialog() {
  const dispatch = useAppDispatch
  ()
  const { auditUserResume } = useAppSelector((state) => state.auditResume)

  const closeDialog = () => {
    dispatch(closeDialogUserAuditResumeAct())
  }
  return (
    <>
      <ThemeProvider theme={themeCondense}>
        <Dialog open={auditUserResume !== undefined}>
          <DialogTitle> Resumen auditoria usuario  </DialogTitle>
          <IconButton onClick={closeDialog} className="closeDialog"> <Close/> </IconButton>
          {auditUserResume !== undefined && <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell align="center">RC</TableCell>
                    <TableCell align="center">RNC</TableCell>
                    <TableCell align="center">Notes</TableCell>
                    <TableCell align="center">Calls</TableCell>
                    <TableCell align="center">Resume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditUserResume.map((item) => {
                    const call = getCallsResumeAudit(item.calls)
                    const log = buildCallLogsResumeAudit(item.callNotes)            
                    return (<TableRow key={`${item._id}`}>
                        <TableCell>{item.customer[0].name}</TableCell>
                        <TableCell align="center" sx={{width: 100}}> {`${call.rc_checked + call.rc_notChecked}/${call.rc_checked}`} </TableCell>
                        <TableCell align="center" sx={{width: 100}}> {`${call.rnc_checked + call.rnc_notChecked}/${call.rnc_checked}`} </TableCell>
                        <TableCell align="center" > {`${(log.checked + log.not_checked)}/${log.checked}`} </TableCell> 
                        <TableCell align="center" > <IconButton onClick={() =>  dispatch(getCustomerCallActionsThunk({customerId: item._id}))}> <History/> </IconButton> </TableCell> 
                        <TableCell align="center" > <IconButton onClick={() =>  dispatch(getCustomerResumeThunk(item._id))}> <Visibility/> </IconButton> </TableCell> 
                    </TableRow>)
                  } 
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>}
        </Dialog>
      </ThemeProvider>
    </>
  )
}