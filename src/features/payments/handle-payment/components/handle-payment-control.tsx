import { Box, Checkbox, Chip, FormControlLabel, Grid, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import LoadingIndicator from "../../../../app/components/loading-indicator"
import { dateToInputDate, dateUTCToFriendly } from "../../../../utils/date.utils"
import { MonetizationOn } from "@mui/icons-material"
import ChangeUserPayment from "./change-user-payment"
import AnulatePayment from "./anulate-payment"
import { setRetainedPaymentThunk } from "../slice/handle-payment.slice"
import ChangePaymentColector from "./change-colector-payment"
import SetIrregularPayment from "./set-irrugular-payment"
import SetPaymentWaiting from "./set-payment-waiting"

export default function HandlePaymentControl() {
  const dispatch = useAppDispatch()
  const { payment, loading } = useAppSelector((state) => state.handlePayment) 
  return (
    <>
      <LoadingIndicator  open={loading} />
      <Paper sx={{marginBottom: 2, padding: 2}}>
        {payment !== undefined && <>
        {payment.anulated && <Typography variant="h6" color={'error'}>Anulado!!</Typography>}
        {payment.waiting && <Typography variant="h6" color={'warning.main'}>En espera</Typography>}
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h6">{payment.name}</Typography>
              <Typography variant="body1">Fecha creacion: {dateUTCToFriendly(payment.createdAt)}</Typography>
              <Typography variant="body1">Fecha estimada: {dateUTCToFriendly(payment.dateExpected)}</Typography>
              <Typography variant="body1">Value: {payment.valueExpected}</Typography>
              <Typography variant="body1">Pagado: {payment.valuePayed}</Typography>
              <Typography variant="body1">Cliente: {payment.customer.name} / {payment.customer.phone}</Typography>
            </Grid>
            <Grid item xs={6}>
              <ChangeUserPayment payment={payment}/>
              <SetPaymentWaiting payment={payment} />
              <SetIrregularPayment payment={payment} />
              <AnulatePayment payment={payment} />
            </Grid>
          </Grid>
          <Box>
            <List>
              <ListSubheader>
                Pagos
              </ListSubheader>
              <ListItem/>
              {payment.fees.map((fee) => (
                <ListItem key={fee._id}
                  secondaryAction={
                    <Box sx={{minWidth: 400}}>
                      <ChangePaymentColector fee={fee} />
                      <FormControlLabel control={<Checkbox name="paymentAlerted" checked={fee.retained} onChange={(e, checked)=> dispatch(setRetainedPaymentThunk({feePaymentId: fee._id, retained: checked}))} />} label="Retenido" />
                    </Box>
                  }
                  >
                  <ListItemIcon ><MonetizationOn/></ ListItemIcon >
                  <ListItemText primary={
                    <Box display={'flex'}>
                        {dateToInputDate(fee.date)}
                        {fee.retained && <Chip sx={{marginLeft: 1}} label={'Retenido'} color="error" variant="filled" />}
                      </Box>
                    } 
                    secondary={<>
                      {fee.value} 
                    </>} />
                </ListItem>
              ))}
            </List>
          </Box>
        </>}
      </Paper>
    </>
  )
}