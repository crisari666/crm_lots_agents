export type LeadLifecycleStatus = "lead" | "customer"

export type LeadSource =
  | "meta_form"
  | "whatsapp_lead_conversation"
  | "whatsapp_inbound"
  | "manual"
  | "webinar"

export type LeadSessionSummary = {
  sessionId: string
  status: string
  score?: number
  priority?: number
  step?: string
}

export type LeadListItem = {
  id: string
  name: string
  lastName: string
  phone: string
  lifecycleStatus: LeadLifecycleStatus
  leadSources: LeadSource[]
  isPromoted: boolean
  assignedTo?: string
  metaLeadgenId?: string
  createdAt: string
  leadSession?: LeadSessionSummary
}

export type LeadListPage = {
  items: LeadListItem[]
  total: number
  page: number
  limit: number
}

export type ListLeadsParams = {
  page: number
  limit: number
  lifecycleStatus?: LeadLifecycleStatus | ""
  source?: LeadSource | ""
  assignedTo?: string
  search?: string
  from?: string
  to?: string
}
