import React, { useEffect, useRef } from "react"
import { Alert, Box, Button, Skeleton, Typography } from "@mui/material"
import { ChatBubbleOutline } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import { fetchLeadConversationMessagesThunk } from "../slice/lead-conversations.slice"
import LeadConversationMessageBubbleCP from "./lead-conversation-message-bubble.cp"

const SKELETON_BUBBLES = [
  { width: "65%", align: "flex-end" },
  { width: "40%", align: "flex-start" },
  { width: "70%", align: "flex-end" },
  { width: "35%", align: "flex-start" },
] as const

function MessagesSkeleton(): React.ReactElement {
  return (
    <Box sx={{ p: 2 }} aria-hidden>
      {SKELETON_BUBBLES.map((bubble, index) => (
        <Box key={index} sx={{ display: "flex", justifyContent: bubble.align, mb: 1.5 }}>
          <Skeleton variant="rounded" height={56} width={bubble.width} />
        </Box>
      ))}
    </Box>
  )
}

/** Transcript of the selected session, scrolled to the latest message on first load. */
export default function LeadConversationMessagesCP({ sessionId }: { sessionId: string }): React.ReactElement {
  const dispatch = useAppDispatch()
  const messages = useAppSelector((state) => state.leadConversations.messages)
  const loading = useAppSelector((state) => state.leadConversations.messagesLoading)
  const error = useAppSelector((state) => state.leadConversations.messagesError)
  const nextBefore = useAppSelector((state) => state.leadConversations.messagesNextBefore)
  const bottomRef = useRef<HTMLDivElement>(null)
  const latestMessageId = messages[messages.length - 1]?.id
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" })
  }, [latestMessageId])
  if (loading && messages.length === 0) return <MessagesSkeleton />
  if (error && messages.length === 0) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => void dispatch(fetchLeadConversationMessagesThunk({ sessionId }))}>
            {s.retry}
          </Button>
        }
      >
        {error}
      </Alert>
    )
  }
  if (messages.length === 0) {
    return (
      <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
        <ChatBubbleOutline sx={{ fontSize: 36, color: "text.disabled" }} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          {s.messagesEmpty}
        </Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ p: 2 }}>
      {nextBefore ? (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Button
            size="small"
            disabled={loading}
            onClick={() => void dispatch(fetchLeadConversationMessagesThunk({ sessionId, before: nextBefore }))}
          >
            {s.loadOlder}
          </Button>
        </Box>
      ) : null}
      {messages.map((message) => (
        <LeadConversationMessageBubbleCP key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </Box>
  )
}
