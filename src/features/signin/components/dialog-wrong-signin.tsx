import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { toggleWrongCredentials } from "../signin.slice"

export default function DialogWronSignin() {
  const dispatch = useAppDispatch()
  const { wrongCredential } = useAppSelector((state) => state.login)
  return (
    <Dialog open={wrongCredential}>
      <DialogTitle>Datos incorrectos</DialogTitle>
      <DialogContent>
        <Typography variant="body1">Usuario no existe</Typography>
      </DialogContent>
      <DialogActions>
        <Button
          color="info"
          onClick={() => dispatch(toggleWrongCredentials(false))}
        >
          ACEPTAR
        </Button>
      </DialogActions>
    </Dialog>
  )
}
