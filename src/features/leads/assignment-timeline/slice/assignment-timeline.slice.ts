import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { leadsStrings as s } from "../../../../i18n/locales/leads.strings"
import { listAssignmentTimeline } from "../services/assignment-timeline.http"
import type {
  AssignmentTimelineClockMode,
  AssignmentTimelineEvent,
  AssignmentTimelineFlowStrategy,
  ListAssignmentTimelineParams,
} from "../types/assignment-timeline.types"

function createDefaultDateRange(): { dateFrom: string; dateTo: string } {
  const dateEnd = new Date()
  dateEnd.setHours(23, 59, 59, 999)
  const dateStart = new Date()
  dateStart.setDate(dateStart.getDate() - 7)
  dateStart.setHours(0, 0, 0, 0)
  return { dateFrom: dateStart.toISOString(), dateTo: dateEnd.toISOString() }
}

const initialRange = createDefaultDateRange()

export type AssignmentTimelineState = {
  open: boolean
  events: AssignmentTimelineEvent[]
  windowFrom: string
  windowTo: string
  nextCursorBefore: string | null
  hasMoreOlder: boolean
  loading: boolean
  loadingOlder: boolean
  error: string | null
  clockMode: AssignmentTimelineClockMode
  filters: {
    dateFrom: string
    dateTo: string
    flowStrategy: AssignmentTimelineFlowStrategy | ""
    ventorId: string
  }
}

const initialState: AssignmentTimelineState = {
  open: false,
  events: [],
  windowFrom: initialRange.dateFrom,
  windowTo: initialRange.dateTo,
  nextCursorBefore: null,
  hasMoreOlder: false,
  loading: false,
  loadingOlder: false,
  error: null,
  clockMode: "assignedAt",
  filters: {
    dateFrom: initialRange.dateFrom,
    dateTo: initialRange.dateTo,
    flowStrategy: "",
    ventorId: "",
  },
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

function buildParams(
  filters: AssignmentTimelineState["filters"],
  cursorBefore?: string
): ListAssignmentTimelineParams {
  return {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    ...(filters.ventorId.trim() ? { ventorId: filters.ventorId.trim() } : {}),
    ...(filters.flowStrategy ? { flowStrategy: filters.flowStrategy } : {}),
    ...(cursorBefore ? { cursorBefore } : {}),
    limit: 100,
  }
}

function mergeEventsById(
  existing: readonly AssignmentTimelineEvent[],
  incoming: readonly AssignmentTimelineEvent[]
): AssignmentTimelineEvent[] {
  const byId = new Map<string, AssignmentTimelineEvent>()
  for (const event of [...incoming, ...existing]) {
    byId.set(event.id, event)
  }
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
  )
}

export const fetchAssignmentTimelineThunk = createAsyncThunk(
  "assignmentTimeline/fetch",
  async (_arg: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { assignmentTimeline: AssignmentTimelineState }
      return await listAssignmentTimeline(buildParams(state.assignmentTimeline.filters))
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.timelineLoadError))
    }
  }
)

export const fetchOlderAssignmentTimelineThunk = createAsyncThunk(
  "assignmentTimeline/fetchOlder",
  async (_arg: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { assignmentTimeline: AssignmentTimelineState }
      const cursor = state.assignmentTimeline.nextCursorBefore
      if (!cursor || !state.assignmentTimeline.hasMoreOlder) {
        return null
      }
      return await listAssignmentTimeline(buildParams(state.assignmentTimeline.filters, cursor))
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, s.timelineLoadOlderError))
    }
  }
)

const assignmentTimelineSlice = createSlice({
  name: "assignmentTimeline",
  initialState,
  reducers: {
    openAssignmentTimelineAct: (state) => {
      state.open = true
      state.error = null
    },
    closeAssignmentTimelineAct: (state) => {
      state.open = false
    },
    setAssignmentTimelineClockModeAct: (
      state,
      action: PayloadAction<AssignmentTimelineClockMode>
    ) => {
      state.clockMode = action.payload
    },
    setAssignmentTimelineFiltersAct: (
      state,
      action: PayloadAction<Partial<AssignmentTimelineState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearAssignmentTimelineErrorAct: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentTimelineThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssignmentTimelineThunk.fulfilled, (state, action) => {
        state.loading = false
        state.events = [...action.payload.events]
        state.windowFrom = action.payload.windowFrom
        state.windowTo = action.payload.windowTo
        state.nextCursorBefore = action.payload.nextCursorBefore ?? null
        state.hasMoreOlder = action.payload.hasMoreOlder
      })
      .addCase(fetchAssignmentTimelineThunk.rejected, (state, action) => {
        state.loading = false
        state.error = typeof action.payload === "string" ? action.payload : s.timelineLoadError
      })
      .addCase(fetchOlderAssignmentTimelineThunk.pending, (state) => {
        state.loadingOlder = true
        state.error = null
      })
      .addCase(fetchOlderAssignmentTimelineThunk.fulfilled, (state, action) => {
        state.loadingOlder = false
        if (action.payload == null) {
          return
        }
        state.events = mergeEventsById(state.events, action.payload.events)
        state.windowFrom = action.payload.windowFrom
        state.nextCursorBefore = action.payload.nextCursorBefore ?? null
        state.hasMoreOlder = action.payload.hasMoreOlder
      })
      .addCase(fetchOlderAssignmentTimelineThunk.rejected, (state, action) => {
        state.loadingOlder = false
        state.error =
          typeof action.payload === "string" ? action.payload : s.timelineLoadOlderError
      })
  },
})

export const {
  openAssignmentTimelineAct,
  closeAssignmentTimelineAct,
  setAssignmentTimelineClockModeAct,
  setAssignmentTimelineFiltersAct,
  clearAssignmentTimelineErrorAct,
} = assignmentTimelineSlice.actions

export default assignmentTimelineSlice.reducer
