import { Button, Card, Divider, List, ListItem, ListItemText } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CloudOff, RotateLeft } from "@mui/icons-material";
import * as io from "socket.io-client"
import { setSureHardOffAct } from "../events-gateway.slice";
import DialogSureTurnOff from "./dialog-sure-turn-off";

export default function ActionsEventGateway() {
  const dispatch = useAppDispatch()
  const {socket} = useAppSelector((state) => state.eventsGateway)
  const reload = () => {
    (socket as io.Socket).emit("reload")
  }

  return (
    <>
      <DialogSureTurnOff/>
      <Card>
        {socket !== undefined && <>

          <List>
            <ListItem sx={{marginBottom: 1}} secondaryAction={<Button variant="outlined" size="small" onClick={reload}> <RotateLeft fontSize="small"/> </Button>}>
              <ListItemText> Recargar </ListItemText>
            </ListItem>
            <Divider/>
            <ListItem secondaryAction={<Button variant="outlined" size="small" onClick={() => dispatch(setSureHardOffAct(true))}> <CloudOff fontSize="small"/> </Button>}>
              <ListItemText> Hard Off </ListItemText>
            </ListItem>
          </List>
        </>}
      </Card>
    </>
  )
}