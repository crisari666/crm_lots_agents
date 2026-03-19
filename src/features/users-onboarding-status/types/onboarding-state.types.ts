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
