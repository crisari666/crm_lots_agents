import { Box, Typography } from "@mui/material"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import LeadConversationChatDrawerCP from "../components/lead-conversation-chat-drawer.cp"
import LeadConversationNoticeCP from "../components/lead-conversation-notice.cp"
import LeadConversationsFiltersCP from "../components/lead-conversations-filters.cp"
import LeadConversationsTableCP from "../components/lead-conversations-table.cp"

export default function LeadConversationsPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 720 }}>
        {s.subtitle}
      </Typography>
      <LeadConversationsFiltersCP />
      <LeadConversationsTableCP />
      <LeadConversationChatDrawerCP />
      <LeadConversationNoticeCP />
    </Box>
  )
}
