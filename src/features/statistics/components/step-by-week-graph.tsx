import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useEffect, useState } from "react";
import { dateToInputDate, getCurrenDateUtil } from "../../../utils/date.utils";
import moment from "moment";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import AppSelector from "../../../app/components/app-select";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { stepByWeeksGraphThunk } from "../store/statistics.slice";
import { Check } from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import { getStepsThunk } from "../../steps/steps.slice";
export default function StepsByWeekGraph() {
  const [office, setOffice] = useState<string>('')  
  const [dateStart, setDateStart] = useState<string>(getCurrenDateUtil())
  const [dateEnd, setDateEnd] = useState<string>(getCurrenDateUtil())
  const [step, setStep] = useState<string>('')
  const dispatch = useAppDispatch()
  const {offices, gotOffices} = useAppSelector((state) => state.offices) 
  const {steps} = useAppSelector((state) => state.steps) 
  const {stepsByWeeksGraph, groupsStepwByWeekGraph} = useAppSelector((state) => state.statistics) 

  const loadGraph = (e: any) => {
    e.preventDefault()
    dispatch(stepByWeeksGraphThunk({startDate: dateStart, endDate: dateEnd, office, step}))
  }

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])

  useEffect(() => {
    if(gotOffices === false) {
      dispatch(getOfficesThunk())
    }
  }, [gotOffices, dispatch])

  const buildSeries = (): any[] => {
    const series = []
    for (const office of offices) {
      if(office.enable === true && office.name?.toLowerCase() !== 'oficina 1') series.push({dataKey: office._id, label: office.name})
    }    
    return series
  }
  return (
    <Paper sx={{padding: 2}}>
      <Grid container component={'form'} spacing={1} onSubmit={loadGraph}>
        <Grid item xs={3}>
          <AppDateRangeSelector 
          id="customerStepRangeDate" 
          dateEnd={moment(dateEnd).toDate()} dateStart={moment(dateStart).toDate()} key={'date'} 
          onChange={({dateEnd, dateStart}) => {
            setDateStart(dateToInputDate(dateStart.toISOString()))
            setDateEnd(dateToInputDate(dateEnd.toISOString()))
          }}  /> 
        </Grid>
        <Grid item xs={3}>
          <AppSelector required label="Paso" name="step" value={step} propOptionName="title" options={steps} onChange={(e) => setStep(e.val)} />
        </Grid>
        <Grid item xs={3}>
          <AppSelector label="Oficina" name="office" value={office} options={offices} onChange={(e) => setOffice(e.val)} />
        </Grid>
        <Grid item xs={3}>
          <Button type="submit"> <Check/> </Button>
        </Grid>
      </Grid>
      <Box>
      <BarChart
        xAxis={[{ scaleType: 'band', data: groupsStepwByWeekGraph }]}
        margin={{ top: 100}}
        dataset={stepsByWeeksGraph}
        series={buildSeries()}
        width={1000}
        height={500}
        />
      </Box>
        <Box>
         
         {stepsByWeeksGraph.length > 0 && <Typography variant="h6">
           Total: {Object.values(stepsByWeeksGraph[0]).map((value: any) => value).reduce((acc, curr) => acc + curr, 0)}
         </Typography>}
        </Box> 
    </Paper>
  )
}