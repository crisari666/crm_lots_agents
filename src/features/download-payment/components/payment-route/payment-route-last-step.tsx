import { Chip, Grid } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import AppTextField from "../../../../app/components/app-textfield"
import { changePercentageMainPartnerAct } from "../../business-logic/download-payment.slice"

export default function PaymentRouteLastStep() {
  const dispatch = useAppDispatch()
  const { paymentRouteCalc } = useAppSelector((state) => state.downloadPayment) 
  const { mainPartner } = paymentRouteCalc
  const { userPercentageData } = mainPartner

  const changeParcentegeMain = (index: number, value: any) => {
    dispatch(changePercentageMainPartnerAct({index, percentage: Number(value)}))
  }
  return (
    <>
      <Grid container sx={{marginTop: 2, borderBottom: '1px solid #ccc', paddingBottom: 1}} spacing={2}>
        <Grid container item xs={6} textAlign={'center'}>
          <Grid item xs={8}>
            <AppTextField 
              onChange={(d) => changeParcentegeMain(0, parseFloat(d.val))}
              startCompontent={'Main 1'} type="number" label="% M1" value={mainPartner.userPercentageData[0].percentage}  inputProps={{step: '0.1', min: 0, max: 100}} 
            />
          </Grid>
          <Grid item xs={4}>
            <Chip  color="success" label={`${Number(userPercentageData[0].value).toFixed(2)}`} sx={{marginBottom: 0.5}} />
          </Grid>
        </Grid>
        <Grid item container xs={6} textAlign={'center'}>
          <Grid item xs={8}>
            <AppTextField 
              onChange={(d) => changeParcentegeMain(1, parseFloat(d.val))}
              startCompontent={'Main 2'} type="number" label="% M2" value={mainPartner.userPercentageData[1].percentage} inputProps={{step: '0.1', min: 0, max: 100}}
            />
          </Grid>
          <Grid item xs={4}>
            <Chip color="success" label={`${Number(userPercentageData[1].value).toFixed(2)}`} sx={{marginBottom: 0.5}}/>

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}