import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { setFeePaymentConfirmPayedDialogAct } from "../reports.slice";
import { Close } from "@mui/icons-material";
import AppTextField from "../../../../app/components/app-textfield";

export default function DialogConfirmPayedFeePayment() {
  const dispatch = useAppDispatch()
  const {confirmFeePaymentPayedDialog} = useAppSelector((state: RootState) => state.reports)
  return (
    <>
      <Dialog  open={confirmFeePaymentPayedDialog !== undefined}>
        <IconButton className="closeDialog" onClick={() => dispatch(setFeePaymentConfirmPayedDialogAct(undefined))}> <Close/> </IconButton> 
        <DialogTitle>Confirmar pagado al cobrador</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AppTextField startCompontent={
                <Typography> Valor: </Typography>
              } value={confirmFeePaymentPayedDialog?.value} disabled={true} readonly/>
            </Grid>
            <Grid item xs={12}>
              <AppTextField startCompontent={
                <Typography> Cobrador: </Typography>
              } value={confirmFeePaymentPayedDialog?.percentage} />
            </Grid>
            <Grid item xs={12}>
              <AppTextField startCompontent={
                <Typography> Recibe: </Typography>
              } value={confirmFeePaymentPayedDialog?.remaining} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="success"> Confirmar </Button>
          <Button variant="outlined" color="error" onClick={() => dispatch(setFeePaymentConfirmPayedDialogAct(undefined))}> Cancelar </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}