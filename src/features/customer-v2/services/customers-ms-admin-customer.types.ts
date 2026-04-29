export type CreateCustomerAdminBody = {
  phone: string
  name?: string
  lastName?: string
  email?: string
  user?: string
  /** Initial CRM note → CustomerDescription on customer */
  note?: string
  /** First interestedProjects[].projectId */
  projectId?: string
}

/** Fields returned by `GET /customer/admin` for the admin table. */
export type CustomerAdminListItem = {
  id: string
  name?: string
  lastName?: string
  phone: string
  email?: string
  assignedTo?: string
  /** Office user id who created the customer (customers-ms). */
  createdBy?: string
  /** Current pipeline step id when set. */
  customerStepId?: string
  /** Current pipeline step name. */
  currentStep?: string
  /** Color from customer_steps when available. */
  currentStepColor?: string
  /** False when customer disabled in customers-ms. */
  enabled: boolean
  /** True when created from referral flow. */
  isReferral: boolean
  createdAt: string
}

export type CustomerAdminListResponse = {
  items: CustomerAdminListItem[]
  total: number
  stepDistribution: CustomerStepDistributionItem[]
}

export type CustomerStepDistributionItem = {
  customerStepId: string | null
  name: string
  color?: string
  count: number
}

export type ListCustomersAdminParams = {
  /** When true, ignores creation date bounds and queries the full collection (by other filters). */
  omitDateRange?: boolean
  createdFrom?: string
  createdTo?: string
  assignedTo?: string
  /** When true (and no `assignedTo`), only customers with no assignee. */
  unassignedOnly?: boolean
  /** When true, only active customers (`enabled !== false`, includes legacy docs). Omit = no filter. */
  enabled?: boolean
  /** When set, filter by referral flag. */
  isReferral?: boolean
  search?: string
  /** Filter list to customers currently on this pipeline step. */
  customerStepId?: string
  limit?: number
  skip?: number
}

export type CustomerAdminNote = {
  id: string
  user: string
  date: string
  description: string
}

export type CustomerAdminInterestedProject = {
  projectId: string
  date: string
  addedBy?: string
}

/** Matches `GET admin/customer/:id` and `PATCH` response body. */
export type CustomerAdminDetail = {
  id: string
  name?: string
  lastName?: string
  phone: string
  whatsapp?: string
  email?: string
  documentType?: "cc" | "passport"
  document?: string
  interestedProjects: CustomerAdminInterestedProject[]
  assignedTo?: string
  enabled: boolean
  isReferral: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
  notes: CustomerAdminNote[]
}

export type UpdateCustomerAdminBody = {
  name?: string
  lastName?: string
  phone?: string
  whatsapp?: string
  email?: string
  documentType?: "cc" | "passport"
  document?: string
  interestedProjects?: { projectId: string; date?: string }[]
  assignedTo?: string
  enabled?: boolean
  isReferral?: boolean
}

export type CustomerCallLogAdminOutcome =
  | "answered"
  | "busy"
  | "no_answer"
  | "failed"
  | "canceled"
  | "ringing"
  | "in_progress"
  | "unknown"

export type CustomerCallLogAdminEvent = {
  eventType: string
  timestamp: string
  status?: string
  durationSeconds?: number
  recordingUrl?: string
  transcript?: string
  metadata?: Record<string, unknown>
}

export type CustomerCallLogAdminItem = {
  id: string
  callSid: string
  provider: string
  from?: string
  to?: string
  direction?: string
  durationSeconds?: number
  recordingUrl?: string
  transcript?: string
  text?: string
  status?: string
  customerId?: string
  customerExternalRef?: string
  agentExternalRef?: string
  resolvedOutcome: CustomerCallLogAdminOutcome
  preCompleteEventType?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  events: CustomerCallLogAdminEvent[]
}

export type ListCallLogsAdminParams = {
  callFrom?: string
  callTo?: string
  outcome?: "all" | "answered" | "busy" | "no_answer"
  limit?: number
  skip?: number
}

export type ListCallLogsAdminResponse = {
  items: CustomerCallLogAdminItem[]
  total: number
}

export type CustomerEventType =
  | "WHATSAPP_CALL"
  | "WHATSAPP_MESSAGE"
  | "PHONE_CALL"
  | "VIDEO_CALL"
  | "CALL_CRM"

export type CustomerEventItem = {
  id: string
  eventType: CustomerEventType
  description: string
  score?: number
  customerId: string
  userId: string
  officeId?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type ListCustomerEventsParams = {
  customerId?: string
  dateFrom?: string
  dateTo?: string
  eventType?: CustomerEventType
  officeId?: string
  userId?: string
  limit?: 100 | 200 | 500
  skip?: number
}

export type ListCustomerEventsResponse = {
  items: CustomerEventItem[]
  total: number
  limit: number
  skip: number
}
