export type ActiveLiveCallItem = {
  callSid: string
  conferenceName: string
  agentCallSid: string
  agentExternalRef?: string
  customerExternalRef?: string
  to: string
  from: string
  status: string
  startedAt: string
  coachConnected: boolean
  coachCount: number
}

export type CoachSessionResult = {
  callSid: string
  conferenceName: string
  agentCallSid: string
  agentExternalRef?: string
  customerExternalRef?: string
  to: string
  from: string
  status: string
}

export type VoipListResponse<T> = {
  message: string
  result: T
}

export type VoipTokenResult = {
  tokenJWT: string
  token: unknown
}
