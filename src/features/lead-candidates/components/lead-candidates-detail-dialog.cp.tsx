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
import LoadingIndicator from "../../../app/components/loading-indicator"
import {
  clearLeadCandidateDetailAct,
} from "../slice/lead-candidates.slice"
import type { LeadCandidateRow } from "../types/lead-candidates.types"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

type LeadCandidatesDetailDialogCpProps = {
  readonly open: boolean
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

function buildFieldRows(row: LeadCandidateRow): Array<{ readonly label: string; readonly value: string }> {
  return [
    { label: s.fields.id, value: row.id },
    { label: s.fields.name, value: row.name },
    { label: s.fields.lastName, value: row.lastName },
    { label: s.fields.email, value: row.email },
    { label: s.fields.phone, value: row.phone },
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
}: LeadCandidatesDetailDialogCpProps): React.ReactElement {
  const dispatch = useAppDispatch()
  const { detailRow, isLoadingDetail } = useAppSelector((state) => state.leadCandidates)

  const handleClose = (): void => {
    dispatch(clearLeadCandidateDetailAct())
  }

  const fields = detailRow != null ? buildFieldRows(detailRow) : []

  return (
    <>
      <LoadingIndicator open={isLoadingDetail} />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{s.detailTitle}</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {fields.map((field) => (
              <ReadOnlyField
                key={field.label}
                label={field.label}
                value={field.value}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ cursor: "pointer" }}>
            {s.close}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
