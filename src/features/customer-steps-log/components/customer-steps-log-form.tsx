import { Button, FormControlLabel, Grid, Paper, Switch } from "@mui/material";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import moment from "moment";
import AppSelector from "../../../app/components/app-select";
import { useEffect } from "react";
import { getStepsThunk } from "../../steps/steps.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { fetchUsersByStepsThunk, updateInputFormUserLogStepAct } from "../customer-steps-log.slice";
import { dateToInputDate } from "../../../utils/date.utils";

export default function CustomerStepsLogForm() {
  const dispatch = useAppDispatch()
  const {formFitler, loading} = useAppSelector(state => state.customerStepsLog)
  const {steps} = useAppSelector(state => state.steps)
  const { dateEnd, dateStart } = formFitler

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])

  const submitForm = () => {
    if(formFitler.step !== '') dispatch(fetchUsersByStepsThunk(formFitler))
  }


  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <AppDateRangeSelector id="customerStepRangeDate" dateEnd={moment(dateEnd).toDate()} dateStart={moment(dateStart).toDate()} key={'date'} onChange={({dateEnd, dateStart}) => {
               dispatch(updateInputFormUserLogStepAct({name: "dateEnd", val: dateToInputDate(dateEnd.toISOString())}))
               dispatch(updateInputFormUserLogStepAct({name: "dateStart", val: dateToInputDate(dateStart.toISOString())}))
            }}  /> 
          </Grid>
          <Grid item xs={3}>
            <AppSelector size="small" value={formFitler.step} options={steps} name="step" label="Step" propOptionName="title" onChange={({name, val}) => {
              dispatch(updateInputFormUserLogStepAct({name, val}))

            }}/>
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel control={<Switch checked={formFitler.excludeDate} onChange={(e, c) => dispatch(updateInputFormUserLogStepAct({name: 'excludeDate', val: c}))}/>} label="Excluir Fecha"   />
          </Grid>
          <Grid item xs={2}>
            <Button fullWidth variant="contained" onClick={submitForm}> GET </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}