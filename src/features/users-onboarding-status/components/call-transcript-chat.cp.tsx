import { Box, Paper, Typography } from "@mui/material"
import type { TranscriptChatMessageType } from "../utils/onboarding-transcript-chat.utils"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type CallTranscriptChatCPProps = {
  messages: TranscriptChatMessageType[]
}

export default function CallTranscriptChatCP({ messages }: CallTranscriptChatCPProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {s.transcriptChatHeading}
      </Typography>
      <Box
        sx={{
          maxHeight: 360,
          overflow: "auto",
          pr: 0.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.25
        }}
      >
        {messages.map((m, index) => {
          const isAssistant = m.speaker === "assistant"
          return (
            <Box
              key={`${index}-${m.content.slice(0, 24)}`}
              sx={{
                display: "flex",
                justifyContent: isAssistant ? "flex-start" : "flex-end",
                width: "100%"
              }}
            >
              <Box sx={{ maxWidth: "88%", minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 0.25,
                    textAlign: isAssistant ? "left" : "right"
                  }}
                >
                  {isAssistant ? s.transcriptChatSpeakerAssistant : s.transcriptChatSpeakerUser}
                </Typography>
                <Paper
                  elevation={0}
                  sx={(theme) => ({
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: isAssistant ? theme.palette.action.hover : theme.palette.primary.main,
                    color: isAssistant ? "text.primary" : theme.palette.primary.contrastText,
                    border: "1px solid",
                    borderColor: isAssistant ? "divider" : "transparent"
                  })}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}
                  >
                    {m.content}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
