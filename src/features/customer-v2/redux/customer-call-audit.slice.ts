import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import {
  analyzeCallAudit,
  getCallAuditAiReview,
  getCallAuditConfig,
  getCallAuditProgress,
  getCallAuditsByCallLogId,
  submitHumanCallAudit,
} from "../services/customers-ms-admin-call-audit.http"
import type {
  CallAuditAiReviewListResponse,
  CallAuditConfigResponse,
  CallAuditProgressResponse,
  CallAuditsByCallResponse,
  ListCallAuditAiReviewParams,
  ListCallAuditProgressParams,
  SubmitHumanCallAuditBody,
} from "../services/customers-ms-admin-call-audit.types"

export type CustomerCallAuditState = {
  config: CallAuditConfigResponse | null
  progress: CallAuditProgressResponse | null
  aiReview: CallAuditAiReviewListResponse | null
  auditsByCall: CallAuditsByCallResponse | null
  filters: { month: string; agentExternalRef: string; onlyWithoutAi: boolean }
  loadingConfig: boolean
  loadingProgress: boolean
  loadingAiReview: boolean
  loadingAudits: boolean
  submitting: boolean
  analyzing: boolean
  analyzingCallLogId: string | null
  error: string | null
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
  progress: null,
  aiReview: null,
  auditsByCall: null,
  filters: { month: defaultMonth(), agentExternalRef: "", onlyWithoutAi: false },
  loadingConfig: false,
  loadingProgress: false,
  loadingAiReview: false,
  loadingAudits: false,
  submitting: false,
  analyzing: false,
  analyzingCallLogId: null,
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

export const fetchCallAuditProgressThunk = createAsyncThunk(
  "customerCallAudit/fetchProgress",
  async (params: ListCallAuditProgressParams, { rejectWithValue }) => {
    try {
      return await getCallAuditProgress(params)
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo cargar el progreso de auditoría."))
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
    { rejectWithValue }
  ) => {
    try {
      const record = await submitHumanCallAudit(input.callLogId, input.body)
      const audits = await getCallAuditsByCallLogId(input.callLogId)
      return { record, audits }
    } catch (err: unknown) {
      return rejectWithValue(axiosMessage(err, "No se pudo guardar la auditoría."))
    }
  }
)

export const analyzeCallAuditThunk = createAsyncThunk(
  "customerCallAudit/analyze",
  async (callLogId: string, { rejectWithValue }) => {
    try {
      await analyzeCallAudit(callLogId)
      const audits = await getCallAuditsByCallLogId(callLogId)
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
      .addCase(fetchCallAuditProgressThunk.pending, (state) => {
        state.loadingProgress = true
        state.error = null
      })
      .addCase(fetchCallAuditProgressThunk.fulfilled, (state, action) => {
        state.loadingProgress = false
        state.progress = action.payload
      })
      .addCase(fetchCallAuditProgressThunk.rejected, (state, action) => {
        state.loadingProgress = false
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
        state.analyzing = true
        state.analyzingCallLogId = action.meta.arg
        state.error = null
      })
      .addCase(analyzeCallAuditThunk.fulfilled, (state, action) => {
        state.analyzing = false
        state.analyzingCallLogId = null
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
        state.analyzing = false
        state.analyzingCallLogId = null
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
