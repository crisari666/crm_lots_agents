import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type { LeadListItem, LeadListPage, ListLeadsParams } from "../types/leads.types"

const BASE_PATH = "admin/customer/leads"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function listAdminLeads(params: ListLeadsParams): Promise<LeadListPage> {
  const response = await customersMsAxios.get<LeadListPage>(BASE_PATH, {
    ...auth(),
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.lifecycleStatus ? { lifecycleStatus: params.lifecycleStatus } : {}),
      ...(params.source ? { source: params.source } : {}),
      ...(params.assignedTo?.trim() ? { assignedTo: params.assignedTo.trim() } : {}),
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      ...(params.from ? { from: params.from } : {}),
      ...(params.to ? { to: params.to } : {}),
    },
  })
  return response.data
}

export async function convertAdminLead(
  customerId: string,
  assignToUserId?: string
): Promise<LeadListItem> {
  const response = await customersMsAxios.post<LeadListItem>(
    `${BASE_PATH}/${encodeURIComponent(customerId)}/convert`,
    assignToUserId?.trim() ? { assignToUserId: assignToUserId.trim() } : {},
    auth()
  )
  return response.data
}
