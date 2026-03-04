import { Button, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { CustomerCallActionsInterface } from "../../../../app/models/customer-call-actions.interface";
import { CustomerLogSituationsI } from "../../../../app/models/customer-logs.inteface";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import { SituationInterface } from "../../../../app/models/situation-interface";
import { useAppDispatch } from "../../../../app/hooks";
import { setDialogCheckCallAct, setDialogValidateCallNoteAct } from "../reports.slice";
import { Check, Close, Info } from "@mui/icons-material";

export default function DialogNotesResumeCP({calls, notes} : {notes: CustomerLogSituationsI[], calls: CustomerCallActionsInterface[]}) {
  const dispatch = useAppDispatch() 
  const showDialogValidateCall = (call : CustomerCallActionsInterface) => {
    const image = `uploads/${call.status === 3 ? "answer" : "dont-answer"}/${call.image}`
    dispatch(setDialogCheckCallAct({callId: call._id, check: call.checked, image}))
  }

  const showDialogValidateCallNote = (note : CustomerLogSituationsI) => { 
    const image = `uploads/situations/${note.image}`
    dispatch(setDialogValidateCallNoteAct({situationLogId: note._id!, check: note.checked, image}))
  }
  return(
    <>
      <Grid container>
        <Grid item xs={6}>
          <Typography variant="body1">Calls</Typography>
          {calls.length === 0 && <Typography variant="body1">not found answered call </ Typography>}
          {calls.map((c) => {
            return (<ListItem key={c._id}>
              <ListItemIcon>
                {c.checked === true && <Check/>}
                {(!c.checked && c.checkedDate !== undefined) ? <Close/> : <Info/>}
              </ListItemIcon>
              <ListItemText
                primary={c.date}
                />
              <ListItemButton>
                <Button size="small" variant="outlined" onClick={() => showDialogValidateCall(c)}> Ver </Button>
              </ListItemButton>
              </ListItem>)
            }
          )}
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6" >Notes</Typography>
          {notes.length === 0 && <Typography variant="body1">not found notes </ Typography>}
          {notes.map((n) => {
            let situation: any = n.situation as unknown as SituationInterface[];
            situation = situation.length > 0 ? situation[0].title : [{name: "No situation"}]
            return (<ListItem key={n._id}>
              <ListItemIcon>
                {n.checked === true  ? <Check/> : <Close/>}
                {(!n.dateChecked) && <Info/>}
              </ListItemIcon>
              <ListItemText
                primary={`${dateUTCToFriendly(n.date)} | ${situation}`}
                secondary={n.note}
                />
              <ListItemButton>
                <Button size="small" variant="outlined" onClick={() => showDialogValidateCallNote(n)}> Ver </Button>
              </ListItemButton>
              </ListItem>)
            }
          )}
        </Grid>
      </Grid>
      <></>
    </>
  )
}