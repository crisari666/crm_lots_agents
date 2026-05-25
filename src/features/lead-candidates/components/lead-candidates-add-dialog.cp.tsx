import * as React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  createLeadCandidateThunk,
  fetchLeadCandidatesThunk,
} from "../slice/lead-candidates.slice"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

type LeadCandidatesAddDialogCpProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly onCreated: () => void
}

export default function LeadCandidatesAddDialogCp({
  open,
  onClose,
  onCreated,
}: LeadCandidatesAddDialogCpProps): React.ReactElement {
  const dispatch = useAppDispatch()
  const { isSubmitting } = useAppSelector((state) => state.leadCandidates)
  const [name, setName] = React.useState<string>("")
  const [lastName, setLastName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [phone, setPhone] = React.useState<string>("")

  const resetForm = (): void => {
    setName("")
    setLastName("")
    setEmail("")
    setPhone("")
  }

  const handleClose = (): void => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (): Promise<void> => {
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()
    if (trimmedName.length === 0 || trimmedEmail.length === 0 || trimmedPhone.length === 0) {
      return
    }
    try {
      await dispatch(
        createLeadCandidateThunk({
          name: trimmedName,
          lastName: lastName.trim(),
          email: trimmedEmail,
          phone: trimmedPhone,
        }),
      ).unwrap()
      resetForm()
      onCreated()
      onClose()
    } catch {
      // error surfaced via slice
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{s.dialogTitle}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label={s.fields.name}
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label={s.fields.lastName}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label={s.fields.email}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label={s.fields.phone}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            required
            fullWidth
            size="small"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting} sx={{ cursor: "pointer" }}>
          {s.cancel}
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          sx={{ cursor: "pointer" }}
        >
          {isSubmitting ? s.saving : s.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
