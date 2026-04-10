import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { sendWelcomeAccessEmailThunk } from "../handle-user.slice"
import { pushAlertAction } from "../../dashboard/dashboard.slice"

export default function SendFirstAccessWelcomeCp() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const [successOpen, setSuccessOpen] = useState(false)
  const disabled =
    currentUser == null ||
    currentUser.enable === false ||
    currentUser.hasPassword === true
  const handleSend = () => {
    if (currentUser?._id == null) return
    void dispatch(sendWelcomeAccessEmailThunk(currentUser._id))
      .unwrap()
      .then(() => setSuccessOpen(true))
      .catch((err: unknown) => {
        dispatch(
          pushAlertAction({
            title: s.sendWelcomeAccessError,
            message: err != null ? String(err) : s.sendWelcomeAccessError,
          })
        )
      })
  }
  return (
    <>
      <Grid item>
        <Button variant="outlined" 
        //disabled={disabled} 
        onClick={handleSend}>
          {s.sendWelcomeAccess}
        </Button>
      </Grid>
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>{s.sendWelcomeAccessSuccessTitle}</DialogTitle>
        <DialogContent>{s.sendWelcomeAccessSuccessBody}</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
