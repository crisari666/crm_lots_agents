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

export type LeadConversationStatus = "active" | "scheduled" | "disqualified" | "abandoned"

/** customers-ms `GET admin/customer/lead-conversations/sessions` row. */
export type LeadConversationListItem = {
  sessionId: string
  customerId: string
  customerName: string
  phone: string
  projectTitle?: string
  isAllProjects: boolean
  step: LeadConversationStep
  status: LeadConversationStatus
  score: number
  maxScore: number
  priority: number
  lastInboundAt?: string
  startedAt?: string
}

export type ListLeadConversationsParams = {
  status?: LeadConversationStatus
  step?: LeadConversationStep
  search?: string
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
  reason?: "outside_customer_service_window"
}
