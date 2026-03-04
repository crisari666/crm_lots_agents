import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close } from "@mui/icons-material";
import * as io from "socket.io-client"
import { setSureHardOffAct } from "../events-gateway.slice";

export default function DialogSureTurnOff() {
  const {showSureHardOff} = useAppSelector((state) => state.eventsGateway)
  const {socket} = useAppSelector((state) => state.eventsGateway)
  const dispatch = useAppDispatch()
  const hardOff = () => {
    (socket as io.Socket).emit("hardOff") 
  }
  const closeDialog = () => dispatch(setSureHardOffAct(false))
  return (
    <Dialog open={showSureHardOff}>
      <IconButton className="closeDialog" > <Close/> </IconButton>
      <DialogTitle>Confirmar</DialogTitle>
      <DialogContent>
        Estas seguro que deseas apagar el sistema?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={closeDialog} color="error" size="small"> CANCELTAR</Button>
        <Button variant="outlined" onClick={hardOff} size="small"> ACEPTAR </Button>
      </DialogActions>
    </Dialog>
  )
}