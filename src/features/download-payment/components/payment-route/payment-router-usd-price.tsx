import { AttachMoney } from "@mui/icons-material"
import AppTextField from "../../../../app/components/app-textfield"
import { useAppSelector } from "../../../../app/hooks"

export default function PaymentRouteUSDPrice() {
  const { paymentRouteCalc: {usdPrice} } = useAppSelector((state) => state.downloadPayment) 
  return (
    <AppTextField
      disabled readonly
      label="Precio dolar"
      startCompontent={<AttachMoney/>}
      value={Number(usdPrice).toFixed(2)}
    />
  )
}