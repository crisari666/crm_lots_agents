import type {
  OnboardingFlowDetailType,
  OnboardingFlowSummaryType,
  OnboardingStateType,
  OnboardingStatusType
} from "../types/onboarding-state.types"

export type UsersOnboardingHistoryFlowsState = {
  userId: string | null
  items: OnboardingFlowSummaryType[]
  isLoading: boolean
  error: string | null
}

export type UsersOnboardingHistoryFlowLogsState = {
  flowId: string | null
  detail: OnboardingFlowDetailType | null
  isLoading: boolean
  error: string | null
}

export type UsersOnboardingStatusState = {
  items: OnboardingStateType[]
  isLoading: boolean
  error: string | null
  statusFilter: OnboardingStatusType | "all"
  includeSpecificUpdate: boolean
  lastUpdateFrom: string
  lastUpdateTo: string
  searchTerm: string
  selectedOrphanRowIds: string[]
  /** `userId._id` values for bulk recreate-schedules */
  selectedRescheduleUserIds: string[]
  bulkDeleteFlowsLoading: boolean
  bulkRecreateSchedulesLoading: boolean
  historyFlows: UsersOnboardingHistoryFlowsState
  historyFlowLogs: UsersOnboardingHistoryFlowLogsState
}

