import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeUserToRelToNumberAct, displayRelUserToNumberFormAct, relUserToTwilioNumberThunk } from "../slice/twilio-numbers.slice";
import AppTextField from "../../../app/components/app-textfield";
import AppAutoComplete, { AppAutocompleteOption } from "../../../app/components/app-autocomplete";
export default function RelUserToTwilioNumberDialog() {
  const dispatch = useAppDispatch()
  const {displayRelUserToNumberForm, users, relUserToNumberDialog, twilioNumbers} = useAppSelector((state) => state.twilioNumbers) 

  const { twilioNumber, userId } = relUserToNumberDialog

  const closeDialog = () => dispatch(displayRelUserToNumberFormAct(false))


  const options = () => {
    return users.map((user) => {
      return { _id: user._id!, name: user.email! } as AppAutocompleteOption
    }) as AppAutocompleteOption[]
  }

  const userValue = () => {

    const value =  options().find((option) => option._id === userId)
    console.log({value});
    
    return value
  }
  

  const submitForm = (e: any) => {
    e.preventDefault()
    const PNID  = twilioNumbers.find((twilio) => twilio.number === twilioNumber)?.PNID!
    if(PNID) {
      dispatch(relUserToTwilioNumberThunk({PNID, userId}))
    } else {
      alert("Twilio number not found")
    }
  }

  return (
    <>
      <Dialog open={displayRelUserToNumberForm}>
        <IconButton onClick={closeDialog} className="closeDialog"> <Close  /></IconButton>
        <DialogTitle> Rel user to twilio number </DialogTitle>
        <form onSubmit={submitForm}>
          <DialogContent sx={{minWidth: 550}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField label="Twilio number" value={twilioNumber} readonly disabled />
              </Grid>
              <Grid item xs={12}>
                <AppAutoComplete onChange={(d) => dispatch(changeUserToRelToNumberAct({userId: d.val._id, twilioNumber}))} name="userId" label="User" value={userValue()} options={options()}/>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{paddingRight: 3}}>
            <Button type="submit" variant="outlined"> Save </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}