import React from "react"
import { Box, Chip, Link, Stack, Typography } from "@mui/material"
import { ErrorOutline, SmartToyOutlined } from "@mui/icons-material"
import moment from "moment"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import type { LeadConversationMessage } from "../types/lead-conversations.types"

type Props = { message: LeadConversationMessage }

function MessageMedia({ message }: Props): React.ReactElement | null {
  if (!message.mediaUrl) return null
  if (message.kind === "image") {
    return (
      <Box
        component="img"
        src={message.mediaUrl}
        alt={message.body || s.attachment}
        sx={{ display: "block", maxWidth: 240, width: "100%", borderRadius: 1, mb: 0.75 }}
      />
    )
  }
  return (
    <Link href={message.mediaUrl} target="_blank" rel="noreferrer" color="inherit" sx={{ display: "block", mb: 0.75 }}>
      {s.attachment}
    </Link>
  )
}

/** Read-only bubble: assistant (outbound) on the right, lead (inbound) on the left. */
export default function LeadConversationMessageBubbleCP({ message }: Props): React.ReactElement {
  const isBot = message.direction === "outbound"
  return (
    <Box sx={{ display: "flex", justifyContent: isBot ? "flex-end" : "flex-start", mb: 1.25 }}>
      <Box
        sx={{
          maxWidth: "85%",
          px: 1.5,
          py: 1,
          borderRadius: 2,
          borderBottomRightRadius: isBot ? 4 : undefined,
          borderBottomLeftRadius: isBot ? undefined : 4,
          bgcolor: isBot ? "primary.main" : "grey.100",
          color: isBot ? "primary.contrastText" : "text.primary",
        }}
      >
        {isBot ? (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.75, mb: 0.25 }}>
            <SmartToyOutlined sx={{ fontSize: 14 }} />
            <Typography variant="caption" fontWeight={600}>
              {s.botLabel}
            </Typography>
          </Stack>
        ) : null}
        <MessageMedia message={message} />
        {message.body ? (
          <Typography variant="body2" sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
            {message.body}
          </Typography>
        ) : null}
        {message.options.length > 0 ? (
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
            {message.options.map((option) => (
              <Chip
                key={option}
                label={option}
                size="small"
                variant="outlined"
                sx={{ color: "inherit", borderColor: isBot ? "rgba(255,255,255,0.5)" : undefined }}
              />
            ))}
          </Stack>
        ) : null}
        <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="flex-end" sx={{ mt: 0.5, opacity: 0.7 }}>
          {!message.delivered ? (
            <>
              <ErrorOutline sx={{ fontSize: 14 }} />
              <Typography variant="caption">{s.notDelivered}</Typography>
            </>
          ) : null}
          <Typography variant="caption" component="time" dateTime={message.timestamp}>
            {moment(message.timestamp).format("DD/MM HH:mm")}
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}
