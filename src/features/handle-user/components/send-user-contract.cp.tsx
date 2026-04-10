import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { sendUserContractThunk } from "../handle-user.slice"
import { pushAlertAction } from "../../dashboard/dashboard.slice"

function buildFullName(name: string, lastName: string): string {
  return `${name ?? ""} ${lastName ?? ""}`.trim()
}

export default function SendUserContractCp() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [city, setCity] = useState("")
  const [successOpen, setSuccessOpen] = useState(false)
  const fullName = currentUser
    ? buildFullName(currentUser.name, currentUser.lastName)
    : ""
  const hasRequiredUserFields =
    currentUser != null &&
    currentUser._id != null &&
    fullName.length > 0 &&
    (currentUser.document ?? "").trim().length > 0 &&
    (currentUser.email ?? "").trim().length > 0 &&
    (currentUser.phone ?? "").trim().length > 0
  const openDisabled = !hasRequiredUserFields
  const sendDisabled = city.trim().length === 0
  const handleOpenDialog = () => {
    setCity("")
    setDialogOpen(true)
  }
  const handleSend = () => {
    if (currentUser?._id == null || sendDisabled) return
    void dispatch(
      sendUserContractThunk({
        userId: currentUser._id,
        fullName,
        documentNumber: (currentUser.document ?? "").trim(),
        city: city.trim(),
        email: (currentUser.email ?? "").trim(),
        phone: (currentUser.phone ?? "").trim(),
      })
    )
      .unwrap()
      .then(() => {
        setDialogOpen(false)
        setSuccessOpen(true)
      })
      .catch((err: unknown) => {
        dispatch(
          pushAlertAction({
            title: s.sendContractError,
            message: err != null ? String(err) : s.sendContractError,
          })
        )
      })
  }
  return (
    <>
      <Grid item>
        <Button variant="outlined" disabled={openDisabled} onClick={handleOpenDialog}>
          {s.sendContract}
        </Button>
      </Grid>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{s.sendContractDialogTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={s.sendContractCityLabel}
            helperText={s.sendContractCityHelper}
            fullWidth
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{s.sendContractCancel}</Button>
          <Button onClick={handleSend} disabled={sendDisabled} variant="contained">
            {s.sendContractConfirm}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
        <DialogTitle>{s.sendContractSuccessTitle}</DialogTitle>
        <DialogContent>{s.sendContractSuccessBody}</DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
