import { customersMsAxios } from "../../../app/customers-ms-http"

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

export async function createCustomerAdmin(
  body: CreateCustomerAdminBody
): Promise<unknown> {
  const response = await customersMsAxios.post<unknown>("admin/customer", body)
  return response.data
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
  createdAt: string
}

export type CustomerAdminListResponse = {
  items: CustomerAdminListItem[]
  total: number
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
  search?: string
  /** Filter list to customers currently on this pipeline step. */
  customerStepId?: string
  limit?: number
  skip?: number
}

export async function listCustomersAdmin(
  params: ListCustomersAdminParams
): Promise<CustomerAdminListResponse> {
  const response = await customersMsAxios.get<CustomerAdminListResponse>(
    "admin/customer",
    { params }
  )
  return response.data
}

export async function assignCustomerAssignee(
  customerId: string,
  assignedTo: string
): Promise<unknown> {
  const response = await customersMsAxios.patch<unknown>(
    `admin/customer/${encodeURIComponent(customerId)}/assignee`,
    { assignedTo }
  )
  return response.data
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
  createdBy: string
  createdAt: string
  updatedAt?: string
  notes: CustomerAdminNote[]
}

export async function getCustomerAdminDetail(
  customerId: string
): Promise<CustomerAdminDetail> {
  const response = await customersMsAxios.get<CustomerAdminDetail>(
    `admin/customer/${encodeURIComponent(customerId)}`
  )
  return response.data
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
}

export async function updateCustomerAdmin(
  customerId: string,
  body: UpdateCustomerAdminBody
): Promise<CustomerAdminDetail> {
  const response = await customersMsAxios.patch<CustomerAdminDetail>(
    `admin/customer/${encodeURIComponent(customerId)}`,
    body
  )
  return response.data
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

export async function listCustomerCallLogs(customerId: string): Promise<CustomerCallLogAdminItem[]> {
  const response = await customersMsAxios.get<CustomerCallLogAdminItem[]>(
    `admin/customer/${encodeURIComponent(customerId)}/call-logs`
  )
  return response.data
}

export async function listCallLogsAdmin(
  params: ListCallLogsAdminParams
): Promise<ListCallLogsAdminResponse> {
  const response = await customersMsAxios.get<ListCallLogsAdminResponse>("admin/customer/call-logs", {
    params,
  })
  return response.data
}
