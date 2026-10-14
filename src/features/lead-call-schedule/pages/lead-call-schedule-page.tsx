import { Box, Typography } from "@mui/material"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import LeadCallAgendaBoardCP from "../components/lead-call-agenda-board.cp"
import LeadCallEventDrawerCP from "../components/lead-call-event-drawer.cp"
import LeadCallScheduleNoticeCP from "../components/lead-call-schedule-notice.cp"
import LeadCallScheduleToolbarCP from "../components/lead-call-schedule-toolbar.cp"
import LeadCallWeekSummaryCP from "../components/lead-call-week-summary.cp"

export default function LeadCallSchedulePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 720 }}>
        {s.subtitle}
      </Typography>
      <LeadCallScheduleToolbarCP />
      <LeadCallWeekSummaryCP />
      <LeadCallAgendaBoardCP />
      <LeadCallEventDrawerCP />
      <LeadCallScheduleNoticeCP />
    </Box>
  )
}
