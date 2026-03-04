import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { confirImageFeePaymentThunk, setFeePaymentConfirmImageDialogAct } from "../reports.slice";
import { d } from "vitest/dist/types-e3c9754d.js";

export default function DialogConfirmImageFeePayment() {
  const dispatch = useAppDispatch()
  const {confirFeePaymentImageDialog} = useAppSelector((state: RootState) => state.reports)
  

  return (
    <>
      <Dialog open={confirFeePaymentImageDialog !== undefined}>
        <IconButton className="closeDialog" onClick={() => dispatch(setFeePaymentConfirmImageDialogAct(undefined))}> <Close/> </IconButton>
        <DialogTitle>Confirmar imagen de Pago</DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            Esta seguro que desea confirmar la imagen de pago?
          </Typography>
          <Typography>Valor: {confirFeePaymentImageDialog?.value  }</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="success"
            onClick={() => dispatch(confirImageFeePaymentThunk({index: confirFeePaymentImageDialog?.index as number, feePaymentId: confirFeePaymentImageDialog?.feePaymentId as string}))}
          >Confirmar</Button>
          <Button variant="outlined" color="error" onClick={() => dispatch(setFeePaymentConfirmImageDialogAct(undefined))}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}