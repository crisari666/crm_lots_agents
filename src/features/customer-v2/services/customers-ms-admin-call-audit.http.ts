import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CallAuditAiReviewListResponse,
  CallAuditConfigResponse,
  CallAuditAuditorProgressResponse,
  CallAuditResultsResponse,
  CallAuditsByCallResponse,
  ListCallAuditAiReviewParams,
  ListCallAuditAuditorProgressParams,
  ListCallAuditResultsParams,
  SubmitHumanCallAuditBody,
  CallAuditRecord,
} from "./customers-ms-admin-call-audit.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

export async function getCallAuditConfig(): Promise<CallAuditConfigResponse> {
  const response = await customersMsAxios.get<CallAuditConfigResponse>(
    "admin/customer/call-audit/config",
    auth()
  )
  return response.data
}

export async function getCallAuditAiReview(
  params: ListCallAuditAiReviewParams
): Promise<CallAuditAiReviewListResponse> {
  const response = await customersMsAxios.get<CallAuditAiReviewListResponse>(
    "admin/customer/call-audit/ai-review",
    { params, ...auth() }
  )
  return response.data
}

export async function getCallAuditResults(
  params: ListCallAuditResultsParams
): Promise<CallAuditResultsResponse> {
  const response = await customersMsAxios.get<CallAuditResultsResponse>(
    "admin/customer/call-audit/results",
    { params, ...auth() }
  )
  return response.data
}

export async function getCallAuditAuditorProgress(
  params: ListCallAuditAuditorProgressParams
): Promise<CallAuditAuditorProgressResponse> {
  const response = await customersMsAxios.get<CallAuditAuditorProgressResponse>(
    "admin/customer/call-audit/auditor-progress",
    { params, ...auth() }
  )
  return response.data
}

export async function getCallAuditsByCallLogId(
  callLogId: string
): Promise<CallAuditsByCallResponse> {
  const response = await customersMsAxios.get<CallAuditsByCallResponse>(
    `admin/customer/call-logs/${encodeURIComponent(callLogId)}/audits`,
    auth()
  )
  return response.data
}

export async function submitHumanCallAudit(
  callLogId: string,
  body: SubmitHumanCallAuditBody
): Promise<CallAuditRecord> {
  const response = await customersMsAxios.post<CallAuditRecord>(
    `admin/customer/call-logs/${encodeURIComponent(callLogId)}/audit`,
    body,
    auth()
  )
  return response.data
}

export async function analyzeCallAudit(callLogId: string): Promise<CallAuditRecord> {
  const response = await customersMsAxios.post<CallAuditRecord>(
    `admin/customer/call-logs/${encodeURIComponent(callLogId)}/audit/analyze`,
    {},
    auth()
  )
  return response.data
}
