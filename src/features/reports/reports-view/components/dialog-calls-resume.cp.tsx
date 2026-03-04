import { Button, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { CustomerCallActionsInterface } from "../../../../app/models/customer-call-actions.interface";
import { useAppDispatch } from "../../../../app/hooks";
import { setDialogCheckCallAct } from "../reports.slice";

export default function DialgoCallsResumeCP({calls} : {calls: CustomerCallActionsInterface[]}) {
  const dispatch = useAppDispatch()


  const showDialogValidateCall = (call : CustomerCallActionsInterface) => {
    const image = `uploads/${call.status === 3 ? "answer" : "dont-answer"}/${call.image}`
    dispatch(setDialogCheckCallAct({callId: call._id, check: call.checked, image}))
  }
  
  return (
    <>  
      <Typography variant="body1">Unanswered calls</Typography>
    {calls.length === 0 && <Typography variant="body1">not found unanswered notes </ Typography>}
      <List>
        {calls.map((c) => {
          return (<ListItem key={c._id}>
            <ListItemText
              primary={c.date}
            />
            <ListItemButton>
              <Button size="small" variant="outlined" onClick={() => showDialogValidateCall(c)}> Ver </Button>
            </ListItemButton>
          </ListItem>)
        })}
      </List>
    </>
  )
}