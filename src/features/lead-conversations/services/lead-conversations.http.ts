import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  LeadConversationMessagesPage,
  ListLeadConversationsParams,
  ListLeadConversationsResponse,
  RestartLeadConversationResponse,
} from "../types/lead-conversations.types"

const BASE_PATH = "admin/customer/lead-conversations/sessions"
const MESSAGES_PAGE_SIZE = 50

const auth = () => ({ headers: customersMsAuthHeaders() })
const sessionPath = (sessionId: string): string => `${BASE_PATH}/${encodeURIComponent(sessionId)}`

export async function listLeadConversations(
  params: ListLeadConversationsParams
): Promise<ListLeadConversationsResponse> {
  const response = await customersMsAxios.get<ListLeadConversationsResponse>(BASE_PATH, {
    ...auth(),
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.status ? { status: params.status } : {}),
      ...(params.step ? { step: params.step } : {}),
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    },
  })
  return response.data
}

export async function listLeadConversationMessages(
  sessionId: string,
  before?: string
): Promise<LeadConversationMessagesPage> {
  const response = await customersMsAxios.get<LeadConversationMessagesPage>(
    `${sessionPath(sessionId)}/messages`,
    { ...auth(), params: { limit: MESSAGES_PAGE_SIZE, ...(before ? { before } : {}) } }
  )
  return response.data
}

export async function deleteLeadConversation(sessionId: string): Promise<{ deleted: true }> {
  const response = await customersMsAxios.delete<{ deleted: true }>(sessionPath(sessionId), auth())
  return response.data
}

export async function restartLeadConversation(
  sessionId: string
): Promise<RestartLeadConversationResponse> {
  const response = await customersMsAxios.post<RestartLeadConversationResponse>(
    `${sessionPath(sessionId)}/restart`,
    {},
    auth()
  )
  return response.data
}
