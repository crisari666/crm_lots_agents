import { createTheme, IconButton, Paper, TableCell, TableRow } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { TableVirtuosoAuditResume } from "./table-virtuoso-audit-resume";
import { TableVirtuoso } from "react-virtuoso";
import { buildCallLogsResumeAudit, getCallsResumeAudit } from "../../../utils/customer.utils";
import { ThemeProvider } from "@emotion/react";
import { Visibility } from "@mui/icons-material";
import { getUserAuditResumeThunk } from "../audit-resume.slice";

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

export default function AuditResumeTable() {
  const dispatch = useAppDispatch()
  const { auditResume, currentResumeDate } = useAppSelector(state => state.auditResume)

  const { endDate, startDate } = currentResumeDate

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{padding: 1, marginBottom: 1, height: 600}}>
        Results
        <TableVirtuoso
          data={auditResume}
            components={TableVirtuosoAuditResume}
          fixedHeaderContent={() => <TableRow style={{backgroundColor: 'white'}}>
            <TableCell> User </TableCell>
            <TableCell align="center"> RC </TableCell>
            <TableCell align="center"> RNC </TableCell>
            <TableCell align="center"> Notes </TableCell>
            <TableCell align="center"> <Visibility/> </TableCell>
          </TableRow>} 
          itemContent={(index, item) => {
            const call = getCallsResumeAudit(item.calls)
            const log = buildCallLogsResumeAudit(item.callLogs)            
            return(
              <>
                <TableCell sx={{width: 300}}> {item.user[0].name} </TableCell>
                <TableCell align="center" sx={{width: 100}}> {`${call.rc_checked + call.rc_notChecked}/${call.rc_checked}`} </TableCell>
                <TableCell align="center" sx={{width: 100}}> {`${call.rnc_checked + call.rnc_notChecked}/${call.rnc_checked}`} </TableCell>
                <TableCell align="center" > {`${(log.checked + log.not_checked)}/${log.checked}`} </TableCell> 
                <TableCell> <IconButton onClick={() => dispatch(getUserAuditResumeThunk({endDate, startDate, userId: item.user[0]._id}))}> <Visibility/> </IconButton> </TableCell>
              </>
            )
          }}
        />
      </Paper>
    </ThemeProvider>
  )
}