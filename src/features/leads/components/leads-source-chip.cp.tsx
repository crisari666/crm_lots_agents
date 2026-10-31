import React from "react"
import { Chip } from "@mui/material"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import type { LeadSource } from "../types/leads.types"

const SOURCE_COLOR: Record<LeadSource, "primary" | "secondary" | "default" | "info" | "warning"> = {
  meta_form: "primary",
  whatsapp_lead_conversation: "secondary",
  whatsapp_inbound: "info",
  manual: "default",
  webinar: "warning",
}

type Props = {
  source: LeadSource
}

export default function LeadsSourceChipCP({ source }: Props): React.ReactElement {
  return (
    <Chip
      size="small"
      label={s.sources[source] ?? source}
      color={SOURCE_COLOR[source] ?? "default"}
      variant="outlined"
      sx={{ mr: 0.5, mb: 0.5 }}
    />
  )
}
