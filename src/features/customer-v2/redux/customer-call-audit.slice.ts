import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import type { RootState } from "../../../app/store"
import {
  analyzeCallAudit,
  getCallAuditAiReview,
  getCallAuditConfig,
  getCallAuditAuditorProgress,
  getCallAuditResults,
  getCallAuditsByCallLogId,
  submitHumanCallAudit,
} from "../services/customers-ms-admin-call-audit.http"
import type {
  CallAuditAiReviewListResponse,
  CallAuditConfigResponse,
  CallAuditAuditorProgressResponse,
  CallAuditResultsResponse,
  CallAuditsByCallResponse,
  ListCallAuditAiReviewParams,
  ListCallAuditAuditorProgressParams,
  ListCallAuditResultsParams,
  SubmitHumanCallAuditBody,
} from "../services/customers-ms-admin-call-audit.types"

export type CustomerCallAuditState = {
  config: CallAuditConfigResponse | null
  auditResults: CallAuditResultsResponse | null
  auditorProgress: CallAuditAuditorProgressResponse | null
  aiReview: CallAuditAiReviewListResponse | null
  auditsByCall: CallAuditsByCallResponse | null
  filters: { month: string; agentExternalRef: string; onlyWithoutAi: boolean }
  loadingConfig: boolean
  loadingResults: boolean
  loadingAuditorProgress: boolean
  loadingAiReview: boolean
  loadingAudits: boolean
  submitting: boolean
  analyzingCallLogIds: string[]
  error: string | null
}

function addAnalyzingCallLogId(ids: string[], callLogId: string): string[] {
  if (ids.includes(callLogId)) {
    return ids
  }
  return [...ids, callLogId]
}

