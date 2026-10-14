import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import {
  deleteLeadConversation,
  listLeadConversationMessages,
  listLeadConversations,
  restartLeadConversation,
} from "../services/lead-conversations.http"
import type {
  LeadConversationListItem,
  LeadConversationMessage,
  LeadConversationMessagesPage,
  LeadConversationStatus,
  LeadConversationStep,
  ListLeadConversationsResponse,
  RestartLeadConversationResponse,
} from "../types/lead-conversations.types"

type LeadConversationsFilters = {
  status: LeadConversationStatus | ""
  step: LeadConversationStep | ""
  search: string
  page: number
  limit: 10 | 20 | 50
}

export type LeadConversationsState = {
  items: LeadConversationListItem[]
  total: number
  loading: boolean
  error: string | null
  filters: LeadConversationsFilters
  selectedSessionId: string | null
  messages: LeadConversationMessage[]
  messagesNextBefore: string | null
  messagesLoading: boolean
  messagesError: string | null
  isActionRunning: boolean
  actionError: string | null
  actionNotice: string | null
}

const initialState: LeadConversationsState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  filters: { status: "", step: "", search: "", page: 0, limit: 20 },
  selectedSessionId: null,
  messages: [],
  messagesNextBefore: null,
  messagesLoading: false,
  messagesError: null,
  isActionRunning: false,
  actionError: null,
  actionNotice: null,
}

type ThunkState = { leadConversations: LeadConversationsState }

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

export const fetchLeadConversationsThunk = createAsyncThunk<
  ListLeadConversationsResponse,
  void,
  { rejectValue: string }
>("leadConversations/fetchList", async (_, { getState, rejectWithValue }) => {
  const { filters } = (getState() as ThunkState).leadConversations
  try {
    return await listLeadConversations({
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.step ? { step: filters.step } : {}),
    })
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.loadError))
  }
})

export const fetchLeadConversationMessagesThunk = createAsyncThunk<
  LeadConversationMessagesPage,
  { sessionId: string; before?: string },
  { rejectValue: string }
>("leadConversations/fetchMessages", async ({ sessionId, before }, { rejectWithValue }) => {
  try {
    return await listLeadConversationMessages(sessionId, before)
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.messagesLoadError))
  }
})

export const deleteLeadConversationThunk = createAsyncThunk<
  { deleted: true },
  string,
  { rejectValue: string }
>("leadConversations/delete", async (sessionId, { dispatch, rejectWithValue }) => {
  try {
    const result = await deleteLeadConversation(sessionId)
    void dispatch(fetchLeadConversationsThunk())
    return result
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.actionError))
  }
})

export const restartLeadConversationThunk = createAsyncThunk<
  RestartLeadConversationResponse,
  string,
  { rejectValue: string }
>("leadConversations/restart", async (sessionId, { dispatch, rejectWithValue }) => {
  try {
    const result = await restartLeadConversation(sessionId)
    void dispatch(fetchLeadConversationsThunk())
    void dispatch(fetchLeadConversationMessagesThunk({ sessionId }))
    return result
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.actionError))
  }
})

const leadConversationsSlice = createSlice({
  name: "leadConversations",
  initialState,
  reducers: {
    setLeadConversationsFiltersAct: (state, action: PayloadAction<Partial<LeadConversationsFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    selectLeadConversationAct: (state, action: PayloadAction<string | null>) => {
      state.selectedSessionId = action.payload
      state.messages = []
      state.messagesNextBefore = null
      state.messagesError = null
      state.actionError = null
    },
    clearLeadConversationNoticeAct: (state) => {
      state.actionNotice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadConversationsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeadConversationsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
      })
      .addCase(fetchLeadConversationsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? s.loadError
      })
      .addCase(fetchLeadConversationMessagesThunk.pending, (state, action) => {
        state.messagesLoading = true
        state.messagesError = null
        if (!action.meta.arg.before) {
          state.messages = []
          state.messagesNextBefore = null
        }
      })
      .addCase(fetchLeadConversationMessagesThunk.fulfilled, (state, action) => {
        if (action.meta.arg.sessionId !== state.selectedSessionId) return
        const isOlderPage = Boolean(action.meta.arg.before)
        state.messagesLoading = false
        state.messages = isOlderPage ? [...action.payload.items, ...state.messages] : action.payload.items
        state.messagesNextBefore = action.payload.nextBefore ?? null
      })
      .addCase(fetchLeadConversationMessagesThunk.rejected, (state, action) => {
        state.messagesLoading = false
        state.messagesError = action.payload ?? s.messagesLoadError
      })
      .addCase(deleteLeadConversationThunk.pending, (state) => {
        state.isActionRunning = true
        state.actionError = null
      })
      .addCase(deleteLeadConversationThunk.fulfilled, (state) => {
        state.isActionRunning = false
        state.selectedSessionId = null
        state.messages = []
        state.actionNotice = s.deleted
      })
      .addCase(deleteLeadConversationThunk.rejected, (state, action) => {
        state.isActionRunning = false
        state.actionError = action.payload ?? s.actionError
      })
      .addCase(restartLeadConversationThunk.pending, (state) => {
        state.isActionRunning = true
        state.actionError = null
      })
      .addCase(restartLeadConversationThunk.fulfilled, (state, action) => {
        state.isActionRunning = false
        state.actionNotice = action.payload.sent ? s.restartSent : s.restartNotSent
      })
      .addCase(restartLeadConversationThunk.rejected, (state, action) => {
        state.isActionRunning = false
        state.actionError = action.payload ?? s.actionError
      })
  },
})

export const {
  setLeadConversationsFiltersAct,
  selectLeadConversationAct,
  clearLeadConversationNoticeAct,
} = leadConversationsSlice.actions
export default leadConversationsSlice.reducer
