import { Button, Grid, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// import { DateTimePicker } from "@mui/x-date-pickers";
import AppSelector from "../../../app/components/app-select";
import { useEffect, useState } from "react";
// import moment, { Moment } from "moment";
import { Check } from "@mui/icons-material";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { usersGoalsResumeThunk } from "../reports-view/reports.slice";
export default function UsersGoalsFilters() {
  const [office, setOffice] = useState<string>('')  
  // const [dateStart, setDateStart] = useState<Moment>(moment().startOf('day'))
  // const [dateEnd, setDateEnd] = useState<Moment>(moment().endOf('day'))
  const dispatch = useAppDispatch()
  const {offices, gotOffices} = useAppSelector((state) => state.offices) 
  const {loading} = useAppSelector((state) => state.reports) 

  const submit = (e: any) => {
    e.preventDefault()
    dispatch(usersGoalsResumeThunk({office}))
  }

  useEffect(() => {
    if(!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [])
  return (
    <Paper sx={{padding: 2, marginBottom: 2}}>
      <LoadingIndicator open={loading}/>
      <Grid container component={'form'} onSubmit={submit} spacing={2}>
        {/* <Grid item xs={6}>
          <DateTimePicker maxDateTime={dateEnd} label="Fecha inicio" sx={{width: '100%'}} value={dateStart} onChange={(v) => setDateStart(v!) } />
        </Grid>
        <Grid item xs={6}>
          <DateTimePicker minDateTime={dateStart} label="Fecha fin" sx={{width: '100%'}} value={dateEnd} onChange={(v) => setDateEnd(v!) }/>
        </Grid> */}
        <Grid item xs={4}>
          <AppSelector label="Oficina" name="office" value={office} options={offices} onChange={(e) => setOffice(e.val)} />
        </Grid>
        <Grid item xs={3}>
          <Button type="submit"> <Check/> </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}