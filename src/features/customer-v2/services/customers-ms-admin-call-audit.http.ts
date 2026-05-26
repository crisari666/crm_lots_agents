import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CallAuditAiReviewListResponse,
  CallAuditConfigResponse,
  CallAuditProgressResponse,
  CallAuditsByCallResponse,
  ListCallAuditAiReviewParams,
  ListCallAuditProgressParams,
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

export async function getCallAuditProgress(
  params: ListCallAuditProgressParams
): Promise<CallAuditProgressResponse> {
  const response = await customersMsAxios.get<CallAuditProgressResponse>(
    "admin/customer/call-audit/progress",
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
