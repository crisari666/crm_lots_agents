import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import {
  digitsOnlyPhone,
  findWhatsappChatByPhoneDigits,
  loadWhatsappChatMessagesForDisplay,
  sendWhatsappChatTextMessageReq
} from "../services/whatsapp-chat.service"
import type { OnboardingUserType } from "../types/onboarding-state.types"
import type { WhatsappChatMessageType } from "../types/whatsapp-chat.types"

type UsersOnboardingWhatsappChatDialogCPProps = {
  open: boolean
  onClose: () => void
  user: OnboardingUserType | null
}

function messageBodyText(m: WhatsappChatMessageType): string {
  const text = m.textBody?.trim()
  if (text) {
    return text
  }
  const cap = m.caption?.trim()
  if (cap) {
    return cap
  }
  if (m.type === "text") {
    return "—"
  }
  return s.whatsappChatMessageOtherType(m.type)
}

export default function UsersOnboardingWhatsappChatDialogCP({
  open,
  onClose,
  user
}: UsersOnboardingWhatsappChatDialogCPProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<WhatsappChatMessageType[]>([])
  const [chatId, setChatId] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setMessages([])
    setChatId(null)
    setDraft("")
    setIsSending(false)
    setSendError(null)
  }, [])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [onClose, reset])

  useEffect(() => {
    if (!open || user == null) {
      return
    }

    const phoneDigits = digitsOnlyPhone(user.phone ?? "")
    if (phoneDigits === "") {
      setError(s.whatsappChatNoPhone)
      setMessages([])
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)
    setMessages([])
    setChatId(null)
    setSendError(null)

    ;(async () => {
      try {
        const chat = await findWhatsappChatByPhoneDigits(phoneDigits)
        if (cancelled) {
          return
        }
        if (chat == null) {
          setError(s.whatsappChatNotFound)
          setIsLoading(false)
          return
        }
        setChatId(chat.id)
        try {
          const items = await loadWhatsappChatMessagesForDisplay(chat.id)
          if (cancelled) {
            return
          }
          setMessages(items)
        } catch {
          if (!cancelled) {
            setError(s.whatsappChatError)
          }
        }
      } catch {
        if (!cancelled) {
          setError(s.whatsappChatError)
          setChatId(null)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open, user])

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const titleUser =
    user != null ? `${user.name} ${user.lastName}`.trim() || user.email : ""

  const handleSend = useCallback(async () => {
    const text = draft.trim()
    if (text === "" || chatId == null || isSending) {
      return
    }
    setIsSending(true)
    setSendError(null)
    try {
      await sendWhatsappChatTextMessageReq(chatId, text)
      setDraft("")
      const items = await loadWhatsappChatMessagesForDisplay(chatId)
      setMessages(items)
    } catch {
      setSendError(s.whatsappChatSendError)
    } finally {
      setIsSending(false)
    }
  }, [chatId, draft, isSending])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
      <DialogTitle>
        {s.whatsappChatDialogTitle}
        {titleUser !== "" ? (
          <Typography component="span" variant="body2" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
            {titleUser}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", p: 0, overflow: "hidden", minHeight: 320 }}>
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={36} aria-label={s.whatsappChatLoading} />
            </Box>
          ) : null}

          {!isLoading && error != null ? <Alert severity="warning">{error}</Alert> : null}

          {!isLoading && error == null && messages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {s.whatsappChatEmpty}
            </Typography>
          ) : null}

          {!isLoading && messages.length > 0 ? (
            <Stack spacing={1.5}>
              {messages.map((m) => {
                const inbound = m.direction === "inbound"
                return (
                  <Box
                    key={m.id}
                    sx={{
                      display: "flex",
                      justifyContent: inbound ? "flex-start" : "flex-end",
                      width: "100%"
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: "85%",
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: inbound ? "grey.200" : "primary.main",
                        color: inbound ? "text.primary" : "primary.contrastText"
                      }}
                    >
                      <Typography variant="caption" sx={{ opacity: 0.85, display: "block", mb: 0.25 }}>
                        {inbound ? s.whatsappChatUserBubble : s.whatsappChatSystemBubble} ·{" "}
                        {dateUTCToFriendly(m.timestamp)}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {messageBodyText(m)}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          ) : null}
        </Box>

        {chatId != null && !isLoading ? (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              flexShrink: 0
            }}
          >
            {sendError != null ? (
              <Alert severity="error" sx={{ mb: 1 }} onClose={() => setSendError(null)}>
                {sendError}
              </Alert>
            ) : null}
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                size="small"
                placeholder={s.whatsappChatMessagePlaceholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    void handleSend()
                  }
                }}
                disabled={isSending}
                aria-label={s.whatsappChatMessagePlaceholder}
              />
              <Button
                variant="contained"
                disabled={isSending || draft.trim() === ""}
                onClick={() => void handleSend()}
                sx={{ flexShrink: 0 }}
              >
                {isSending ? <CircularProgress size={22} color="inherit" /> : s.whatsappChatSend}
              </Button>
            </Stack>
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{s.close}</Button>
      </DialogActions>
    </Dialog>
  )
}
