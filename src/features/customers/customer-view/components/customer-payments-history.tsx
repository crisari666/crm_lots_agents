import { IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { CurrencyExchange, PriceCheck } from "@mui/icons-material"
import { dateUTCToFriendly } from "../../../../utils/date.utils"
import { loadAddFeeDilaogAct, setFeeHistoryDialogAct } from "../customer-view.slice"
import { FeeInterface } from "../../../../app/models/fee.interface"

export default function CustomerPaymentsHistory()  {
  const {customerPayments, customerData} = useAppSelector((state: RootState) => state.customer)
  const dispatch = useAppDispatch()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  return (
    <>
      <Typography>Historial Pagos</Typography>
      <List>
        {customerPayments.map((payment, index) => (
          <ListItem key={`payment${payment._id}`}
            secondaryAction={
              <>
                <IconButton color="primary" onClick={() => dispatch(loadAddFeeDilaogAct({customer: customerData!._id, paymentRequest: payment._id, value: 0, collector:''}))}> <CurrencyExchange/> </IconButton>
              </>
            }
          >
            <ListItemAvatar>
              <IconButton color="secondary" disabled={payment.fees.length === 0} onClick={() => dispatch(setFeeHistoryDialogAct(payment.fees as FeeInterface[]))}>
                <PriceCheck />
              </IconButton>
            </ListItemAvatar>
            
            <ListItemText
              sx={{cursor: 'pointer'}}
              onClick={() => copyToClipboard(payment._id)}
              primary={`Pago ${index + 1} | ${dateUTCToFriendly(payment.dateExpected, true)} || ${payment.step?.title ?? "Paso no definido"}`}
              secondary={`Estimado: ${payment.valueExpected} - Pagado: ${payment.valuePayed}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  )
}