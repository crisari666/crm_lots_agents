export type LeadCallStatus = "pending" | "done" | "cancelled"

export type LeadCallSource = "manual" | "lead_conversation"

export type LeadCallPeriod = "morning" | "afternoon" | "night"

export type LeadCallItem = {
  eventId: string
  scheduledAt: string
  status: LeadCallStatus
  source: LeadCallSource
  userId: string
  ventorName: string
  customerId: string
  customerName: string
  phone: string
  sessionId?: string
  score?: number
  maxScore: number
  priority?: number
  projectTitle?: string
  note?: string
}

export type LeadCallVentor = {
  id: string
  name: string
}

export type ListLeadCallsParams = {
  from: string
  to: string
  userId?: string
  status?: LeadCallStatus
}

export type LeadCallEditableStatus = Exclude<LeadCallStatus, "pending">
