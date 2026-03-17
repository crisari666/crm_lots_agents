import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from "@mui/material"
import { useCallback, useState } from "react"
import type { OnboardingStateType } from "../types/onboarding-state.types"
import {
  sendGreetingTemplateReq,
  sendProposalTemplateReq
} from "../services/ws-cloud-ms.service"
import {
  buildIniciarLlamadaPayload,
  iniciarLlamadaReq
} from "../services/voice-agent.service"
import { phoneToE164, phoneToWhatsAppTo } from "../utils/onboarding-phone.utils"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"

type Props = {
  open: boolean
  onClose: () => void
  item: OnboardingStateType | null
}

const fromNumber = (import.meta.env.VITE_VOICE_AGENT_FROM_NUMBER as string)?.trim?.() ?? ""
const MOCK_VOICE_AGENT_ID = "888"

export default function UsersOnboardingStatusActionsDialogCP({ open, onClose, item }: Props) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  )

  const user = item?.userId
  const displayName = user ? `${user.name} ${user.lastName}`.trim() : ""
  const firstName = user?.name?.trim() || "Customer"

  const resetFeedback = useCallback(() => setFeedback(null), [])

  const handleGreeting = async () => {
    if (!user) return
    const to = phoneToWhatsAppTo(user.phone)
    if (!to) {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("greeting")
    try {
      await sendGreetingTemplateReq({
        to,
        userId: user._id,
        name: firstName
      })
      setFeedback({ type: "success", text: s.success })
    } catch {
      setFeedback({ type: "error", text: s.errorGeneric })
    } finally {
      setLoadingKey(null)
    }
  }

  const handleProposal = async () => {
    if (!user) return
    const to = phoneToWhatsAppTo(user.phone)
    if (!to) {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("proposal")
    try {
      await sendProposalTemplateReq({
        to,
        code: user._id,
        name: firstName
      })
      setFeedback({ type: "success", text: s.success })
    } catch {
      setFeedback({ type: "error", text: s.errorGeneric })
    } finally {
      setLoadingKey(null)
    }
  }

  const handleCall = async () => {
    if (!user) return
    if (!fromNumber) {
      setFeedback({ type: "error", text: s.missingVoiceConfig })
      return
    }
    const toNumber = phoneToE164(user.phone)
    if (!toNumber || toNumber === "+") {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("call")
    try {
      const payload = buildIniciarLlamadaPayload({
        fromNumber,
        toNumber,
        customer_name: firstName,
        customer_id: user._id,
        agentId: MOCK_VOICE_AGENT_ID
      })
      await iniciarLlamadaReq(payload)
      setFeedback({ type: "success", text: s.success })
    } catch {
      setFeedback({ type: "error", text: s.errorGeneric })
    } finally {
      setLoadingKey(null)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {s.actionsDialogTitle}
        {user ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {s.userLabel}: {displayName}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent dividers>
        {feedback ? (
          <Alert severity={feedback.type} sx={{ mb: 2 }} onClose={() => setFeedback(null)}>
            {feedback.text}
          </Alert>
        ) : null}
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            disabled={loadingKey !== null || !user}
            onClick={handleGreeting}
          >
            {loadingKey === "greeting" ? s.sending : s.triggerGreeting}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={loadingKey !== null || !user}
            onClick={handleCall}
          >
            {loadingKey === "call" ? s.sending : s.triggerCall}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loadingKey !== null || !user}
            onClick={handleProposal}
          >
            {loadingKey === "proposal" ? s.sending : s.triggerProposal}
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {s.close}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
