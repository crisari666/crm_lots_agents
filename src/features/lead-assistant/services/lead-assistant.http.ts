import axios from "axios"
import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  LeadAssistantSettings,
  LeadFaq,
  LeadFaqBody,
  LeadReadiness,
  LeadRecoverySequence,
  LeadRecoveryStepBody,
  LeadSimulateRequest,
  LeadSimulateResponse,
  LeadTemplatesResponse,
  LeadUnansweredConvertResult,
  LeadUnansweredPage,
  LeadUnansweredQuestion,
  LeadUnansweredStatus,
  UpdateLeadAssistantSettingsBody,
} from "../types/lead-assistant.types"

const BASE_PATH = "admin/customer/lead-assistant"
const auth = () => ({ headers: customersMsAuthHeaders() })

export async function getLeadAssistantSettings(): Promise<LeadAssistantSettings> {
  const response = await customersMsAxios.get<LeadAssistantSettings>(`${BASE_PATH}/settings`, auth())
  return response.data
}

export async function updateLeadAssistantSettings(
  body: UpdateLeadAssistantSettingsBody,
): Promise<LeadAssistantSettings> {
  const response = await customersMsAxios.patch<LeadAssistantSettings>(
    `${BASE_PATH}/settings`,
    body,
    auth(),
  )
  return response.data
}

export async function listLeadFaqs(): Promise<LeadFaq[]> {
  const response = await customersMsAxios.get<LeadFaq[]>(`${BASE_PATH}/faqs`, auth())
  return response.data
}

export async function createLeadFaq(body: LeadFaqBody): Promise<LeadFaq> {
  const response = await customersMsAxios.post<LeadFaq>(`${BASE_PATH}/faqs`, body, auth())
  return response.data
}

export async function updateLeadFaq(id: string, body: Partial<LeadFaqBody>): Promise<LeadFaq> {
  const response = await customersMsAxios.patch<LeadFaq>(`${BASE_PATH}/faqs/${id}`, body, auth())
  return response.data
}

export async function deleteLeadFaq(id: string): Promise<void> {
  await customersMsAxios.delete(`${BASE_PATH}/faqs/${id}`, auth())
}

export async function listLeadUnansweredQuestions(params: {
  readonly status: LeadUnansweredStatus
  readonly page: number
  readonly limit: number
}): Promise<LeadUnansweredPage> {
  const response = await customersMsAxios.get<LeadUnansweredPage>(
    `${BASE_PATH}/unanswered-questions`,
    { ...auth(), params },
  )
  return response.data
}

export async function dismissLeadUnansweredQuestion(id: string): Promise<LeadUnansweredQuestion> {
  const response = await customersMsAxios.patch<LeadUnansweredQuestion>(
    `${BASE_PATH}/unanswered-questions/${id}`,
    { status: "dismissed" },
    auth(),
  )
  return response.data
}

export async function convertLeadUnansweredQuestion(
  id: string,
  body: LeadFaqBody,
): Promise<LeadUnansweredConvertResult> {
  const response = await customersMsAxios.post<LeadUnansweredConvertResult>(
    `${BASE_PATH}/unanswered-questions/${id}/convert`,
    body,
    auth(),
  )
  return response.data
}

export async function getLeadRecoverySequence(): Promise<LeadRecoverySequence> {
  const response = await customersMsAxios.get<LeadRecoverySequence>(`${BASE_PATH}/recovery`, auth())
  return response.data
}

export async function replaceLeadRecoverySequence(
  steps: readonly LeadRecoveryStepBody[],
): Promise<LeadRecoverySequence> {
  const response = await customersMsAxios.put<LeadRecoverySequence>(
    `${BASE_PATH}/recovery`,
    { steps },
    auth(),
  )
  return response.data
}

export async function getLeadTemplates(refresh: boolean): Promise<LeadTemplatesResponse> {
  const response = await customersMsAxios.get<LeadTemplatesResponse>(`${BASE_PATH}/templates`, {
    ...auth(),
    params: refresh ? { refresh: true } : undefined,
  })
  return response.data
}

export async function getLeadReadiness(): Promise<LeadReadiness> {
  const response = await customersMsAxios.get<LeadReadiness>(`${BASE_PATH}/readiness`, auth())
  return response.data
}

export async function simulateLeadAgent(body: LeadSimulateRequest): Promise<LeadSimulateResponse> {
  const response = await customersMsAxios.post<LeadSimulateResponse>(
    `${BASE_PATH}/simulate`,
    body,
    auth(),
  )
  return response.data
}

/** Extracts the API message of a failed request or returns the fallback copy. */
export function getLeadAssistantErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return fallback
  }
  const data = err.response?.data as { message?: string | string[] } | undefined
  if (Array.isArray(data?.message)) {
    return data.message.join(", ")
  }
  return typeof data?.message === "string" ? data.message : fallback
}
