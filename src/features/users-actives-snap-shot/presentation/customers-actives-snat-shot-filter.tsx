import { Button, Grid, Paper } from "@mui/material";
import DateSelector from "../../../app/components/date-selector";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeDateFilterValAct, fetchSnapShotCustomersActivesByDateThunk } from "../business-logic/customers-actives-snap-shot.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { ThemeProvider } from "@emotion/react";
import { themeCondense } from "../../../app/themes/theme-condense";

export default function CustomersActivesSnapShotFilter() {
  const dispatch = useAppDispatch()  
  const { filterDate, loading } = useAppSelector((state) => state.customerActivesSnapShot)

  const submitForm = (e:any) => {
    e.preventDefault()
    console.log('9999');
    
    dispatch(fetchSnapShotCustomersActivesByDateThunk(filterDate))
  }
  return(
    <ThemeProvider theme={themeCondense}>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 2, marginBottom: 1}}>
        <Grid container alignItems={'center'} spacing={1} component={'form'} onSubmit={submitForm}>
          <Grid item xs={12} md={6}>
            <DateSelector value={filterDate} onChange={(date) => dispatch(changeDateFilterValAct(date))} fullwidth/>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button type="submit" variant="contained" fullWidth color="primary"> GET </Button>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  )
}