import React, { useMemo } from "react"
import { Typography } from "@mui/material"
import { useAppSelector } from "../../../app/hooks"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"

export default function LeadCallWeekSummaryCP(): React.ReactElement {
  const items = useAppSelector((state) => state.leadCallSchedule.items)
  const counts = useMemo(
    () => ({
      pending: items.filter((item) => item.status === "pending").length,
      done: items.filter((item) => item.status === "done").length,
      cancelled: items.filter((item) => item.status === "cancelled").length,
    }),
    [items]
  )
  return (
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontVariantNumeric: "tabular-nums" }}>
      {s.weekSummary(counts.pending, counts.done, counts.cancelled)}
    </Typography>
  )
}
