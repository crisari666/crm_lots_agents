import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { Close } from "@mui/icons-material";
import { disableCustomerThunk, showDialogSureDisableCustomerAct } from "../customer-view.slice";
import AppTextField from "../../../../app/components/app-textfield";
import { useState } from "react";

export default function DialogSureDisableCustomer() {
  const {customerData, showDialogSureDisableCustomer} = useAppSelector((state) => state.customer)
  const [motive, setMotive] = useState('' as string)

  const dispatch = useAppDispatch()
  const closeDialog = () => dispatch(showDialogSureDisableCustomerAct(false))
  return(
    <Dialog open={showDialogSureDisableCustomer} >
      <IconButton className="closeDialog" onClick={closeDialog}> <Close/> </IconButton>
      <DialogTitle>CONFIRMAR</DialogTitle>
      <DialogContent>
        ¿Está seguro de que desea dar de baja al cliente {customerData?.name}?
        <Box marginTop={2}>
          <AppTextField name='motive' value={motive} label="Motivo baja" onChange={(data) => setMotive(data.val)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => {
          if(motive.length > 10) {
            closeDialog()
            dispatch(disableCustomerThunk({customerId: customerData!._id, motive}))
          } else {
            alert('El motivo debe tener al menos 10 caracteres')
          }
        }}> DAR DE BAJA </Button>
        <Button color="primary" onClick={closeDialog}> CANCELAR </Button>
      </DialogActions>
    </Dialog>
  )
}