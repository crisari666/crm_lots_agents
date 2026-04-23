import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { RootState } from "../../../app/store"
import { closeCustomerDetailDialogAct } from "./customer-v2.slice"
import {
  type CustomerConversationChatItem,
  type CustomerConversationMessageItem,
  type CustomerConversationQueryParams,
  listCustomerConversationChats,
  listCustomerConversationMessages,
} from "../services/customer-conversations-ms.service"

export type CustomerConversationsState = {
  chats: CustomerConversationChatItem[]
  chatsLoading: boolean
  chatsError: string | null
  selectedChatId: string | null
  messagesByChatId: Record<string, CustomerConversationMessageItem[]>
  messagesLoadingByChatId: Record<string, boolean>
  messagesErrorByChatId: Record<string, string | null>
}

const initialState: CustomerConversationsState = {
  chats: [],
  chatsLoading: false,
  chatsError: null,
  selectedChatId: null,
  messagesByChatId: {},
  messagesLoadingByChatId: {},
  messagesErrorByChatId: {},
}

function axiosMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) {
      return data.message.join(", ")
    }
    if (typeof data?.message === "string") {
      return data.message
    }
  }
  return fallback
}

function getDetailCustomerId(state: RootState): string | null {
  return state.customerV2.detailForm?.id ?? state.customerV2.detail?.id ?? null
}

export const fetchConversationChatsThunk = createAsyncThunk(
  "customerConversations/fetchConversationChats",
  async (params: CustomerConversationQueryParams | undefined, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const customerId = getDetailCustomerId(state)
      if (!customerId) {
        return rejectWithValue("No se encontró el cliente para cargar conversaciones.")
      }
      return await listCustomerConversationChats(customerId, params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudieron cargar los chats del cliente."))
    }
  }
)

export const fetchConversationMessagesThunk = createAsyncThunk(
  "customerConversations/fetchConversationMessages",
  async (
    payload: { chatId: string; params?: CustomerConversationQueryParams },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState
      const customerId = getDetailCustomerId(state)
      if (!customerId) {
        return rejectWithValue("No se encontró el cliente para cargar mensajes.")
      }
      const rows = await listCustomerConversationMessages(customerId, payload.chatId, payload.params)
      return { chatId: payload.chatId, rows }
    } catch (err: unknown) {
      return rejectWithValue({
        chatId: payload.chatId,
        message: axiosMessage(err, "No se pudieron cargar los mensajes del chat."),
      })
    }
  }
)

const customerConversationsSlice = createSlice({
  name: "customerConversations",
  initialState,
  reducers: {
    setSelectedConversationChatAct: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload
    },
    resetCustomerConversationsAct: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversationChatsThunk.pending, (state) => {
        state.chatsLoading = true
        state.chatsError = null
      })
      .addCase(fetchConversationChatsThunk.fulfilled, (state, action) => {
        state.chatsLoading = false
        state.chats = action.payload
        if (state.chats.length === 0) {
          state.selectedChatId = null
          return
        }
        const stillExists = state.selectedChatId
          ? state.chats.some((chat) => chat.chatId === state.selectedChatId)
          : false
        if (!stillExists) {
          state.selectedChatId = state.chats[0]?.chatId ?? null
        }
      })
      .addCase(fetchConversationChatsThunk.rejected, (state, action) => {
        state.chatsLoading = false
        state.chatsError =
          (action.payload as string) ??
          action.error.message ??
          "No se pudieron cargar los chats del cliente."
        state.chats = []
        state.selectedChatId = null
      })
      .addCase(fetchConversationMessagesThunk.pending, (state, action) => {
        state.messagesLoadingByChatId[action.meta.arg.chatId] = true
        state.messagesErrorByChatId[action.meta.arg.chatId] = null
      })
      .addCase(fetchConversationMessagesThunk.fulfilled, (state, action) => {
        state.messagesLoadingByChatId[action.payload.chatId] = false
        state.messagesByChatId[action.payload.chatId] = action.payload.rows
      })
      .addCase(fetchConversationMessagesThunk.rejected, (state, action) => {
        const payload = action.payload as { chatId?: string; message?: string } | undefined
        const fallbackChatId = action.meta.arg.chatId
        const chatId = payload?.chatId ?? fallbackChatId
        state.messagesLoadingByChatId[chatId] = false
        state.messagesErrorByChatId[chatId] =
          payload?.message ??
          action.error.message ??
          "No se pudieron cargar los mensajes del chat."
      })
      .addCase(closeCustomerDetailDialogAct, () => initialState)
  },
})

export const { setSelectedConversationChatAct, resetCustomerConversationsAct } =
  customerConversationsSlice.actions

export default customerConversationsSlice.reducer
