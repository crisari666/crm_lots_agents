import { Box, Button, Chip, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import AppTextField from "../../../../app/components/app-textfield";
import { changePercentageSinglePartnersAct, showModalAddPatrnerPercentageAct } from "../../business-logic/download-payment-history.slice";
import { numberToCurrency } from "../../../../utils/numbers.utils";

export default function PartnersMain1List() {
  const dispatch = useAppDispatch()
  const { partnersPercentage, mainExpensesPercentage: {partnersExpense, main1WithoutPartners} } = useAppSelector((state) => state.downloadPaysHistory) 
  const showModal = () => dispatch(showModalAddPatrnerPercentageAct(true))

  
  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>
      <Typography variant="h5" width={'100%'} textAlign={'center'} marginY={1}>Partners</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {partnersPercentage.map((p,index) =>
            <Box marginBottom={1} key={`${index}mainPartnerP`}>
              <AppTextField
                type="number"
                inputProps={{step: 1, min: 0}}
                startCompontent={p.userNick}
                endComponent={`$ ${numberToCurrency(p.value)}`}
                value={p.percentage}
                onChange={(e) => dispatch(changePercentageSinglePartnersAct({index, percentage: e.val}))}
              />
            </Box>
          )}
          <Grid container>
            <Grid item xs={6}>
              <Button fullWidth color="primary" variant="outlined"  onClick={showModal}> ADD PARTNER </Button>
            </Grid>
            <Grid item xs={6} textAlign={'center'}>
              <Chip color="success"  label={`$ ${numberToCurrency(partnersExpense)}`} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} display={'flex'} justifyContent={'center'} alignItems={'center'}>   
            <Typography variant="h6">
              Main 1 Utility: <strong>${numberToCurrency(main1WithoutPartners)}</strong> 
            </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}