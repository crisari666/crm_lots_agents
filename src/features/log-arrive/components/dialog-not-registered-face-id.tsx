import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { closeDialogNotFoundFaceIdAct } from "../log-arrive.slice";

export default function DialogNotRegisteredFaceId() {
  const dispatch = useAppDispatch()
  const { showDialogNotRegisteredFaceId } = useAppSelector((state) => state.logArrive)
  return (
    <>
      <Dialog open={showDialogNotRegisteredFaceId}>
        <DialogTitle> Face ID no creado</DialogTitle>
        <DialogContent>
          <Typography>
            El usuario seleccionado no ha realizado el registro de face id
          </Typography>
          <Typography>
            Ingresa sesion en tu perfil y realiza el registro, si no sabes como hacerlo, contacta a tu administrador
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(closeDialogNotFoundFaceIdAct())}> ACEPTAR </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}