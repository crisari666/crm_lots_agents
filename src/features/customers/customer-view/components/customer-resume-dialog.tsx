import { Dialog, DialogContent, DialogTitle, IconButton, createTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { ThemeProvider } from "@emotion/react";
import TabHandler from "../../../../app/components/tab-handler";
import { Close } from "@mui/icons-material";
import { closeDialogCustomerResumeAct } from "../customer-view.slice";
import CustomerResumeData from "./customer-resume/customer-data";
import CustomerSituationResume from "./customer-resume/customer-situation-resume";
import CustomerResumePayments from "./customer-resume/customer-payments";
import CustomerAssigned from "./customer-resume/customer-assigned";
import CustomerShutDownHistory from "./customer-resume/customer-shutdown-history";
import CustomerResumeCalls from "./customer-resume/customer-resume-call";
import CustomerCallLogs from "./customer-resume/customer-call-logs";
import CustomerAlerts from "./customer-resume/customer-alerts";


const theme = createTheme({
  components: {
    MuiDialog: {styleOverrides: {paper: {maxWidth: '1000px'}}},
    MuiPaper: {styleOverrides: {root: {maxWidth: '1000px'}}},
  }

})
export default function CustomerResumeDialog() {
  const dispatch = useAppDispatch() 
  const { customerResume } = useAppSelector((state) => state.customer)

  const closeDialog = () => dispatch(closeDialogCustomerResumeAct())
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeDialog()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog 
        open={customerResume !== undefined} 
        onKeyDown={handleKeyDown}
        onClose={() => {}} // Prevent closing on backdrop click
      >
        <IconButton className="closeDialog" onClick={closeDialog}> <Close /> </IconButton>
        <DialogTitle>Resumen cliente</DialogTitle>
        <DialogContent sx={{width: '1000px'}}>
          {customerResume !== undefined && <>
            <TabHandler
              tabNames={['Datos', 'Calls', 'Call Logs', 'Situaciones', 'Pagos', 'Asignado', 'Baja', 'Alertas']}
              tabComponents={[
                <CustomerResumeData customerResume={customerResume} />,
                <CustomerResumeCalls  />,
                <CustomerCallLogs callLogs={customerResume.customer.length > 0 ? (customerResume.customer[0].calls_logs || []) : []} />,              
                <CustomerSituationResume situations={customerResume.situations}/>,
                <CustomerResumePayments payments={customerResume.payments}/>,
                <CustomerAssigned assigneds={customerResume.customer.length > 0 ? customerResume.customer[0].historicalAssignations : []}/>,
                <CustomerShutDownHistory history={customerResume.customer.length > 0 ? customerResume.customer[0].historicalDisables : []} />,
                <CustomerAlerts customerResume={customerResume} />,
              ]}
            />

          </>}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}