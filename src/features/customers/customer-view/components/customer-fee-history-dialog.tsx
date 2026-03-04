import { Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { RootState } from "../../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Close, ImageOutlined } from "@mui/icons-material";
import { clearDialogFeeHistoryAct, setImagePreviewAct } from "../customer-view.slice";
import { dateUTCToFriendly } from "../../../../utils/date.utils";

export default function CustomerFeePaymentHistory() {
  const {feePaymentsHistory} = useAppSelector((state: RootState) => state.customer)
  const dispatch = useAppDispatch()
  return(
    <Dialog open={feePaymentsHistory !== undefined}>
      <IconButton className="closeDialog" onClick={() => dispatch(clearDialogFeeHistoryAct())}> <Close/> </IconButton>
      {feePaymentsHistory !== undefined && <>
        <DialogTitle>Historial de pagos</DialogTitle>
        <DialogContent sx={{minWidth: "600px"}}>
          <List>
            {feePaymentsHistory.feePayment.map((fee) => (
              <ListItem>
                <ListItemText 
                  primary={fee.value} 
                  secondary={dateUTCToFriendly(fee.date)}
                />
                {fee.image !== "" && <ListItemSecondaryAction>
                  <IconButton onClick={() => dispatch(setImagePreviewAct(fee.image))}> <ImageOutlined/> </IconButton>
                </ListItemSecondaryAction>}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </>}
    </Dialog>
  )
}