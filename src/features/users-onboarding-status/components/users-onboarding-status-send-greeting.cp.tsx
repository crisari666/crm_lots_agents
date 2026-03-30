import { Button } from "@mui/material"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { sendGreetingTemplateReq } from "../services/ws-cloud-ms.service"
import { phoneToWhatsAppTo } from "../utils/onboarding-phone.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

type Props = OnboardingDialogActionProps & {
  firstName: string
}

export default function UsersOnboardingStatusSendGreetingCP({
  user,
  loadingKey,
  setLoadingKey,
  resetFeedback,
  setFeedback,
  firstName
}: Props) {
  const onSendGreeting = async () => {
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

  return (
    <Button
      variant="contained"
      color="primary"
      disabled={loadingKey !== null || !user}
      onClick={onSendGreeting}
    >
      {loadingKey === "greeting" ? s.sending : s.triggerGreeting}
    </Button>
  )
}
