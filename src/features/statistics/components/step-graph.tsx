import { LineChart } from "@mui/x-charts";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Button, Grid, Paper, } from "@mui/material";
import AppSelector from "../../../app/components/app-select";
import { OmegaSoftConstants } from "../../../app/khas-web-constants";
import { useEffect } from "react";
import { getStepsThunk } from "../../steps/steps.slice";
import { Done } from "@mui/icons-material";
import { changeInputStepStatsAct, getStepStatsThunk } from "../store/statistics.slice";
import moment from "moment";
export default function StepsGraph() {
  const dispatch = useAppDispatch()
  const { stepGraphData, formStepStats } = useAppSelector((state) => state.statistics) 
  const { steps } = useAppSelector((state) => state.steps) 
  const { office, period, stepId, userId } = formStepStats

  useEffect(() => {
    dispatch(getStepsThunk())
  }, [])

  useEffect(() => {
    if(steps.length > 0) {
      dispatch(changeInputStepStatsAct({name: 'stepId', val: steps[0]._id}))
      dispatch(getStepStatsThunk({office: "", period: "day", stepId: steps[0]._id, userId: ""}))

    }
  }, [steps])

  const changeInput = ({name, val}: {name: string, val: string}) => {
    dispatch(changeInputStepStatsAct({name, val}))
  }

  const fetchGraphData = () => {
    dispatch(getStepStatsThunk(formStepStats))
  }
  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>  
      <Grid container>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <AppSelector label="Paso" name="stepId" value={stepId} options={steps.map((el) => ({_id: el._id, name: el.title}))} onChange={changeInput} />
            </Grid>
            <Grid item xs={3}>
              <AppSelector label="Periodo" name="period" value={period} options={OmegaSoftConstants.periodGraph} onChange={changeInput} />
            </Grid>
            <Grid item xs={3}>
              <AppSelector label="Oficina" name="office" value={office} options={[]} onChange={changeInput} />
            </Grid>
            <Grid item xs={3}>
              <AppSelector label="Usuario" name="userId" value={userId} options={[]} onChange={changeInput} />
            </Grid>
            <Grid item xs={10} display={'flex'} textAlign={'center'}> 
              <LineChart 
                
                xAxis={[{
                  data: stepGraphData.x,
                  valueFormatter: (d) =>  moment(d).format('DD/MM/YYYY'),
                }]}
                series={
                  [{
                    data: stepGraphData.y,
                    showMark: false,
                  }]
                }
                width={1000}
                height={500}
              />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={fetchGraphData} variant="contained"><Done/> </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}