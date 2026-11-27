import type { LeadProfile, LeadProfileStage, LeadTemperature } from "../../lead-assistant/types/lead-assistant.types"

export type LeadConversationFlowVersion = "v1" | "v2"

export type LeadConversationFlowFilter = LeadConversationFlowVersion | ""

export type LeadConversationStep =
  | "initial"
  | "ask_project"
  | "ask_lot_range"
  | "ask_payment"
  | "ask_schedule"
  | "ask_call_slot"
  | "reminder_sent"
  | "scheduled"
  | "closed"
  | "v2_conversation"

export type LeadConversationStatus = "active" | "scheduled" | "disqualified" | "abandoned"

/** customers-ms `GET admin/customer/lead-conversations/sessions` row. */
export type LeadConversationListItem = {
  sessionId: string
  customerId: string
  customerName: string
  phone: string
  whatsappUsername?: string
  projectTitle?: string
  isAllProjects: boolean
  step: LeadConversationStep
  status: LeadConversationStatus
  score: number
  maxScore: number
  priority: number
  lastInboundAt?: string
  startedAt?: string
  /** Absent on legacy rows → treated as v1. */
  flowVersion?: LeadConversationFlowVersion
  temperature?: LeadTemperature
  stage?: LeadProfileStage
  profile?: LeadProfile
}

export type ListLeadConversationsParams = {
  status?: LeadConversationStatus
  step?: LeadConversationStep
  flow?: LeadConversationFlowVersion
  search?: string
  projectId?: string
  page: number
  limit: number
}

export type ListLeadConversationsResponse = {
  items: LeadConversationListItem[]
  total: number
  page: number
  limit: number
}

export type LeadConversationMessage = {
  id: string
  direction: "inbound" | "outbound"
  kind: string
  body: string
  options: string[]
  mediaUrl?: string
  delivered: boolean
  templateName?: string
  deliveryStatus?: "sent" | "delivered" | "read" | "failed"
  timestamp: string
}

/** Messages ordered oldest → newest; `nextBefore` loads older pages. */
export type LeadConversationMessagesPage = {
  items: LeadConversationMessage[]
  nextBefore?: string
}

export type RestartLeadConversationResponse = {
  restarted: true
  sent: boolean
  reason?: "outside_customer_service_window" | "v2_waits_for_customer"
}

/** customers-ms `GET admin/customer/lead-conversations/sessions/stats` bucket. */
export type LeadConversationStatsBucket = {
  key: string
  count: number
}

export type LeadConversationStatsParams = {
  from: string
  to: string
}

export type LeadConversationStatsResponse = {
  total: number
  byStep: LeadConversationStatsBucket[]
  byTemperature: LeadConversationStatsBucket[]
}
