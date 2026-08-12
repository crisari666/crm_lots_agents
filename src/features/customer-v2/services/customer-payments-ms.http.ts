import { AxiosHeaders } from "axios"
import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateCustomerDownPaymentBody,
  CreateCustomerPaymentFeeBody,
  CustomerDownPaymentItem,
  CustomerPaymentFeeItem,
  ListCustomerDownPaymentsParams,
  ListCustomerDownPaymentsResponse,
} from "./customer-payments-ms.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

function normalizeFee(raw: CustomerPaymentFeeItem): CustomerPaymentFeeItem {
  return {
    ...raw,
    hasEvidence: Boolean(raw.hasEvidence),
  }
}

function normalizeDownPayment(raw: CustomerDownPaymentItem): CustomerDownPaymentItem {
  return {
    ...raw,
    hasContract: Boolean(raw.hasContract),
    remaining: Math.max((raw.expectedValue ?? 0) - (raw.totalPaid ?? 0), 0),
    fees: raw.fees?.map(normalizeFee),
  }
}

function authMultipartHeaders(): AxiosHeaders {
  const headers = AxiosHeaders.from(customersMsAuthHeaders())
  headers.delete("content-type")
  headers.delete("Content-Type")
  return headers
}

function appendDownPaymentFields(formData: FormData, body: CreateCustomerDownPaymentBody): void {
  formData.append("customerId", body.customerId)
  formData.append("projectId", body.projectId)
  formData.append("lotNumber", body.lotNumber)
  formData.append("expectedValue", String(body.expectedValue))
  formData.append("firstPaymentValue", String(body.firstPaymentValue))
  formData.append("datePayment", body.datePayment)
  if (body.receiptNumber) formData.append("receiptNumber", body.receiptNumber)
  if (body.paymentMethod) formData.append("paymentMethod", body.paymentMethod)
  if (body.notes) formData.append("notes", body.notes)
  if (body.customerName) formData.append("customerName", body.customerName)
  if (body.projectName) formData.append("projectName", body.projectName)
}

export async function createCustomerDownPaymentReq(
  body: CreateCustomerDownPaymentBody,
  contractFile: File,
  evidenceFile?: File,
): Promise<CustomerDownPaymentItem> {
  const formData = new FormData()
  appendDownPaymentFields(formData, body)
  formData.append("contract", contractFile)
  if (evidenceFile) {
    formData.append("evidence", evidenceFile)
  }
  const response = await customersMsAxios.post<CustomerDownPaymentItem>(
    "customer-down-payment",
    formData,
    { headers: authMultipartHeaders() },
  )
  return normalizeDownPayment(response.data)
}

export async function addCustomerPaymentFeeReq(
  downPaymentId: string,
  body: CreateCustomerPaymentFeeBody,
  evidenceFile?: File,
): Promise<CustomerDownPaymentItem> {
  const formData = new FormData()
  formData.append("paymentValue", String(body.paymentValue))
  formData.append("datePayment", body.datePayment)
  if (body.receiptNumber) formData.append("receiptNumber", body.receiptNumber)
  if (body.paymentMethod) formData.append("paymentMethod", body.paymentMethod)
  if (body.notes) formData.append("notes", body.notes)
  if (evidenceFile) {
    formData.append("evidence", evidenceFile)
  }
  const response = await customersMsAxios.post<CustomerDownPaymentItem>(
    `customer-down-payment/${encodeURIComponent(downPaymentId)}/fees`,
    formData,
    { headers: authMultipartHeaders() },
  )
  return normalizeDownPayment(response.data)
}

export async function listCustomerDownPaymentsReq(
  params: ListCustomerDownPaymentsParams,
): Promise<ListCustomerDownPaymentsResponse> {
  const response = await customersMsAxios.get<ListCustomerDownPaymentsResponse>(
    "customer-down-payment",
    { params, ...auth() },
  )
  return {
    ...response.data,
    data: response.data.data.map(normalizeDownPayment),
  }
}

export async function listDownPaymentsByCustomerReq(
  customerId: string,
): Promise<CustomerDownPaymentItem[]> {
  const response = await customersMsAxios.get<CustomerDownPaymentItem[]>(
    `customer-down-payment/by-customer/${encodeURIComponent(customerId)}`,
    auth(),
  )
  return response.data.map(normalizeDownPayment)
}

export async function listFeesByDownPaymentReq(
  downPaymentId: string,
): Promise<CustomerPaymentFeeItem[]> {
  const response = await customersMsAxios.get<CustomerPaymentFeeItem[]>(
    `customer-down-payment/${encodeURIComponent(downPaymentId)}/fees`,
    auth(),
  )
  return response.data.map(normalizeFee)
}

export async function fetchDownPaymentContractBlob(downPaymentId: string): Promise<Blob> {
  const response = await customersMsAxios.get<Blob>(
    `customer-down-payment/${encodeURIComponent(downPaymentId)}/contract`,
    { ...auth(), responseType: "blob" },
  )
  return response.data
}

export async function fetchFeeEvidenceBlob(feeId: string): Promise<Blob> {
  const response = await customersMsAxios.get<Blob>(
    `customer-down-payment/fees/${encodeURIComponent(feeId)}/evidence`,
    { ...auth(), responseType: "blob" },
  )
  return response.data
}
