import { Button } from "@mui/material"
import { useAppDispatch } from "../../../../app/hooks"
import { PaymentSingleType } from "../slice/handle-payment.state"
import { anulatePaymentThunk } from "../slice/handle-payment.slice"

export default function AnulatePayment({payment} : {payment: PaymentSingleType}) {
  const dispatch = useAppDispatch()
  

  const anulatePayment = () => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Estas seguro que desear anular el pago?")) {
      dispatch(anulatePaymentThunk(payment._id))
    }
  }
  return (
    <>
      <Button sx={{marginTop: 2}} color="error" variant="outlined" onClick={anulatePayment} disabled={payment.anulated}> ANULAR </Button>
    </>
  )
}