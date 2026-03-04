import { Box, FormControlLabel, Switch, Typography } from "@mui/material"
import { useAppDispatch } from "../../../../app/hooks"
import { setPaymentWaitingThunk } from "../slice/handle-payment.slice"
import { PaymentSingleType } from "../slice/handle-payment.state"

interface SetPaymentWaitingProps {
  payment: PaymentSingleType
}

export default function SetPaymentWaiting({ payment }: SetPaymentWaitingProps) {
  const dispatch = useAppDispatch()

  const handleWaitingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const waiting = event.target.checked
    dispatch(setPaymentWaitingThunk({ paymentId: payment._id, waiting }))
  }

  return (
    <Box sx={{ marginBottom: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={payment.waiting || false}
            onChange={handleWaitingChange}
            color="warning"
          />
        }
        label={
          <Typography variant="body2" color="text.secondary">
            En espera
          </Typography>
        }
      />
    </Box>
  )
} 