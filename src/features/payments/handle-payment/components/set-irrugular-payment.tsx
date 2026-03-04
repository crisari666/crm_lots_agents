import { PaymentSingleType } from "../slice/handle-payment.state"
import { useAppDispatch } from "../../../../app/hooks"
import { setPaymentAlertThunk } from "../slice/handle-payment.slice"
import { FormControlLabel, Switch } from "@mui/material"

export default function SetIrregularPayment({payment} : {payment: PaymentSingleType}) {
  const dispatch = useAppDispatch()

  const handleToggleAlert = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await dispatch(setPaymentAlertThunk({paymentId: payment._id, alerted: event.target.checked}))
  }

  return (
    <FormControlLabel
      sx={{marginRight: 2, marginTop: 2}}
      control={
        <Switch
          checked={payment.paymentAlerted}
          onChange={handleToggleAlert}
          color="error"
        />
      }
      label="Pago irregular"
    />
  )
}