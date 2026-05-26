import * as React from "react"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import LoadingIndicator from "../../../app/components/loading-indicator"
import {
  clearLeadCandidateDetailAct,
  updateLeadCandidateThunk,
} from "../slice/lead-candidates.slice"
import type { LeadCandidateRow } from "../types/lead-candidates.types"
import { canEditLeadCandidate } from "../business-logic/lead-candidate-editability"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

type LeadCandidatesDetailDialogCpProps = {
  readonly open: boolean
  readonly onUpdated?: () => void
}

function ReadOnlyField({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}): React.ReactElement {
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      size="small"
      InputProps={{ readOnly: true }}
    />
  )
}

function buildReadOnlyFieldRows(
  row: LeadCandidateRow,
): Array<{ readonly label: string; readonly value: string }> {
  return [
    { label: s.fields.id, value: row.id },
    { label: s.fields.normalizedEmail, value: row.normalizedEmail },
    { label: s.fields.normalizedPhone, value: row.normalizedPhone },
    { label: s.fields.sourceType, value: row.sourceType },
    { label: s.fields.sourceExternalId, value: row.sourceExternalId ?? "" },
    {
      label: s.fields.sourceMeta,
      value: JSON.stringify(row.sourceMeta ?? {}, null, 2),
    },
    { label: s.fields.status, value: row.status },
    { label: s.fields.promotedUserId, value: row.promotedUserId ?? "" },
    { label: s.fields.legacyUserId, value: row.legacyUserId ?? "" },
    { label: s.fields.migrationBatchId, value: row.migrationBatchId ?? "" },
    {
      label: s.fields.migratedFromUser,
      value: row.migratedFromUser ? "Sí" : "No",
    },
    { label: s.fields.createdAt, value: new Date(row.createdAt).toLocaleString() },
    { label: s.fields.updatedAt, value: new Date(row.updatedAt).toLocaleString() },
  ]
}

export default function LeadCandidatesDetailDialogCp({
  open,
  onUpdated,
}: LeadCandidatesDetailDialogCpProps): React.ReactElement {
  const dispatch = useAppDispatch()
  const { detailRow, isLoadingDetail, isSubmitting, error } = useAppSelector(
    (state) => state.leadCandidates,
  )
  const [name, setName] = React.useState<string>("")
  const [lastName, setLastName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [phone, setPhone] = React.useState<string>("")

  const isEditable =
    detailRow != null && canEditLeadCandidate(detailRow)

  React.useEffect(() => {
    if (detailRow == null) {
      return
    }
    setName(detailRow.name)
    setLastName(detailRow.lastName)
    setEmail(detailRow.email)
    setPhone(detailRow.phone)
  }, [detailRow])

  const handleClose = (): void => {
    dispatch(clearLeadCandidateDetailAct())
  }

  const handleSave = async (): Promise<void> => {
    if (detailRow == null || !isEditable) {
      return
    }
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPhone = phone.trim()
    if (trimmedName.length === 0 || trimmedEmail.length === 0 || trimmedPhone.length === 0) {
      return
    }
    try {
      await dispatch(
        updateLeadCandidateThunk({
          id: detailRow.id,
          payload: {
            name: trimmedName,
            lastName: lastName.trim(),
            email: trimmedEmail,
            phone: trimmedPhone,
          },
        }),
      ).unwrap()
      onUpdated?.()
    } catch {
      // error surfaced via slice
    }
  }

  const readOnlyFields =
    detailRow != null ? buildReadOnlyFieldRows(detailRow) : []

  return (
    <>
      <LoadingIndicator open={isLoadingDetail} />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditable ? s.editDetailTitle : s.detailTitle}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {error != null && error !== "" ? (
              <Alert severity="error">{s.saveError} {error}</Alert>
            ) : null}
            {detailRow != null && !isEditable ? (
              <Alert severity="info">{s.editNotAllowed}</Alert>
            ) : null}
            {isEditable ? (
              <>
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
              </>
            ) : detailRow != null ? (
              <>
                <ReadOnlyField label={s.fields.name} value={detailRow.name} />
                <ReadOnlyField label={s.fields.lastName} value={detailRow.lastName} />
                <ReadOnlyField label={s.fields.email} value={detailRow.email} />
                <ReadOnlyField label={s.fields.phone} value={detailRow.phone} />
              </>
            ) : null}
            {readOnlyFields.map((field) => (
              <ReadOnlyField
                key={field.label}
                label={field.label}
                value={field.value}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting} sx={{ cursor: "pointer" }}>
            {s.close}
          </Button>
          {isEditable ? (
            <Button
              variant="contained"
              onClick={() => void handleSave()}
              disabled={isSubmitting}
              sx={{ cursor: "pointer" }}
            >
              {isSubmitting ? s.saving : s.save}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  )
}
