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
