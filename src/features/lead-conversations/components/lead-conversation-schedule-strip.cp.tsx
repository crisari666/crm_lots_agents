import React from "react"
import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import type { LeadScheduledCall } from "../../leads/types/leads.types"

type Props = {
  schedule: LeadScheduledCall
}

/**
 * Compact next-call summary when the chat drawer was opened from the leads inbox.
 */
export default function LeadConversationScheduleStripCP({
  schedule,
}: Props): React.ReactElement {
  const statusLabel = s.scheduleStatus[schedule.status] ?? schedule.status
  const when = new Date(schedule.scheduledAt).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  return (
    <Box
      sx={{
        mx: 2.5,
        mb: 1.5,
        p: 1.25,
        borderRadius: 1,
        bgcolor: "action.hover",
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {s.scheduleStripTitle}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
        <Typography variant="body2" fontWeight={600}>
          {when}
        </Typography>
        <Chip size="small" label={statusLabel} color="warning" variant="outlined" />
        {schedule.ventorName ? (
          <Typography variant="body2" color="text.secondary">
            {schedule.ventorName}
          </Typography>
        ) : null}
      </Stack>
      {schedule.note ? (
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {schedule.note}
        </Typography>
      ) : null}
      <Button
        size="small"
        component={RouterLink}
        to="/dashboard/lead-call-schedule"
        sx={{ mt: 0.75, cursor: "pointer", px: 0 }}
      >
        {s.scheduleStripAgenda}
      </Button>
    </Box>
  )
}
