import { Button } from "@mui/material"
import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import { sendConfirmarCapacitacionReq } from "../services/onboarding-state.service"
import {
  fetchUsersOnboardingStatusThunk,
  selectUsersOnboardingStatusState
} from "../slice/users-onboarding-status.slice"
import { phoneToWhatsAppTo } from "../utils/onboarding-phone.utils"
import type { OnboardingDialogActionProps } from "./users-onboarding-status-actions.types"

const LIST_REFRESH_DELAY_MS = 2000

type Props = OnboardingDialogActionProps & {
  displayName: string
  firstName: string
}

export default function UsersOnboardingStatusSendConfirmarCapacitacionCP({
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
    window.setTimeout(() => {
      dispatch(
        fetchUsersOnboardingStatusThunk({
          statuses: statusFilter,
          lastUpdateFrom,
          lastUpdateTo,
          includeSpecificUpdate,
          containsStatusInLogs
        })
      )
    }, LIST_REFRESH_DELAY_MS)
  }, [dispatch, includeSpecificUpdate, containsStatusInLogs, statusFilter, lastUpdateFrom, lastUpdateTo])

  const onSend = async () => {
    if (!user) return
    const phoneNumber = phoneToWhatsAppTo(user.phone)
    if (!phoneNumber) {
      setFeedback({ type: "error", text: s.missingPhone })
      return
    }
    resetFeedback()
    setLoadingKey("confirmarCapacitacion")
    try {
      const res = await sendConfirmarCapacitacionReq({
        userId: user._id,
        name: displayName.trim() || firstName,
        phoneNumber
      })
      setFeedback({ type: "success", text: s.sendConfirmarCapacitacionSuccess(res.flowId) })
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
      color="primary"
      disabled={loadingKey !== null || !user}
      onClick={onSend}
    >
      {loadingKey === "confirmarCapacitacion" ? s.sending : s.sendConfirmarCapacitacion}
    </Button>
  )
}
