import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined"
import { Box, Button, Stack, Typography } from "@mui/material"
import { useAppDispatch } from "../../../app/hooks"
import { leadsStrings as s } from "../../../i18n/locales/leads.strings"
import LeadConversationChatDrawerCP from "../../lead-conversations/components/lead-conversation-chat-drawer.cp"
import AssignmentTimelineDialogCP from "../assignment-timeline/components/assignment-timeline-dialog.cp"
import { openAssignmentTimelineAct } from "../assignment-timeline/slice/assignment-timeline.slice"
import LeadsFiltersCP from "../components/leads-filters.cp"
import LeadsNoticeCP from "../components/leads-notice.cp"
import LeadsTableCP from "../components/leads-table.cp"

/**
 * Admin leads inbox: audit Meta / WA sources, open customer detail, convert lead → customer.
 */
export default function LeadsPage() {
  const dispatch = useAppDispatch()
  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ sm: "flex-start" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {s.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
            {s.subtitle}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<TimelineOutlinedIcon />}
          onClick={() => dispatch(openAssignmentTimelineAct())}
          sx={{ cursor: "pointer", flexShrink: 0 }}
        >
          {s.timelineOpen}
        </Button>
      </Stack>
      <LeadsFiltersCP />
      <LeadsTableCP />
      <LeadsNoticeCP />
      <LeadConversationChatDrawerCP />
      <AssignmentTimelineDialogCP />
    </Box>
  )
}
