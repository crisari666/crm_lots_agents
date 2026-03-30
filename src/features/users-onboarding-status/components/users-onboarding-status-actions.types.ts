import type { OnboardingStateType } from "../types/onboarding-state.types"

export type ActionFeedbackType = {
  type: "success" | "error"
  text: string
}

export type OnboardingDialogActionProps = {
  user: OnboardingStateType["userId"] | undefined
  loadingKey: string | null
  setLoadingKey: (key: string | null) => void
  resetFeedback: () => void
  setFeedback: (feedback: ActionFeedbackType) => void
}
