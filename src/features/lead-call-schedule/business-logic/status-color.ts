import type { Theme } from "@mui/material/styles"
import type { LeadCallStatus } from "../types/lead-call-schedule.types"

export const resolveStatusColor = (theme: Theme, status: LeadCallStatus): string => {
  if (status === "done") return theme.palette.success.main
  if (status === "cancelled") return theme.palette.text.disabled
  return theme.palette.primary.main
}
