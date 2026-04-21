import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeUserToRelToNumberAct, displayRelUserToNumberFormAct, relUserToTwilioNumberThunk } from "../slice/twilio-numbers.slice";
import AppTextField from "../../../app/components/app-textfield";
import AppAutoComplete, { AppAutocompleteOption } from "../../../app/components/app-autocomplete";
import type { FormEvent } from "react";

export default function RelUserToTwilioNumberDialog() {
  const dispatch = useAppDispatch()
  const {displayRelUserToNumberForm, users, relUserToNumberDialog, twilioNumbers} = useAppSelector((state) => state.twilioNumbers) 

  const { twilioNumber, userId, PNID } = relUserToNumberDialog

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
  

  const resolvedPNID = PNID || twilioNumbers.find((twilio) => twilio.number === twilioNumber)?.PNID

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    if (!resolvedPNID) {
      alert("Twilio number not found")
      return
    }
    if (!userId) {
      alert("Select a user or use Remove user")
      return
    }
    dispatch(relUserToTwilioNumberThunk({ PNID: resolvedPNID, userId }))
  }

  const removeUser = () => {
    if (!resolvedPNID) {
      alert("Twilio number not found")
      return
    }
    dispatch(relUserToTwilioNumberThunk({ PNID: resolvedPNID }))
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
                <AppAutoComplete
                  onChange={(d) =>
                    dispatch(
                      changeUserToRelToNumberAct({
                        userId: d.val._id,
                        twilioNumber,
                        PNID:
                          PNID || twilioNumbers.find((t) => t.number === twilioNumber)?.PNID || "",
                      }),
                    )
                  }
                  name="userId"
                  label="User"
                  value={userValue()}
                  options={options()}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ paddingRight: 3, gap: 1 }}>
            <Button type="button" variant="text" color="warning" onClick={removeUser} disabled={!resolvedPNID}>
              Remove user
            </Button>
            <Button type="submit" variant="outlined">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}