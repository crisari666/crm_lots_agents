import { Button, createTheme, Grid, Paper } from "@mui/material";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import moment from "moment";
import { dateToInputDate } from "../../../utils/date.utils";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeAuditFormInputAct, getAuditResumeThunk, setCurrentResumeDatesAct } from "../audit-resume.slice";
import AppSelector from "../../../app/components/app-select";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";

export default function AuditResumeFilter() { 
  const dispatch = useAppDispatch()
  const { auditFormFilter, loading } = useAppSelector(state => state.auditResume)
  const { endDate, officeId, startDate, userId } = auditFormFilter
  const { offices, gotOffices } = useAppSelector(state => state.offices)
  const {usersOriginal, gotUsers} = useAppSelector(state => state.users)

  const changeInput = ({ name, val } : {name: string, val: string}) => {
    dispatch(changeAuditFormInputAct({name, val}))
  }

  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
    if(!gotUsers) {
      dispatch(fetchUsersThunk({enable: true}))
    }
  }, [])

  const getData = () => {
    const { endDate, startDate } = auditFormFilter
    dispatch(getAuditResumeThunk(auditFormFilter))
    dispatch(setCurrentResumeDatesAct({startDate, endDate }))
  }

  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>
      <LoadingIndicator open={loading}/>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <AppDateRangeSelector id="reportsRange"
            dateStart={moment(startDate).toDate()}
            dateEnd={moment(endDate).toDate()}
            onChange={({dateEnd, dateStart}) => {
              changeInput({name: "startDate", val: dateToInputDate(dateStart.toISOString())})
              changeInput({name: "endDate", val: dateToInputDate(dateEnd.toISOString())})
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <AppSelector label='Office' name="officeId" options={offices} value={officeId} onChange={changeInput} />
        </Grid>
        <Grid item xs={3}>
          <AppSelector label='User' name="userId" value={userId} options={usersOriginal.filter((u) => u.office && (u.office as any)._id === officeId).map((u) => ({_id: u._id, name: `${u.name}|${u.lastName}`}))} onChange={changeInput} />
        </Grid>
        <Grid item xs={2}>
          <Button variant="outlined" fullWidth onClick={getData}> GET </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}