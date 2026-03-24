export type OnboardingStatusType =
  | "Imported"
  | "WS_sent"
  | "Interested"
  | "Call_programmed"
  | "Call_done_success"
  | "Call_failed"
  | "WS_training_sent"
  | "Confirmed_training_request"

export type OnboardingUserType = {
  _id: string
  email: string
  name: string
  phone: string
  lastName: string
}

export type OnboardingLogUpdateType = {
  date: string
  status: string
}

export type OnboardingStateType = {
  userId: OnboardingUserType
  createdAt: string
  lastUpdate: string
  status: string
  logsUpdate: OnboardingLogUpdateType[]
}

export type OnboardingStateListResponse = {
  result: OnboardingStateType[]
  message: string
  error?: string
}

export type OnboardingTriggerResponse = {
  flowId: string
  message: string
}

/** `GET /onboarding-state/user/:userId/flows` → `result.flows[]` */
export type OnboardingFlowSummaryType = {
  flowId: string
  date: string
  currentStatus: string
  lastEventAt: string
}

export type OnboardingUserFlowsListResponse = {
  result: { flows: OnboardingFlowSummaryType[] }
  message: string
  error?: string
}

export type OnboardingFlowWhatsappMessageIds = {
  greetingMessageId?: string
  videoMessageId?: string
  trainingMessageId?: string
  callNotificationMessageId?: string
}

export type OnboardingFlowEventItemType = {
  date: string
  event: string
  details?: Record<string, unknown>
}

/** `GET /onboarding-state/pipeline/:flowId/logs` — body is not wrapped in `result` */
export type OnboardingFlowDetailType = {
  flowId: string
  userId: string
  phoneNumber: string
  name: string
  whatsappMessageIds: OnboardingFlowWhatsappMessageIds
  createdAt: string | null
  updatedAt: string | null
  events: OnboardingFlowEventItemType[]
}
