import { customersMsAxios } from "../../../app/customers-ms-http"

export type CustomerConversationQueryParams = {
  limit?: number
  skip?: number
}

export type CustomerConversationChatItem = {
  sessionId: string
  chatId: string
  name: string
  isGroup: boolean
  lastMessageTimestamp: number
}

export type CustomerConversationMessageItem = {
  sessionId: string
  messageId: string
  chatId: string
  body: string
  fromMe: boolean
  type: string
  timestamp: number
  hasMedia: boolean
  mediaType?: string | null
  mediaPath?: string | null
  mediaFilename?: string | null
  mediaMimeType?: string | null
  mediaUrl?: string | null
}

export async function listCustomerConversationChats(
  customerId: string,
  params?: CustomerConversationQueryParams
): Promise<CustomerConversationChatItem[]> {
  const response = await customersMsAxios.get<CustomerConversationChatItem[]>(
    `customer-conversations/customer/${encodeURIComponent(customerId)}/chats`,
    { params }
  )
  return response.data
}

export async function listCustomerConversationMessages(
  customerId: string,
  chatId: string,
  params?: CustomerConversationQueryParams
): Promise<CustomerConversationMessageItem[]> {
  const response = await customersMsAxios.get<CustomerConversationMessageItem[]>(
    `customer-conversations/customer/${encodeURIComponent(customerId)}/chats/${encodeURIComponent(chatId)}/messages`,
    { params }
  )
  return response.data
}
