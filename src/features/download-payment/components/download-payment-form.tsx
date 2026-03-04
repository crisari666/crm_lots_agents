import { Button, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { Search } from "@mui/icons-material";
import { findPaymentsThunk, showDialogFindPaymentAct, updateInputFilterPaymentAct } from "../business-logic/download-payment.slice";
import moment from 'moment'
export default function DownloadPaymentForm() {
  const dispatch = useAppDispatch()
  const {pickedPayment, filterPaymentForm} = useAppSelector((state) => state.downloadPayment) 

  const showDialogFindPayment = () => {
    const { office, userId } = filterPaymentForm
    
    if(office !== "" || userId !== '') {
      const dateInit = moment().subtract(14,'days').format("YYYY-MM-DD")
      const dateEnd = moment().endOf('day').format("YYYY-MM-DD")
      dispatch(updateInputFilterPaymentAct({key: "dateInit", value: dateInit}))
      dispatch(updateInputFilterPaymentAct({key: "dateEnd", value: dateEnd}))
      
      dispatch(findPaymentsThunk({
        office, userId, 
        dateInit, 
        dateEnd,
        collector: "", downloaded: false
      }))
    }
    dispatch(showDialogFindPaymentAct(true))
  }
  return (
    <Paper sx={{padding: 1, marginBottom: 1}}>
      <Grid container>
        <Grid item xs={12}>
          <AppTextField 
            label="Pago" readonly
            value={pickedPayment !== undefined ? `[C:${pickedPayment.customer.name}] [$:${pickedPayment.value}] [U:${pickedPayment.paymentRequest.user.lastName} ${pickedPayment.paymentRequest.user.email}]` : ""}
            startCompontent={<Typography>Pago:</Typography>}
            endComponent={<Button size="small" color="secondary" onClick={showDialogFindPayment} variant="outlined"> <Search/> </Button>}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}