import { WsCloudMsHttp } from "../../../app/ws-cloud-ms-http"
import type {
  WhatsappChatListItemType,
  WhatsappChatsListResponseType,
  WhatsappChatMessagesListResponseType
} from "../types/whatsapp-chat.types"

const CHATS_PATH = "whatsapp-cloud/chats"
const messagesPath = (chatId: string) => `whatsapp-cloud/chats/${encodeURIComponent(chatId)}/messages`
const sendTextPath = (chatId: string) =>
  `whatsapp-cloud/chats/${encodeURIComponent(chatId)}/messages/text`

/** Digits only, for matching CRM `phone` to chat `waId` */
export function digitsOnlyPhone(value: string): string {
  return value.replace(/\D/g, "")
}

export async function listWhatsappChatsReq(params?: {
  limit?: number
  before?: string
}): Promise<WhatsappChatsListResponseType> {
  const http = WsCloudMsHttp.getInstance()
  return http.get<WhatsappChatsListResponseType>(CHATS_PATH, {
    limit: params?.limit,
    before: params?.before
  })
}

export async function listWhatsappChatMessagesReq(
  chatId: string,
  params?: { limit?: number; before?: string }
): Promise<WhatsappChatMessagesListResponseType> {
  const http = WsCloudMsHttp.getInstance()
  return http.get<WhatsappChatMessagesListResponseType>(messagesPath(chatId), {
    limit: params?.limit,
    before: params?.before
  })
}

/** `POST .../chats/:chatId/messages/text` — body `{ "body": "..." }` per WhatsApp Cloud MS API */
export async function sendWhatsappChatTextMessageReq(chatId: string, body: string): Promise<unknown> {
  const http = WsCloudMsHttp.getInstance()
  return http.post<unknown>(sendTextPath(chatId), { body })
}

/**
 * Walks chat pages (newest-first) until a chat whose `waId` matches `phoneDigits` is found.
 */
export async function findWhatsappChatByPhoneDigits(phoneDigits: string): Promise<WhatsappChatListItemType | null> {
  if (phoneDigits === "") {
    return null
  }

  let before: string | undefined
  const limit = 100

  for (let guard = 0; guard < 50; guard += 1) {
    const page = await listWhatsappChatsReq({ limit, before })
    const hit = page.items.find((c) => digitsOnlyPhone(c.waId) === phoneDigits)
    if (hit != null) {
      return hit
    }
    if (!page.hasMore || page.nextCursor == null || page.nextCursor === "") {
      return null
    }
    before = page.nextCursor
  }

  return null
}

/**
 * Loads messages for display (oldest first). Fetches up to `maxMessages` by paging cursors.
 */
export async function loadWhatsappChatMessagesForDisplay(
  chatId: string,
  maxMessages = 200
): Promise<WhatsappChatMessagesListResponseType["items"]> {
  const collected: WhatsappChatMessagesListResponseType["items"] = []
  let before: string | undefined
  const limit = 100

  while (collected.length < maxMessages) {
    const page = await listWhatsappChatMessagesReq(chatId, { limit, before })
    collected.push(...page.items)
    if (!page.hasMore || page.nextCursor == null || page.nextCursor === "") {
      break
    }
    before = page.nextCursor
  }

  const slice = collected.slice(0, maxMessages)
  return slice.slice().reverse()
}
