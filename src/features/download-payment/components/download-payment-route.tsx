import { Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { MonetizationOn, Search } from "@mui/icons-material";
import AppTextField from "../../../app/components/app-textfield";
import PaymentRouteStep from "./payment-route-step";
import { TypePercentageEnum } from "../../user-percentage/slice/users-percentage.state";
import { useEffect } from "react";
import { calculateRoutePercentagesAct, downloadPaymentThunk } from "../business-logic/download-payment.slice";
import PaymentRouteTotalCopInput from "./payment-route/payment-route-step-total-cop";
import PaymentRouteUSDPrice from "./payment-route/payment-router-usd-price";
import { purple } from "@mui/material/colors";
import PaymentRouteLastStep from "./payment-route/payment-route-last-step";
import { pushAlertAction } from "../../dashboard/dashboard.slice";
export default function DownloadPaymentRoute() {
  const dispatch = useAppDispatch()
  const { pickedPayment, paymentRouteCalc, recalculate, } = useAppSelector((state) => state.downloadPayment) 

  useEffect(() => {
    dispatch(calculateRoutePercentagesAct())
  }, [recalculate, dispatch])

  const onDownload = () => {
    const {collector, copTotal, mainPartner, usdPrice, worker, leadWorker} = paymentRouteCalc
    console.log({collector, copTotal, mainPartner, usdPrice, worker, leadWorker});
    
    
    if(collector.percentage > 0 && Number(copTotal) > 0 && Number(usdPrice) > 0 && worker.value > 0
      && ((leadWorker.value === 0  || (leadWorker.value && leadWorker.user !== "")) && mainPartner.userPercentageData.length === 2)
  ) {
      const { userPercentageData } = mainPartner
      const [m1, m2] = userPercentageData
      console.log({m1, m2});
      const mTotalPercentage = m1.percentage + m2.percentage;
      console.log({mTotalPercentage});
      if(mTotalPercentage !== 100) {
        console.log("Error: La suma de los porcentajes de los Main Partners debe ser 100%");
        
        dispatch(pushAlertAction({
          title: "Error",
          message: 'La suma de los porcentajes de los Main Partners debe ser 100%', 
          type: 'error'
        }))
      } else {
        // eslint-disable-next-line no-restricted-globals
        if(confirm('¿Estás seguro de descargar el pago?')){
          dispatch(downloadPaymentThunk({data: paymentRouteCalc, paymentId: pickedPayment!._id}))
        }
      }
    }
  }
  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>
      {pickedPayment === undefined && <Typography variant="h5">Selecciona un pago para descargar. <Search/></Typography>}
      {pickedPayment !== undefined && <>
        <Grid container spacing={1} alignItems={'end '}>
          <Grid item xs={3} className="linePurpleRight">
            <AppTextField startCompontent={<MonetizationOn/>} label="Valor" readonly value={pickedPayment.value}/>
          </Grid>
          <Grid item xs={3} className="linePurpleRight">
            <PaymentRouteStep type={TypePercentageEnum.collector} percentageData={paymentRouteCalc.collector} enable={pickedPayment.value > 0}/>
          </Grid>
          <Grid item xs={3} className="linePurpleRight">
            <PaymentRouteTotalCopInput />
          </Grid>
          <Grid item xs={3}>
            <PaymentRouteUSDPrice />
          </Grid>
        </Grid>
        <Divider sx={{marginY: 1, borderColor: purple[100]}}  />
        <Grid container spacing={1} alignItems={'end'}>
          <Grid item xs={3} className="linePurpleRight">
            <PaymentRouteStep type={TypePercentageEnum.worker} percentageData={paymentRouteCalc.worker} enable={paymentRouteCalc.copTotal > 0}/>
          </Grid>
          <Grid item xs={3} className="linePurpleRight">
            <PaymentRouteStep type={TypePercentageEnum.leadWorker} percentageData={paymentRouteCalc.leadWorker} enable={true}/>
          </Grid>
          <Grid item xs={3} className="linePurpleRight">
            <PaymentRouteStep type={TypePercentageEnum.officeLead} percentagesData={paymentRouteCalc.officeLead} enable={true} isMultiple={true}/>
          </Grid>
          <Grid item xs={3}>
            <PaymentRouteStep type={TypePercentageEnum.subLead} percentagesData={paymentRouteCalc.subLead} enable={true} isMultiple={true}/>
          </Grid>
        </Grid>
        <Divider sx={{marginY: 1, borderColor: purple[100]}}  />
        <Grid container spacing={1} alignItems={'end'}> 
          <Grid item xs={4} className="linePurpleRight">
            <PaymentRouteStep type={TypePercentageEnum.partner} percentagesData={paymentRouteCalc.partner} enable={true} isMultiple={true}/>
          </Grid>
          <Grid item xs={8}>
            <PaymentRouteLastStep />
          </Grid>
          <Grid item xs={12} paddingTop={2}>
            <Button fullWidth color="primary" variant="outlined" size="small" onClick={onDownload} > DESCARGAR PAGO </Button>
          </Grid>
        </Grid>
      </>}
    </Paper>
  )
}