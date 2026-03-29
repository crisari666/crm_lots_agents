/** WhatsApp Cloud MS — `GET .../whatsapp-cloud/chats` item */
export type WhatsappChatListItemType = {
  id: string
  waId: string
  phoneNumberId: string
  displayPhoneNumber: string
  profileName: string | null
  lastMessageAt: string
  createdAt: string
  updatedAt: string
}

export type WhatsappChatsListResponseType = {
  items: WhatsappChatListItemType[]
  nextCursor: string | null
  hasMore: boolean
}

export type WhatsappMessageDirectionType = "inbound" | "outbound"

/** WhatsApp Cloud MS — `GET .../chats/:chatId/messages` item */
export type WhatsappChatMessageType = {
  id: string
  chatId: string
  direction: WhatsappMessageDirectionType
  whatsappMessageId: string
  type: string
  timestamp: string
  textBody: string | null
  caption: string | null
  media: { storedRelativePath?: string } | null
  contextMessageId: string | null
  interactiveSnapshot: unknown
  createdAt: string
  updatedAt: string
}

export type WhatsappChatMessagesListResponseType = {
  items: WhatsappChatMessageType[]
  nextCursor: string | null
  hasMore: boolean
}
