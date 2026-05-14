import { AxiosHeaders } from "axios"
import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateCustomerPaymentBody,
  CustomerPaymentItem,
  CustomerPaymentSummaryItem,
  ListCustomerPaymentsParams,
  ListCustomerPaymentsResponse,
} from "./customer-payments-ms.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

function normalizeCustomerPaymentItem(raw: CustomerPaymentItem): CustomerPaymentItem {
  return {
    ...raw,
    hasEvidence: Boolean(raw.hasEvidence),
  }
}

function appendPaymentFormData(formData: FormData, body: CreateCustomerPaymentBody): void {
  formData.append("customerId", body.customerId)
  formData.append("projectId", body.projectId)
  formData.append("paymentValue", String(body.paymentValue))
  formData.append("datePayment", body.datePayment)
  if (body.receiptNumber) {
    formData.append("receiptNumber", body.receiptNumber)
  }
  if (body.paymentMethod) {
    formData.append("paymentMethod", body.paymentMethod)
  }
  if (body.notes) {
    formData.append("notes", body.notes)
  }
}

export async function createCustomerPaymentReq(
  body: CreateCustomerPaymentBody,
  evidenceFile?: File,
): Promise<CustomerPaymentItem> {
  if (evidenceFile) {
    const formData = new FormData()
    appendPaymentFormData(formData, body)
    formData.append("evidence", evidenceFile)
    const headers = AxiosHeaders.from(customersMsAuthHeaders())
    headers.delete("content-type")
    headers.delete("Content-Type")
    const response = await customersMsAxios.post<CustomerPaymentItem>(
      "customer-payment/with-evidence",
      formData,
      { headers },
    )
    return normalizeCustomerPaymentItem(response.data)
  }
  const response = await customersMsAxios.post<CustomerPaymentItem>(
    "customer-payment",
    body,
    auth(),
  )
  return normalizeCustomerPaymentItem(response.data)
}

export async function listCustomerPaymentsReq(
  params: ListCustomerPaymentsParams,
): Promise<ListCustomerPaymentsResponse> {
  const response = await customersMsAxios.get<ListCustomerPaymentsResponse>(
    "customer-payment",
    { params, ...auth() },
  )
  return {
    ...response.data,
    data: response.data.data.map((row) => normalizeCustomerPaymentItem(row)),
  }
}

export async function listPaymentsByCustomerReq(
  customerId: string,
): Promise<CustomerPaymentItem[]> {
  const response = await customersMsAxios.get<CustomerPaymentItem[]>(
    `customer-payment/by-customer/${encodeURIComponent(customerId)}`,
    auth(),
  )
  return response.data.map((row) => normalizeCustomerPaymentItem(row))
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

export async function fetchCustomerPaymentEvidenceBlob(paymentId: string): Promise<Blob> {
  const response = await customersMsAxios.get<Blob>(
    `customer-payment/${encodeURIComponent(paymentId)}/evidence`,
    { ...auth(), responseType: "blob" },
  )
  return response.data
}
