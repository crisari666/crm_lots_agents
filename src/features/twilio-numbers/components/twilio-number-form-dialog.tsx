import { Close } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { displayTwilioFormAct, registerTwilioNumberThunk, updateInputTwilioNumberAct, updateTwilioNumberThunk } from "../slice/twilio-numbers.slice"
export default function TwilioNumberFormDialog() {
  const dispatch = useAppDispatch()
  const { displayTwilioNumberForm, twilioNumberForm, editingPNID } = useAppSelector((state) => state.twilioNumbers)
  const { PNID, friendlyNumber, number } = twilioNumberForm
  const isEdit = Boolean(editingPNID)

  const closeDialog = () => dispatch(displayTwilioFormAct(false))

  const changeInput = (d: { name: string, val: string }) => dispatch(updateInputTwilioNumberAct(d))

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      dispatch(updateTwilioNumberThunk({ PNID, number, friendlyNumber }))
    } else {
      dispatch(registerTwilioNumberThunk({ PNID, number, friendlyNumber }))
    }
  }

  return (
    <>
      <Dialog open={displayTwilioNumberForm}>
        <IconButton className="closeDialog" onClick={closeDialog}> <Close /></IconButton>
        <DialogTitle> {isEdit ? "Edit twilio number" : "Add twilio number"} </DialogTitle>
        <form onSubmit={submitForm}>
          <DialogContent sx={{ minWidth: 500 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AppTextField label="PNID" name="PNID" value={PNID} onChange={changeInput} readonly={isEdit} />
              </Grid>
              <Grid item xs={12}>
                <AppTextField label="Friendly Number" name="friendlyNumber" value={friendlyNumber} onChange={changeInput} />
              </Grid>
              <Grid item xs={12}>
                <AppTextField label="Number Twilio" name="number" value={number} onChange={changeInput} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ paddingRight: 3 }}>
            <Button type="submit" variant="outlined"> {isEdit ? "Update" : "AGREGAR"} </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}