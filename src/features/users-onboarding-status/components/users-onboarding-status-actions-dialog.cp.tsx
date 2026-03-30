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
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingStatusSendProposalCP from "./users-onboarding-status-send-proposal.cp"
import UsersOnboardingStatusTriggerOnboardingFlowCP from "./users-onboarding-status-trigger-onboarding-flow.cp"
import UsersOnboardingStatusSendGreetingCP from "./users-onboarding-status-send-greeting.cp"
import UsersOnboardingStatusTriggerCallCP from "./users-onboarding-status-trigger-call.cp"
import type { ActionFeedbackType } from "./users-onboarding-status-actions.types"

type Props = {
  open: boolean
  onClose: () => void
  item: OnboardingStateType | null
}

export default function UsersOnboardingStatusActionsDialogCP({ open, onClose, item }: Props) {
  const [loadingKey, setLoadingKey] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<ActionFeedbackType | null>(null)

  const user = item?.userId
  const displayName = user ? `${user.name} ${user.lastName}`.trim() : ""
  const firstName = user?.name?.trim() || "Customer"

  const resetFeedback = useCallback(() => setFeedback(null), [])

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
          <UsersOnboardingStatusTriggerOnboardingFlowCP
            user={user}
            loadingKey={loadingKey}
            setLoadingKey={setLoadingKey}
            resetFeedback={resetFeedback}
            setFeedback={setFeedback}
            displayName={displayName}
            firstName={firstName}
          />
          <UsersOnboardingStatusSendGreetingCP
            user={user}
            loadingKey={loadingKey}
            setLoadingKey={setLoadingKey}
            resetFeedback={resetFeedback}
            setFeedback={setFeedback}
            firstName={firstName}
          />
          <UsersOnboardingStatusTriggerCallCP
            user={user}
            loadingKey={loadingKey}
            setLoadingKey={setLoadingKey}
            resetFeedback={resetFeedback}
            setFeedback={setFeedback}
            firstName={firstName}
          />
          <UsersOnboardingStatusSendProposalCP
            open={open}
            user={user}
            firstName={firstName}
            loadingKey={loadingKey}
            setLoadingKey={setLoadingKey}
            resetFeedback={resetFeedback}
            setFeedback={setFeedback}
          />
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
