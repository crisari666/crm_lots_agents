import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Grid, Button, IconButton } from "@mui/material";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Done, Person, Visibility } from "@mui/icons-material";
import { useEffect } from "react";
import { changeDateRangeAct, getLeadResumeDetailThunk, getTotalPendingsChecksThunk } from "../leads-auditory.slice";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import { dateToInputDate } from "../../../utils/date.utils";
import LeadResumeDialog from "./lead-resume-dialog";

export default function LeadsAuditoryTable() {
  const { loading, rows, filterDate } = useAppSelector(state => state.leadsAuditory)
  const { endDate, startDate } = filterDate
  const dispatch = useAppDispatch()
  useEffect(() => {
    filterData()
  }, [])

  const filterData = () => {
    dispatch(getTotalPendingsChecksThunk({endDate: dateToInputDate(endDate.toISOString()), startDate: dateToInputDate(startDate.toISOString())}))
  }
  return(
    <>
      <LoadingIndicator open={loading}/>
      <LeadResumeDialog/>
      <Paper sx={{padding: 1}}>
        <Grid container spacing={1}>
          <Grid item xs={10} md={4}>
            <AppDateRangeSelector id="leadRangeDateAuditory" dateStart={startDate} dateEnd={endDate} onChange={({dateEnd, dateStart}) => dispatch(changeDateRangeAct({startDate: dateStart, endDate: dateEnd}))} />
          </Grid>
          <Grid item xs={2} md={1}>
            <Button size="small" variant="outlined" onClick={filterData}><Done/> </Button>
          </Grid>
        </Grid>
        <TableContainer>
          <Table stickyHeader padding="checkbox">
            <TableHead>
              <TableRow>
                <TableCell align="center"> Level </TableCell>
                <TableCell align="center"> <Person/> </TableCell>
                <TableCell align="center"> Situations </TableCell>
                <TableCell align="center"> Payments </TableCell>
                <TableCell align="center"> <Visibility/> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id._id}>
                  <TableCell>{row._id.level === 2 ? "LEAD" : "SUB LEAD"}</TableCell>
                  <TableCell>{row._id.name}</TableCell>
                  <TableCell align="center">{row.situations.length > 0 ? row.situations[0].total : 0}</TableCell>
                  <TableCell align="center">{row.payments.length > 0 ? row.payments[0].total : 0}</TableCell>
                  <TableCell> 
                    <Button size="small" variant="outlined"  
                      onClick={() => dispatch(getLeadResumeDetailThunk({leadId: row._id._id, dateEnd: dateToInputDate(endDate.toISOString()), dateStart: dateToInputDate(startDate.toISOString())}))}
                    > <Visibility/> </Button> 
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}