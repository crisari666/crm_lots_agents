import Api from "../../../app/axios"
import type {
  CreateLeadCandidatePayload,
  LeadCandidateListResult,
  LeadCandidateRow,
  ListLeadCandidatesParams,
} from "../types/lead-candidates.types"

function unwrapResult<T>(response: unknown): T {
  if (response == null) {
    throw new Error("Empty response")
  }
  const { error, result, message } = response as {
    error?: string | null
    result?: T
    message?: string
  }
  if (error != null && error !== "") {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error))
  }
  if (message === "success" || result !== undefined) {
    return result as T
  }
  throw new Error("Unexpected response")
}

export async function listLeadCandidatesReq(
  params: ListLeadCandidatesParams,
): Promise<LeadCandidateListResult> {
  const api = Api.getInstance()
  const data: Record<string, string | number | boolean> = {
    excludeDate: params.excludeDate,
    page: params.page,
    limit: params.limit,
  }
  if (!params.excludeDate && params.dateFrom != null && params.dateTo != null) {
    data.dateFrom = params.dateFrom
    data.dateTo = params.dateTo
  }
  const trimmedSearch = params.search.trim()
  if (trimmedSearch.length > 0) {
    data.search = trimmedSearch
  }
  const response = await api.get({
    path: "lead-candidates",
    data,
  })
  return unwrapResult<LeadCandidateListResult>(response)
}

export async function getLeadCandidateByIdReq(
  id: string,
): Promise<LeadCandidateRow> {
  const api = Api.getInstance()
  const response = await api.get({
    path: `lead-candidates/${id}`,
  })
  return unwrapResult<LeadCandidateRow>(response)
}

export async function createLeadCandidateReq(
  payload: CreateLeadCandidatePayload,
): Promise<LeadCandidateRow> {
  const api = Api.getInstance()
  const response = await api.post({
    path: "lead-candidates",
    data: {
      name: payload.name,
      lastName: payload.lastName ?? "",
      email: payload.email,
      phone: payload.phone,
    },
  })
  return unwrapResult<LeadCandidateRow>(response)
}
