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
  Typography
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { dateUTCToFriendly } from "../../../utils/date.utils"
import {
  digitsOnlyPhone,
  findWhatsappChatByPhoneDigits,
  loadWhatsappChatMessagesForDisplay
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

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setMessages([])
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
        const items = await loadWhatsappChatMessagesForDisplay(chat.id)
        if (cancelled) {
          return
        }
        setMessages(items)
      } catch {
        if (!cancelled) {
          setError(s.whatsappChatError)
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
      <DialogContent dividers sx={{ minHeight: 320, p: 2 }}>
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

        {!isLoading && error == null && messages.length > 0 ? (
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{s.close}</Button>
      </DialogActions>
    </Dialog>
  )
}
