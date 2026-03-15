import { Dialog, DialogContent, DialogTitle } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { showDialogPickPercentageAct } from "../slice/pay-route-template.slice"

export default function PaymentRouteDialogPickPercentage() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((state) => state.paymentRouteTemplate?.showDialogPickPercentage ?? false)
  const onClose = () => dispatch(showDialogPickPercentageAct(false))

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Seleccionar porcentaje</DialogTitle>
      <DialogContent />
    </Dialog>
  )
}
