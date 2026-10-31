import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { leadCallScheduleStrings as s } from "../../../i18n/locales/lead-call-schedule.strings"
import { addDaysToKey, getBogotaDayKey, getWeekStartKey } from "../business-logic/bogota-time"
import {
  listLeadCallVentors,
  listLeadCalls,
  reassignLeadCall,
  rescheduleLeadCall,
  updateLeadCallStatus,
} from "../services/lead-call-schedule.http"
import type {
  LeadCallEditableStatus,
  LeadCallItem,
  LeadCallStatus,
  LeadCallVentor,
} from "../types/lead-call-schedule.types"

const WEEK_LAST_DAY_OFFSET = 6

type LeadCallScheduleFilters = {
  weekStart: string
  userId: string
  status: LeadCallStatus | ""
}

export type LeadCallScheduleState = {
  items: LeadCallItem[]
  loading: boolean
  error: string | null
  filters: LeadCallScheduleFilters
  ventors: LeadCallVentor[]
  selectedEventId: string | null
  isActionRunning: boolean
  actionError: string | null
  actionNotice: string | null
}

const initialState: LeadCallScheduleState = {
  items: [],
  loading: false,
  error: null,
  filters: { weekStart: getWeekStartKey(getBogotaDayKey(new Date())), userId: "", status: "" },
  ventors: [],
  selectedEventId: null,
  isActionRunning: false,
  actionError: null,
  actionNotice: null,
}

type ThunkState = { leadCallSchedule: LeadCallScheduleState }

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

export const fetchLeadCallsThunk = createAsyncThunk<LeadCallItem[], void, { rejectValue: string }>(
  "leadCallSchedule/fetchList",
  async (_, { getState, rejectWithValue }) => {
    const { filters } = (getState() as ThunkState).leadCallSchedule
    try {
      return await listLeadCalls({
        from: filters.weekStart,
        to: addDaysToKey(filters.weekStart, WEEK_LAST_DAY_OFFSET),
        ...(filters.userId ? { userId: filters.userId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
      })
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.loadError))
    }
  }
)

export const fetchLeadCallVentorsThunk = createAsyncThunk<LeadCallVentor[], void, { rejectValue: string }>(
  "leadCallSchedule/fetchVentors",
  async (_, { rejectWithValue }) => {
    try {
      return await listLeadCallVentors()
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.loadError))
    }
  }
)

export const reassignLeadCallThunk = createAsyncThunk<
  LeadCallItem,
  { eventId: string; userId?: string },
  { rejectValue: string }
>("leadCallSchedule/reassign", async ({ eventId, userId }, { rejectWithValue }) => {
  try {
    return await reassignLeadCall(eventId, userId)
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.actionError))
  }
})

export const rescheduleLeadCallThunk = createAsyncThunk<
  LeadCallItem,
  { eventId: string; date: string; time: string; userId?: string },
  { rejectValue: string }
>("leadCallSchedule/reschedule", async ({ eventId, date, time, userId }, { rejectWithValue }) => {
  try {
    return await rescheduleLeadCall(eventId, { date, time, ...(userId ? { userId } : {}) })
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.actionError))
  }
})

export const updateLeadCallStatusThunk = createAsyncThunk<
  LeadCallItem,
  { eventId: string; status: LeadCallEditableStatus },
  { rejectValue: string }
>("leadCallSchedule/updateStatus", async ({ eventId, status }, { rejectWithValue }) => {
  try {
    return await updateLeadCallStatus(eventId, status)
  } catch (err: unknown) {
    return rejectWithValue(axiosMessage(err, s.actionError))
  }
})

const replaceItem = (items: LeadCallItem[], updated: LeadCallItem): LeadCallItem[] =>
  items.map((item) => (item.eventId === updated.eventId ? updated : item))

const leadCallScheduleSlice = createSlice({
  name: "leadCallSchedule",
  initialState,
  reducers: {
    setLeadCallScheduleFiltersAct: (state, action: PayloadAction<Partial<LeadCallScheduleFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    selectLeadCallAct: (state, action: PayloadAction<string | null>) => {
      state.selectedEventId = action.payload
      state.actionError = null
    },
    clearLeadCallNoticeAct: (state) => {
      state.actionNotice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadCallsThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeadCallsThunk.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchLeadCallsThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? s.loadError
      })
      .addCase(fetchLeadCallVentorsThunk.fulfilled, (state, action) => {
        state.ventors = action.payload
      })
      .addCase(reassignLeadCallThunk.pending, (state) => {
        state.isActionRunning = true
        state.actionError = null
      })
      .addCase(reassignLeadCallThunk.fulfilled, (state, action) => {
        state.isActionRunning = false
        state.items = replaceItem(state.items, action.payload)
        state.actionNotice = s.reassigned(action.payload.ventorName || action.payload.userId)
      })
      .addCase(reassignLeadCallThunk.rejected, (state, action) => {
        state.isActionRunning = false
        state.actionError = action.payload ?? s.actionError
      })
      .addCase(rescheduleLeadCallThunk.pending, (state) => {
        state.isActionRunning = true
        state.actionError = null
      })
      .addCase(rescheduleLeadCallThunk.fulfilled, (state, action) => {
        state.isActionRunning = false
        state.items = replaceItem(state.items, action.payload)
        state.actionNotice = s.rescheduled
      })
      .addCase(rescheduleLeadCallThunk.rejected, (state, action) => {
        state.isActionRunning = false
        state.actionError = action.payload ?? s.actionError
      })
      .addCase(updateLeadCallStatusThunk.pending, (state) => {
        state.isActionRunning = true
        state.actionError = null
      })
      .addCase(updateLeadCallStatusThunk.fulfilled, (state, action) => {
        state.isActionRunning = false
        state.items = replaceItem(state.items, action.payload)
        state.actionNotice = action.payload.status === "done" ? s.markedDone : s.cancelled
      })
      .addCase(updateLeadCallStatusThunk.rejected, (state, action) => {
        state.isActionRunning = false
        state.actionError = action.payload ?? s.actionError
      })
  },
})

export const { setLeadCallScheduleFiltersAct, selectLeadCallAct, clearLeadCallNoticeAct } =
  leadCallScheduleSlice.actions
export default leadCallScheduleSlice.reducer
