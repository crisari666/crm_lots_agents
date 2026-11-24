import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined"
import ImageOutlined from "@mui/icons-material/ImageOutlined"
import PersonOutline from "@mui/icons-material/PersonOutline"
import SendOutlined from "@mui/icons-material/SendOutlined"
import SmartDisplayOutlined from "@mui/icons-material/SmartDisplayOutlined"
import { Alert, Box, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  sendSimulatorMessageThunk,
  type SimulatorMessage,
} from "../../slice/lead-assistant-simulator.slice"
import type { LeadSimulatedMessageKind } from "../../types/lead-assistant.types"
import WhatsAppBubbleCP from "../shared/whatsapp-bubble.cp"

const MAX_MESSAGE_CHARS = 1000

const MEDIA_ICONS: Partial<Record<LeadSimulatedMessageKind, ReactNode>> = {
  image: <ImageOutlined fontSize="small" />,
  video: <SmartDisplayOutlined fontSize="small" />,
  document: <DescriptionOutlined fontSize="small" />,
  contacts: <PersonOutline fontSize="small" />,
}

function renderMessage(message: SimulatorMessage) {
  const mediaLabel = s.simulatorMediaLabels[message.kind]
  return (
    <WhatsAppBubbleCP
      key={message.id}
      sender={message.direction === "inbound" ? "lead" : "assistant"}
      text={message.body}
      mediaIcon={MEDIA_ICONS[message.kind]}
      mediaLabel={mediaLabel}
      buttons={message.options?.map((option) => option.title)}
    />
  )
}

/** Chat column of the simulator (messages are never sent to WhatsApp). */
export default function SimulatorChatCP() {
  const dispatch = useAppDispatch()
  const messages = useAppSelector((state) => state.leadAssistant.simulator.messages)
  const isSending = useAppSelector((state) => state.leadAssistant.simulator.sending)
  const error = useAppSelector((state) => state.leadAssistant.simulator.error)
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: "end" })
  }, [messages.length, isSending])
  useEffect(() => {
    if (messages.length === 0) {
      setInput("")
    }
  }, [messages.length])
  const trimmed = input.trim()
  const handleSend = () => {
    if (trimmed.length === 0 || isSending) {
      return
    }
    setInput("")
    void dispatch(sendSimulatorMessageThunk(trimmed))
  }
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Stack
        role="log"
        aria-live="polite"
        aria-label={s.simulatorChatAria}
        spacing={1.25}
        sx={(theme) => ({
          p: 2,
          height: 380,
          overflowY: "auto",
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.06),
          border: "1px solid",
          borderColor: alpha(theme.palette.success.main, 0.2),
        })}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {s.simulatorEmpty}
          </Typography>
        ) : (
          messages.map(renderMessage)
        )}
        {isSending ? (
          <Box sx={{ alignSelf: "flex-start" }} aria-label={s.simulatorTyping}>
            <Skeleton variant="rounded" width={140} height={36} />
          </Box>
        ) : null}
        <div ref={endRef} />
      </Stack>
      {error != null ? (
        <Alert severity="error" role="alert">
          {error}
        </Alert>
      ) : null}
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextField
          id="lead-assistant-simulator-input"
          label={s.simulatorInputLabel}
          value={input}
          onChange={(event) => setInput(event.target.value.slice(0, MAX_MESSAGE_CHARS))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              handleSend()
            }
          }}
          helperText={s.simulatorInputHelper(input.length, MAX_MESSAGE_CHARS)}
          multiline
          maxRows={4}
          fullWidth
          size="small"
        />
        <IconButton
          color="primary"
          aria-label={s.simulatorSend}
          onClick={handleSend}
          disabled={trimmed.length === 0 || isSending}
          sx={{ mt: 0.25 }}
        >
          <SendOutlined />
        </IconButton>
      </Stack>
    </Stack>
  )
}
