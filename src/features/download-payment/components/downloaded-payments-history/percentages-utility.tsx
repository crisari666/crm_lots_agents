import { Grid, Paper, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { useEffect } from "react"
import { calculateExpensesPercentageAct } from "../../business-logic/download-payment-history.slice"

export default function PercentageUtility() {
  const dispatch = useAppDispatch()
  const { totalExpenses, totalUtility, mainExpensesPercentage, calculateExpenses, officesUtility } = useAppSelector((state) => state.downloadPaysHistory) 
  const { main1leastExpenses, main2leastExpenses, utilityLeastExpenses } = mainExpensesPercentage

  useEffect(() => {
    dispatch(calculateExpensesPercentageAct())
  }, [calculateExpenses])


  return (
    <>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container>
          <Grid item xs={4} textAlign={'center'}>
            <Typography variant="body1">
              Total Gastos: {numberToCurrency(totalExpenses)}
            </Typography>
          </Grid>
          <Grid item xs={4} textAlign={'center'}>
            <Typography variant="body1">
              Utilidad Lideres: {numberToCurrency(officesUtility.utilityLeads)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign={'center'}>
              Total Utilidad: {numberToCurrency(totalUtility)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container>
          <Grid item xs={4} textAlign={'center'}>
            <Typography variant="body1">
              Main 1 Utiidad: {numberToCurrency(main1leastExpenses)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign={'center'}>
              Main 2 Utilidad: {numberToCurrency(main2leastExpenses)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body1" textAlign={'center'}>
              Total (Utilidad - Gastos - Utilidad Lideres): {numberToCurrency(utilityLeastExpenses)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}