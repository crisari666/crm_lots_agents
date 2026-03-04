import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Check } from "@mui/icons-material";
import { hideSuccesFaceAuthDialogAct } from "../log-arrive.slice";

export default function DialogSucessFaceAuth() {
  const dispatch = useAppDispatch() 
  const { successFaceAuth  } = useAppSelector((state) => state.logArrive)
  return (
    <>
      <Dialog open={successFaceAuth}>
        <DialogTitle>
          Registro exitoso
        </DialogTitle>
        <DialogContent>
          Su registro ha sido exitoso <Check color="success"/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(hideSuccesFaceAuthDialogAct())}> ACEPTAR </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}