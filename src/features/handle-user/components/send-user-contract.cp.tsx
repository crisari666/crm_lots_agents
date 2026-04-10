import { useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import UserInterface from "../../../app/models/user-interface"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { sendUserContractThunk } from "../handle-user.slice"
import { pushAlertAction } from "../../dashboard/dashboard.slice"

function buildFullName(name: string, lastName: string): string {
  return `${name ?? ""} ${lastName ?? ""}`.trim()
}

function getMissingSendContractItems(user: UserInterface | undefined): string[] {
  const items: string[] = []
  if (user == null) {
    items.push(s.sendContractMissingNoUser)
    return items
  }
  if (user._id == null || String(user._id).trim() === "") {
    items.push(s.sendContractMissingSavedUser)
  }
  const fullName = buildFullName(user.name, user.lastName)
  if (fullName.length === 0) {
    items.push(s.sendContractMissingFullName)
  }
  if ((user.document ?? "").trim().length === 0) {
    items.push(s.sendContractMissingDocument)
  }
  if ((user.email ?? "").trim().length === 0) {
    items.push(s.sendContractMissingEmail)
  }
  if ((user.phone ?? "").trim().length === 0) {
    items.push(s.sendContractMissingPhone)
  }
  return items
}

export default function SendUserContractCp() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [missingDialogOpen, setMissingDialogOpen] = useState(false)
  const [missingItems, setMissingItems] = useState<string[]>([])
  const [city, setCity] = useState("")
  const [successOpen, setSuccessOpen] = useState(false)
  const fullName = currentUser
    ? buildFullName(currentUser.name, currentUser.lastName)
    : ""
  const sendDisabled = city.trim().length === 0
  const handleOpenFlow = () => {
    const missing = getMissingSendContractItems(currentUser)
    if (missing.length > 0) {
      setMissingItems(missing)
      setMissingDialogOpen(true)
      return
    }
    setCity((currentUser?.city ?? "").trim())
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
        <Button variant="outlined" onClick={handleOpenFlow}>
          {s.sendContract}
        </Button>
      </Grid>
      <Dialog open={missingDialogOpen} onClose={() => setMissingDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{s.sendContractMissingTitle}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {s.sendContractMissingIntro}
          </Typography>
          <List dense disablePadding>
            {missingItems.map((label, i) => (
              <ListItem key={i} disableGutters sx={{ py: 0.25 }}>
                <ListItemText primary={`• ${label}`} primaryTypographyProps={{ variant: "body2" }} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMissingDialogOpen(false)} variant="contained">
            {s.sendContractMissingClose}
          </Button>
        </DialogActions>
      </Dialog>
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
            {s.sendContractSuccessOk}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
