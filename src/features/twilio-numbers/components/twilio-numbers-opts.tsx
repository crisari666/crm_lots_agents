import { Button, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { displayTwilioFormAct } from "../slice/twilio-numbers.slice";
export default function TwilioNumbersOpts() {
  const dispatch = useAppDispatch()
  const {} = useAppSelector((state) => state.users) 

  const displayTwilioForm = () => dispatch(displayTwilioFormAct(true))
  return (
    <Paper sx={{marginBottom: 2, padding: 2}}>
      <Button onClick={displayTwilioForm} size='small' variant="outlined"> Add Twilio number </Button>
    </Paper>
  )
}