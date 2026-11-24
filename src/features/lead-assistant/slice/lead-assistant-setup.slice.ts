import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import { getLeadAssistantErrorMessage, getLeadReadiness, getLeadTemplates } from "../services/lead-assistant.http"
import type {
  LeadAssistantLoadStatus,
  LeadReadiness,
  LeadTemplatesResponse,
} from "../types/lead-assistant.types"

export type LeadAssistantNotice = {
  readonly severity: "success" | "error" | "info"
  readonly message: string
}

export type LeadAssistantSetupState = {
  readiness: LeadReadiness | null
  readinessStatus: LeadAssistantLoadStatus
  readinessError: string | null
  templates: LeadTemplatesResponse | null
  templatesStatus: LeadAssistantLoadStatus
  templatesError: string | null
  notice: LeadAssistantNotice | null
}

const initialState: LeadAssistantSetupState = {
  readiness: null,
  readinessStatus: "idle",
  readinessError: null,
  templates: null,
  templatesStatus: "idle",
  templatesError: null,
  notice: null,
}

export const fetchReadinessThunk = createAsyncThunk<LeadReadiness, void, { rejectValue: string }>(
  "leadAssistant/setup/fetchReadiness",
  async (_, { rejectWithValue }) => {
    try {
      return await getLeadReadiness()
    } catch (err) {
      return rejectWithValue(getLeadAssistantErrorMessage(err, s.readinessLoadError))
    }
  },
)

export const fetchTemplatesThunk = createAsyncThunk<
  LeadTemplatesResponse,
  boolean,
  { rejectValue: string }
>("leadAssistant/setup/fetchTemplates", async (refresh, { rejectWithValue }) => {
  try {
    return await getLeadTemplates(refresh)
  } catch (err) {
    return rejectWithValue(getLeadAssistantErrorMessage(err, s.templatesLoadError))
  }
})

const setupSlice = createSlice({
  name: "leadAssistantSetup",
  initialState,
  reducers: {
    pushNoticeAct(state, action: PayloadAction<LeadAssistantNotice>) {
      state.notice = action.payload
    },
    clearNoticeAct(state) {
      state.notice = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReadinessThunk.pending, (state) => {
        state.readinessStatus = state.readiness == null ? "loading" : state.readinessStatus
        state.readinessError = null
      })
      .addCase(fetchReadinessThunk.fulfilled, (state, action) => {
        state.readiness = action.payload
        state.readinessStatus = "ready"
      })
      .addCase(fetchReadinessThunk.rejected, (state, action) => {
        state.readinessStatus = "failed"
        state.readinessError = action.payload ?? s.readinessLoadError
      })
      .addCase(fetchTemplatesThunk.pending, (state) => {
        state.templatesStatus = "loading"
        state.templatesError = null
      })
      .addCase(fetchTemplatesThunk.fulfilled, (state, action) => {
        state.templates = action.payload
        state.templatesStatus = "ready"
        state.templatesError = action.payload.error ?? null
      })
      .addCase(fetchTemplatesThunk.rejected, (state, action) => {
        state.templatesStatus = "failed"
        state.templatesError = action.payload ?? s.templatesLoadError
      })
  },
})

export const { pushNoticeAct, clearNoticeAct } = setupSlice.actions

export default setupSlice.reducer
