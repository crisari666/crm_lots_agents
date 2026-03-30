import { Button } from "@mui/material"
import { useAppDispatch } from "../../../app/hooks"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { triggerOnboardingFlowThunk } from "../slice/users-onboarding-status.slice"
import { phoneToWhatsAppTo } from "../utils/onboarding-phone.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

type Props = OnboardingDialogActionProps & {
  displayName: string
  firstName: string
}

export default function UsersOnboardingStatusTriggerOnboardingFlowCP({
  user,
  loadingKey,
  setLoadingKey,
  resetFeedback,
  setFeedback,
  displayName,
  firstName
}: Props) {
  const dispatch = useAppDispatch()

  const onTriggerOnboardingFlow = async () => {
    if (!user) return
    const phoneNumber = phoneToWhatsAppTo(user.phone)
    if (!phoneNumber) {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("onboardingFlow")
    try {
      await dispatch(
        triggerOnboardingFlowThunk({
          userId: user._id,
          phoneNumber,
          name: displayName || firstName
        })
      ).unwrap()
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
      onClick={onTriggerOnboardingFlow}
    >
      {loadingKey === "onboardingFlow" ? s.sending : s.triggerOnboardingFlow}
    </Button>
  )
}
