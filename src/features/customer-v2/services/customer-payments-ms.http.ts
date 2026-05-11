import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateCustomerPaymentBody,
  CustomerPaymentItem,
  CustomerPaymentSummaryItem,
  ListCustomerPaymentsParams,
  ListCustomerPaymentsResponse,
} from "./customer-payments-ms.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function createCustomerPaymentReq(
  body: CreateCustomerPaymentBody,
): Promise<CustomerPaymentItem> {
  const response = await customersMsAxios.post<CustomerPaymentItem>(
    "customer-payment",
    body,
    auth(),
  )
  return response.data
}

export async function listCustomerPaymentsReq(
  params: ListCustomerPaymentsParams,
): Promise<ListCustomerPaymentsResponse> {
  const response = await customersMsAxios.get<ListCustomerPaymentsResponse>(
    "customer-payment",
    { params, ...auth() },
  )
  return response.data
}

export async function listPaymentsByCustomerReq(
  customerId: string,
): Promise<CustomerPaymentItem[]> {
  const response = await customersMsAxios.get<CustomerPaymentItem[]>(
    `customer-payment/by-customer/${encodeURIComponent(customerId)}`,
    auth(),
  )
  return response.data
}

export async function getPaymentSummaryByCustomerReq(
  customerId: string,
): Promise<CustomerPaymentSummaryItem[]> {
  const response = await customersMsAxios.get<CustomerPaymentSummaryItem[]>(
    `customer-payment/summary/by-customer/${encodeURIComponent(customerId)}`,
    auth(),
  )
  return response.data
}
