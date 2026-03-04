import { Paper, Grid, Chip, Typography, Button } from "@mui/material"
import AppTextField from "../../../../app/components/app-textfield"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { numberToCurrency } from "../../../../utils/numbers.utils"
import { changeMainExpensesPercentageAct, changePlatformPercentageAct, changePlatformValueAct, saveCampaignUtilityThunk } from "../../business-logic/download-payment-history.slice"
import { MultiplePercentageType, SinglePercentageData } from "../../business-logic/download-payment.state"
import { pushAlertAction } from "../../../dashboard/dashboard.slice"

export default function PlatformPercentages() {
  const dispatch = useAppDispatch()
  const { mainExpensesPercentage, partnersPercentage, campaignPicked, campaignDownloaded, officesUtility } = useAppSelector((state) => state.downloadPaysHistory) 
  const { main1PlatformPercentage, main2PlatformPercentage, platformUtility, platformPercentage, expensesMain1, expensesMain2, main1, main2, main1WithoutPlatform, main2WithoutPlatform, platformValue, platformPercentageUtility, partnersExpense, main1WithoutPartners } = mainExpensesPercentage


  const saveCampaign = () => {
    const userPercentageData: SinglePercentageData[] = partnersPercentage.map((p) => ({percentage: p.percentage, value: p.value, user: p.user} as SinglePercentageData)) 
    const partners: MultiplePercentageType = {
      before: main1WithoutPlatform,
      after: main1WithoutPartners,
      value: partnersExpense,
      percentage: partnersExpense,
      userPercentageData,
      users: partnersPercentage.map((p) => p.user)  
    }
    
    dispatch(pushAlertAction({
      title: 'Confirmar',
      closeOnAction: true,
      message: 'Despues de guardar no podras modificar los porcentajes de los partners',
      type: 'warning',
      actions: [
        {title: 'Aceptar', action: () => {
          dispatch(saveCampaignUtilityThunk({campaignId: campaignPicked, partners, mainUtility: main1WithoutPartners, platform: platformUtility, negativeValue: officesUtility.negativeValue, utilityLeads: officesUtility.utilityLeads, officesUtility: officesUtility}))}
        }
      ]
    }))
  }
  return (
    <>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={1} marginBottom={2}>
          <Grid item xs={12}>
            <Typography variant="h6" textAlign={'center'}> Porcentaje de gastos </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'center'}>
            <AppTextField 
              type="number"
              value={main1}
              onChange={(e) => dispatch(changeMainExpensesPercentageAct({main1: Number(e.val), main2}))}
              endComponent={<Chip size="small" color="warning" label={`$ ${numberToCurrency(expensesMain1)}`} />}
              />
          </Grid>
          <Grid item xs={6}>
            <AppTextField 
              type="number"
              value={main2}
              onChange={(e) => dispatch(changeMainExpensesPercentageAct({main1, main2: Number(e.val)}))}
              endComponent={<Chip size="small" color="warning" label={`$ ${numberToCurrency(expensesMain2)}`} />}
              //label="M2 % Gastos"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6" textAlign={'center'}>
              Costos Plataforma
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'center'}>
            <AppTextField 
              type="number"
              value={platformValue}
              startCompontent="Costo fijo"
              onChange={(e) => dispatch(changePlatformValueAct(Number(e.val)))}
              endComponent={<Chip size="small" color="warning" label={`$ ${numberToCurrency(platformValue)} +`} />}
              />
          </Grid>
          <Grid item xs={6} textAlign={'center'} alignItems={'end'}>
            <AppTextField 
              type="number"
              startCompontent="%"
              value={platformPercentage}
              onChange={(e) => dispatch(changePlatformPercentageAct(e.val))}
              endComponent={<Chip size="small" color="warning" label={`$ ${numberToCurrency(platformPercentageUtility)}`} />}
              />
          </Grid>
          <Grid item xs={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="body1" textAlign={'center'}>
              Costo: {numberToCurrency(platformUtility)}
            </Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="body1" textAlign={'center'}>
              M1 Plat.: {numberToCurrency(main1PlatformPercentage)}
            </Typography>
          </Grid>
          <Grid item xs={3} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Typography variant="body1" textAlign={'center'}>
              M2 Plat.: {numberToCurrency(main2PlatformPercentage)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" textAlign={'center'}>
              Utilidad Neta M1, M2
            </Typography>
          </Grid>
          <Grid item xs={6} textAlign={'center'}>
            <Typography variant="body1">
              Main 1 Utiidad: <Chip component={'span'} color="success" label={numberToCurrency(main1WithoutPlatform)}/>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body1" textAlign={'center'}>
              Main 2 Utilidad: <Chip component={'span'} color="success" label={numberToCurrency(main2WithoutPlatform)}/>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="secondary" disabled={campaignDownloaded} onClick={saveCampaign}> SAVE </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}