function removeAnalyzingCallLogId(ids: string[], callLogId: string): string[] {
  return ids.filter((id) => id !== callLogId)
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

function defaultMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

const initialState: CustomerCallAuditState = {
  config: null,
  auditResults: null,
  auditorProgress: null,
  aiReview: null,
  auditsByCall: null,
  filters: { month: defaultMonth(), agentExternalRef: "", onlyWithoutAi: false },
  loadingConfig: false,
  loadingResults: false,
  loadingAuditorProgress: false,
  loadingAiReview: false,
  loadingAudits: false,
  submitting: false,
  analyzingCallLogIds: [],
  error: null,
}

export const fetchCallAuditConfigThunk = createAsyncThunk(
  "customerCallAudit/fetchConfig",
  async (_, { rejectWithValue }) => {
    try {
      return await getCallAuditConfig()
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar la configuración de auditoría."))
    }
  }
)

export const fetchCallAuditResultsThunk = createAsyncThunk(
  "customerCallAudit/fetchResults",
  async (params: ListCallAuditResultsParams, { rejectWithValue }) => {
    try {
      return await getCallAuditResults(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar el resumen de auditorías."))
    }
  }
)

export const fetchCallAuditAuditorProgressThunk = createAsyncThunk(
  "customerCallAudit/fetchAuditorProgress",
  async (params: ListCallAuditAuditorProgressParams, { rejectWithValue }) => {
    try {
      return await getCallAuditAuditorProgress(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar el progreso de auditores."))
    }
  }
)

export const fetchCallAuditAiReviewThunk = createAsyncThunk(
  "customerCallAudit/fetchAiReview",
  async (params: ListCallAuditAiReviewParams, { rejectWithValue }) => {
    try {
      return await getCallAuditAiReview(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar la revisión IA."))
    }
  }
)

export const fetchCallAuditsByCallThunk = createAsyncThunk(
  "customerCallAudit/fetchAuditsByCall",
  async (callLogId: string, { rejectWithValue }) => {
    try {
      return await getCallAuditsByCallLogId(callLogId)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudieron cargar las auditorías de la llamada."))
    }
  }
)

export const submitHumanCallAuditThunk = createAsyncThunk(
  "customerCallAudit/submitHuman",
  async (
    input: { callLogId: string; body: SubmitHumanCallAuditBody },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const record = await submitHumanCallAudit(input.callLogId, input.body)
      const audits = await getCallAuditsByCallLogId(input.callLogId)
      const { filters } = (getState() as RootState).customerCallAudit
      void dispatch(
        fetchCallAuditResultsThunk({
          month: filters.month,
          ...(filters.agentExternalRef.trim() !== ""
            ? { agentExternalRef: filters.agentExternalRef.trim() }
            : {}),
        })
      )
      void dispatch(fetchCallAuditAuditorProgressThunk({ month: filters.month }))
      return { record, audits }
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo guardar la auditoría."))
    }
  }
)

export const analyzeCallAuditThunk = createAsyncThunk(
  "customerCallAudit/analyze",
  async (callLogId: string, { dispatch, getState, rejectWithValue }) => {
    try {
      await analyzeCallAudit(callLogId)
      const audits = await getCallAuditsByCallLogId(callLogId)
      const { filters } = (getState() as RootState).customerCallAudit
      void dispatch(
        fetchCallAuditAiReviewThunk({
          month: filters.month,
          limit: 200,
          skip: 0,
          ...(filters.agentExternalRef.trim() !== ""
            ? { agentExternalRef: filters.agentExternalRef.trim() }
            : {}),
          ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
        })
      )
      return { callLogId, audits }
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo ejecutar el análisis con IA."))
    }
  }
)

const customerCallAuditSlice = createSlice({
  name: "customerCallAudit",
  initialState,
  reducers: {
    setCallAuditFiltersAct(
      state,
      action: PayloadAction<Partial<CustomerCallAuditState["filters"]>>
    ) {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearCallAuditErrorAct(state) {
      state.error = null
    },
    clearCallAuditsByCallAct(state) {
      state.auditsByCall = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallAuditConfigThunk.pending, (state) => {
        state.loadingConfig = true
        state.error = null
      })
      .addCase(fetchCallAuditConfigThunk.fulfilled, (state, action) => {
        state.loadingConfig = false
        state.config = action.payload
      })
      .addCase(fetchCallAuditConfigThunk.rejected, (state, action) => {
        state.loadingConfig = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(fetchCallAuditResultsThunk.pending, (state) => {
        state.loadingResults = true
        state.error = null
      })
      .addCase(fetchCallAuditResultsThunk.fulfilled, (state, action) => {
        state.loadingResults = false
        state.auditResults = action.payload
      })
      .addCase(fetchCallAuditResultsThunk.rejected, (state, action) => {
        state.loadingResults = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(fetchCallAuditAuditorProgressThunk.pending, (state) => {
        state.loadingAuditorProgress = true
        state.error = null
      })
      .addCase(fetchCallAuditAuditorProgressThunk.fulfilled, (state, action) => {
        state.loadingAuditorProgress = false
        state.auditorProgress = action.payload
      })
      .addCase(fetchCallAuditAuditorProgressThunk.rejected, (state, action) => {
        state.loadingAuditorProgress = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(fetchCallAuditAiReviewThunk.pending, (state) => {
        state.loadingAiReview = true
        state.error = null
      })
      .addCase(fetchCallAuditAiReviewThunk.fulfilled, (state, action) => {
        state.loadingAiReview = false
        state.aiReview = action.payload
      })
      .addCase(fetchCallAuditAiReviewThunk.rejected, (state, action) => {
        state.loadingAiReview = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(fetchCallAuditsByCallThunk.pending, (state) => {
        state.loadingAudits = true
        state.error = null
      })
      .addCase(fetchCallAuditsByCallThunk.fulfilled, (state, action) => {
        state.loadingAudits = false
        state.auditsByCall = action.payload
      })
      .addCase(fetchCallAuditsByCallThunk.rejected, (state, action) => {
        state.loadingAudits = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(submitHumanCallAuditThunk.pending, (state) => {
        state.submitting = true
        state.error = null
      })
      .addCase(submitHumanCallAuditThunk.fulfilled, (state, action) => {
        state.submitting = false
        state.auditsByCall = action.payload.audits
      })
      .addCase(submitHumanCallAuditThunk.rejected, (state, action) => {
        state.submitting = false
        state.error = (action.payload as string) ?? "Error"
      })
      .addCase(analyzeCallAuditThunk.pending, (state, action) => {
        state.analyzingCallLogIds = addAnalyzingCallLogId(
          state.analyzingCallLogIds,
          action.meta.arg
        )
        state.error = null
      })
      .addCase(analyzeCallAuditThunk.fulfilled, (state, action) => {
        state.analyzingCallLogIds = removeAnalyzingCallLogId(
          state.analyzingCallLogIds,
          action.payload.callLogId
        )
        state.auditsByCall = action.payload.audits
        if (state.aiReview !== null) {
          const idx = state.aiReview.items.findIndex(
            (item) => item.callLogId === action.payload.callLogId
          )
          if (idx >= 0) {
            const ai = action.payload.audits.ai
            const aiStatus =
              ai?.status === "completed"
                ? "completed"
                : ai?.status === "failed"
                  ? "failed"
                  : ai?.status === "pending"
                    ? "pending"
                    : "none"
            state.aiReview.items[idx] = {
              ...state.aiReview.items[idx],
              aiStatus,
              ai,
            }
          }
        }
      })
      .addCase(analyzeCallAuditThunk.rejected, (state, action) => {
        state.analyzingCallLogIds = removeAnalyzingCallLogId(
          state.analyzingCallLogIds,
          action.meta.arg
        )
        state.error = (action.payload as string) ?? "Error"
      })
  },
})

export const {
  setCallAuditFiltersAct,
  clearCallAuditErrorAct,
  clearCallAuditsByCallAct,
} = customerCallAuditSlice.actions
export default customerCallAuditSlice.reducer
