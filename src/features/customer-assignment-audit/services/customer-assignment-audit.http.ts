import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  ListCustomerAssignmentChangesParams,
  ListCustomerAssignmentChangesResponse,
} from "../types/customer-assignment-audit.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function listCustomerAssignmentChanges(
  params: ListCustomerAssignmentChangesParams
): Promise<ListCustomerAssignmentChangesResponse> {
  const response = await customersMsAxios.get<ListCustomerAssignmentChangesResponse>(
    "admin/customer/assignment-changes",
    { ...auth(), params }
  )
  return response.data
}
