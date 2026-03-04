import { AttachMoney } from "@mui/icons-material";
import AppTextField from "../../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeCopTotalValueAct } from "../../business-logic/download-payment.slice";
export default function PaymentRouteTotalCopInput() {
  const dispatch = useAppDispatch()
  const { paymentRouteCalc: {copTotal, collector} } = useAppSelector((state) => state.downloadPayment) 
  return (
    <>
      <AppTextField 
        disabled={collector.user === undefined || collector.after === 0}
        readonly={collector.user === undefined || collector.after === 0}
        startCompontent={<AttachMoney/>}
        inputProps={{min: 0, step: 1}}
        onChange={(d) => dispatch(changeCopTotalValueAct(d.val))}
        type="number" label="Total COP"
        value={copTotal}
      />
    </>
  )
}