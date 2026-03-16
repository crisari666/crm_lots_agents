import type { OnboardingStateType, OnboardingStatusType } from "../types/onboarding-state.types"

export type UsersOnboardingStatusState = {
  items: OnboardingStateType[]
  isLoading: boolean
  error: string | null
  statusFilter: OnboardingStatusType | "all"
  searchTerm: string
}

