import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateCustomerAdminBody,
  CustomerAdminDetail,
  CustomerAdminListResponse,
  CustomerCallLogAdminItem,
  ListCallLogsAdminParams,
  ListCallLogsAdminResponse,
  ListCustomerEventsParams,
  ListCustomerEventsResponse,
  ListCustomersAdminParams,
  StaffPerformanceReportBody,
  StaffPerformanceReportDto,
  UpdateCustomerAdminBody,
} from "./customers-ms-admin-customer.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function createCustomerAdmin(body: CreateCustomerAdminBody): Promise<unknown> {
  const response = await customersMsAxios.post<unknown>("admin/customer", body, auth())
  return response.data
}

export async function listCustomersAdmin(
  params: ListCustomersAdminParams
): Promise<CustomerAdminListResponse> {
  const response = await customersMsAxios.get<CustomerAdminListResponse>("admin/customer", {
    params,
    ...auth(),
  })
  return response.data
}

export async function assignCustomerAssignee(
  customerId: string,
  assignedTo: string
): Promise<unknown> {
  const response = await customersMsAxios.patch<unknown>(
    `admin/customer/${encodeURIComponent(customerId)}/assignee`,
    { assignedTo },
    auth()
  )
  return response.data
}

export async function getCustomerAdminDetail(customerId: string): Promise<CustomerAdminDetail> {
  const response = await customersMsAxios.get<CustomerAdminDetail>(
    `admin/customer/${encodeURIComponent(customerId)}`,
    auth()
  )
  return response.data
}

export async function updateCustomerAdmin(
  customerId: string,
  body: UpdateCustomerAdminBody
): Promise<CustomerAdminDetail> {
  const response = await customersMsAxios.patch<CustomerAdminDetail>(
    `admin/customer/${encodeURIComponent(customerId)}`,
    body,
    auth()
  )
  return response.data
}

export async function updateCustomerReferral(
  customerId: string,
  isReferral: boolean
): Promise<CustomerAdminDetail> {
  const response = await customersMsAxios.patch<CustomerAdminDetail>(
    `admin/customer/${encodeURIComponent(customerId)}/referral`,
    { isReferral },
    auth()
  )
  return response.data
}

export async function listCustomerCallLogs(customerId: string): Promise<CustomerCallLogAdminItem[]> {
  const response = await customersMsAxios.get<CustomerCallLogAdminItem[]>(
    `admin/customer/${encodeURIComponent(customerId)}/call-logs`,
    auth()
  )
  return response.data
}

export async function listCallLogsAdmin(
  params: ListCallLogsAdminParams
): Promise<ListCallLogsAdminResponse> {
  const response = await customersMsAxios.get<ListCallLogsAdminResponse>("admin/customer/call-logs", {
    params,
    ...auth(),
  })
  return response.data
}

export async function listCustomerEventsAdmin(
  params: ListCustomerEventsParams
): Promise<ListCustomerEventsResponse> {
  const response = await customersMsAxios.get<ListCustomerEventsResponse>("admin/customer/events", {
    params,
    ...auth(),
  })
  return response.data
}

export async function listCustomerEventsByCustomerId(
  customerId: string,
  params?: Omit<ListCustomerEventsParams, "customerId">
): Promise<ListCustomerEventsResponse> {
  const response = await customersMsAxios.get<ListCustomerEventsResponse>(
    `customer/${encodeURIComponent(customerId)}/events`,
    {
      params,
      ...auth(),
    }
  )
  return response.data
}

export async function postStaffPerformanceReport(
  body: StaffPerformanceReportBody
): Promise<StaffPerformanceReportDto> {
  const response = await customersMsAxios.post<StaffPerformanceReportDto>(
    "admin/customer/staff-performance",
    body,
    auth()
  )
  return response.data
}
