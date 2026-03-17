export type OnboardingStatusType =
  | "Imported"
  | "WS_sent"
  | "interested"
  | "call_programmed"
  | "Capacitacion"

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
