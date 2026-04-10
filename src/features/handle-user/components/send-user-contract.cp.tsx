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
  if ((user.city ?? "").trim().length === 0) {
    items.push(s.sendContractMissingCity)
  }
  return items
}

export default function SendUserContractCp() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const [missingDialogOpen, setMissingDialogOpen] = useState(false)
  const [missingItems, setMissingItems] = useState<string[]>([])
  const [successOpen, setSuccessOpen] = useState(false)
  const fullName = currentUser
    ? buildFullName(currentUser.name, currentUser.lastName)
    : ""
  const handleSendContract = () => {
    const missing = getMissingSendContractItems(currentUser)
    if (missing.length > 0) {
      setMissingItems(missing)
      setMissingDialogOpen(true)
      return
    }
    if (currentUser?._id == null) return
    const city = (currentUser.city ?? "").trim()
    void dispatch(
      sendUserContractThunk({
        userId: currentUser._id,
        fullName,
        documentNumber: (currentUser.document ?? "").trim(),
        city,
        email: (currentUser.email ?? "").trim(),
        phone: (currentUser.phone ?? "").trim(),
      })
    )
      .unwrap()
      .then(() => {
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
        <Button variant="outlined" onClick={handleSendContract}>
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
