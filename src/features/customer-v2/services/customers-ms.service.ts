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
  const response = await customersMsAxios.post<unknown>("customer/admin", body)
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
  /** False when customer disabled in customers-ms. */
  enabled: boolean
  createdAt: string
}

export type CustomerAdminListResponse = {
  items: CustomerAdminListItem[]
  total: number
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
  limit?: number
  skip?: number
}

export async function listCustomersAdmin(
  params: ListCustomersAdminParams
): Promise<CustomerAdminListResponse> {
  const response = await customersMsAxios.get<CustomerAdminListResponse>(
    "customer/admin",
    { params }
  )
  return response.data
}
