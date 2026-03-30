import { Button } from "@mui/material"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import {
  buildIniciarLlamadaPayload,
  iniciarLlamadaReq
} from "../services/voice-agent.service"
import { phoneToE164 } from "../utils/onboarding-phone.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

type Props = OnboardingDialogActionProps & {
  firstName: string
}

const fromNumber = (import.meta.env.VITE_VOICE_AGENT_FROM_NUMBER as string)?.trim?.() ?? ""
const MOCK_VOICE_AGENT_ID = "888"

export default function UsersOnboardingStatusTriggerCallCP({
  user,
  loadingKey,
  setLoadingKey,
  resetFeedback,
  setFeedback,
  firstName
}: Props) {
  const onTriggerCall = async () => {
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
    <Button
      variant="contained"
      color="secondary"
      disabled={loadingKey !== null || !user}
      onClick={onTriggerCall}
    >
      {loadingKey === "call" ? s.sending : s.triggerCall}
    </Button>
  )
}
