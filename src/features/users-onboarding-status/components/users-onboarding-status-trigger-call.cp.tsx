import { Button } from "@mui/material"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { startOnboardingVoiceCallReq } from "../services/onboarding-state.service"
import {
  fetchUsersOnboardingStatusThunk,
  selectUsersOnboardingStatusState
} from "../slice/users-onboarding-status.slice"
import { phoneToE164 } from "../utils/onboarding-phone.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

const LIST_REFRESH_DELAY_MS = 2000

type Props = OnboardingDialogActionProps & {
  displayName: string
  firstName: string
}

export default function UsersOnboardingStatusTriggerCallCP({
  user,
  loadingKey,
  setLoadingKey,
  resetFeedback,
  setFeedback,
  displayName,
  firstName
}: Props) {
  const dispatch = useAppDispatch()
  const { statusFilter, lastUpdateFrom, lastUpdateTo, includeSpecificUpdate, containsStatusInLogs } =
    useAppSelector(selectUsersOnboardingStatusState)

  const refreshListSoon = useCallback(() => {
    const status = statusFilter === "all" ? undefined : statusFilter
    window.setTimeout(() => {
      dispatch(
        fetchUsersOnboardingStatusThunk({
          status,
          lastUpdateFrom,
          lastUpdateTo,
          includeSpecificUpdate,
          containsStatusInLogs
        })
      )
    }, LIST_REFRESH_DELAY_MS)
  }, [dispatch, includeSpecificUpdate, containsStatusInLogs, statusFilter, lastUpdateFrom, lastUpdateTo])

  const onTriggerCall = async () => {
    if (!user) return
    const phoneNumber = phoneToE164(user.phone)
    if (!phoneNumber || phoneNumber === "+") {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("call")
    try {
      const name = displayName.trim() || firstName
      const res = await startOnboardingVoiceCallReq({
        userId: user._id,
        name,
        phoneNumber,
        contactName: firstName
      })
      setFeedback({
        type: "success",
        text: res.voiceCallDispatchedToAgent
          ? s.voiceCallStartSuccessDispatched(res.flowId)
          : s.voiceCallStartSuccessScheduled(res.flowId)
      })
      refreshListSoon()
    } catch (err) {
      const text = err instanceof Error && err.message ? err.message : s.errorGeneric
      setFeedback({ type: "error", text })
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
