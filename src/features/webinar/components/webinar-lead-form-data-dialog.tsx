import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import type { WebinarLead } from "../types/webinar.types"

function formatFieldLabel(fieldKey: string): string {
  return fieldKey.replace(/_/g, " ").replace(/\s+/g, " ").trim()
}

function buildDisplayItems(
  lead: WebinarLead
): readonly { readonly label: string; readonly value: string }[] {
  if (lead.fieldData != null && lead.fieldData.length > 0) {
    return lead.fieldData.map((row) => ({
      label: formatFieldLabel(row.name),
      value: row.values.length > 0 ? row.values.join(", ") : "—",
    }))
  }
  const mapped = lead.mappedFields ?? {}
  return Object.entries(mapped).map(([key, value]) => ({
    label: formatFieldLabel(key),
    value: value.trim().length > 0 ? value.trim() : "—",
  }))
}

type WebinarLeadFormDataDialogProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly lead: WebinarLead | null
}

export default function WebinarLeadFormDataDialog({
  open,
  onClose,
  lead,
}: WebinarLeadFormDataDialogProps) {
  const items = lead != null ? buildDisplayItems(lead) : []
  const titleName =
    lead != null
      ? [lead.name, lead.lastName].filter(Boolean).join(" ") || lead.phone
      : ""

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {s.viewFormDataTitle}
        {titleName.length > 0 ? ` — ${titleName}` : ""}
      </DialogTitle>
      <DialogContent dividers>
        {lead?.campaignName != null && lead.campaignName.length > 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {s.campaignLabel}: {lead.campaignName}
          </Typography>
        ) : null}
        {lead?.platform != null && lead.platform.length > 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {s.platformLabel}: {lead.platform}
          </Typography>
        ) : null}
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {s.noFormData}
          </Typography>
        ) : (
          <List dense disablePadding>
            {items.map((row) => (
              <ListItem key={`${row.label}-${row.value}`} divider disableGutters>
                <ListItemText primary={row.label} secondary={row.value} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  )
}
