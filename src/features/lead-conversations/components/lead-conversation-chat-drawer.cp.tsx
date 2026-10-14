import React from "react"
import { Box, Divider, Drawer, IconButton, Stack, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import { selectLeadConversationAct } from "../slice/lead-conversations.slice"
import LeadConversationActionsCP from "./lead-conversation-actions.cp"
import { LeadConversationScoreCP, LeadConversationStatusChipCP, LeadConversationStepChipCP } from "./lead-conversation-chips.cp"
import LeadConversationMessagesCP from "./lead-conversation-messages.cp"

const DRAWER_WIDTH = 460

function DrawerHeader({ sessionId }: { sessionId: string }): React.ReactElement {
  const dispatch = useAppDispatch()
  const item = useAppSelector((state) =>
    state.leadConversations.items.find((row) => row.sessionId === sessionId)
  )
  return (
    <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary">
            {s.drawerTitle}
          </Typography>
          <Typography variant="h6" fontWeight={700} noWrap>
            {item?.customerName || item?.phone || "—"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item?.phone}
            {item ? ` · ${item.isAllProjects ? s.allProjects : (item.projectTitle ?? s.noProject)}` : ""}
          </Typography>
        </Box>
        <IconButton aria-label={s.close} onClick={() => dispatch(selectLeadConversationAct(null))}>
          <Close />
        </IconButton>
      </Stack>
      {item ? (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
          <LeadConversationStatusChipCP status={item.status} />
          <LeadConversationStepChipCP step={item.step} />
          <Box sx={{ flex: 1 }} />
          <LeadConversationScoreCP score={item.score} maxScore={item.maxScore} priority={item.priority} />
        </Stack>
      ) : null}
    </Box>
  )
}

/** Right-side panel with the assistant transcript and flow actions for the selected session. */
export default function LeadConversationChatDrawerCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const sessionId = useAppSelector((state) => state.leadConversations.selectedSessionId)
  return (
    <Drawer
      anchor="right"
      open={sessionId !== null}
      onClose={() => dispatch(selectLeadConversationAct(null))}
      PaperProps={{ sx: { width: { xs: "100%", sm: DRAWER_WIDTH }, display: "flex", flexDirection: "column" } }}
    >
      {sessionId ? (
        <>
          <DrawerHeader sessionId={sessionId} />
          <Divider />
          <Box sx={{ flex: 1, overflowY: "auto", bgcolor: "grey.50" }}>
            <LeadConversationMessagesCP sessionId={sessionId} />
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <LeadConversationActionsCP sessionId={sessionId} />
          </Box>
        </>
      ) : null}
    </Drawer>
  )
}
