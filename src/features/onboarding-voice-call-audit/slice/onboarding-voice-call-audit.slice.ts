import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import {
  analyzeOnboardingVoiceCallAuditBackfill,
  analyzeOnboardingVoiceCallAuditFlow,
  getOnboardingVoiceCallAuditAiReview,
  getOnboardingVoiceCallAuditConfig,
} from "../services/onboarding-voice-call-audit.http"
import { monthRangeIsoFromYYYYMM } from "../business-logic/onboarding-voice-call-audit-summary-display"
import type {
  OnboardingVoiceCallAuditAiReviewListResponse,
  OnboardingVoiceCallAuditBackfillResponse,
  OnboardingVoiceCallAuditConfigResponse,
} from "../types/onboarding-voice-call-audit.types"

export type OnboardingVoiceCallAuditState = {
  config: OnboardingVoiceCallAuditConfigResponse | null
  aiReview: OnboardingVoiceCallAuditAiReviewListResponse | null
  filters: { month: string; onlyWithoutAi: boolean }
  loadingConfig: boolean
  loadingAiReview: boolean
  analyzingFlowIds: string[]
  isBackfillRunning: boolean
  backfillResult: OnboardingVoiceCallAuditBackfillResponse | null
  error: string | null
}

function defaultMonth(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  return `${y}-${m}`
}

function addAnalyzingFlowId(ids: string[], flowId: string): string[] {
  if (ids.includes(flowId)) {
    return ids
  }
  return [...ids, flowId]
}

function removeAnalyzingFlowId(ids: string[], flowId: string): string[] {
  return ids.filter((id) => id !== flowId)
}

function resolveErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message !== "") {
    return err.message
  }
  return fallback
}

const initialState: OnboardingVoiceCallAuditState = {
  config: null,
  aiReview: null,
  filters: { month: defaultMonth(), onlyWithoutAi: false },
  loadingConfig: false,
  loadingAiReview: false,
  analyzingFlowIds: [],
  isBackfillRunning: false,
  backfillResult: null,
  error: null,
}

function buildAiReviewParams(
  filters: OnboardingVoiceCallAuditState["filters"]
): Parameters<typeof getOnboardingVoiceCallAuditAiReview>[0] {
  return {
    month: filters.month,
    limit: 200,
    skip: 0,
    ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
  }
}

export const fetchOnboardingVoiceCallAuditConfigThunk = createAsyncThunk(
  "onboardingVoiceCallAudit/fetchConfig",
  async (_, { rejectWithValue }) => {
    try {
      return await getOnboardingVoiceCallAuditConfig()
    } catch (err: unknown) {
      return rejectWithValue(
        resolveErrorMessage(err, "No se pudo cargar la configuración.")
      )
    }
  }
)

export const fetchOnboardingVoiceCallAuditAiReviewThunk = createAsyncThunk(
  "onboardingVoiceCallAudit/fetchAiReview",
  async (
    params: Parameters<typeof getOnboardingVoiceCallAuditAiReview>[0] | undefined,
    { getState, rejectWithValue }
  ) => {
    try {
      const filters = (getState() as RootState).onboardingVoiceCallAudit.filters
      return await getOnboardingVoiceCallAuditAiReview(params ?? buildAiReviewParams(filters))
    } catch (err: unknown) {
      return rejectWithValue(
        resolveErrorMessage(err, "No se pudo cargar la revisión IA.")
      )
    }
  }
)

export const analyzeOnboardingVoiceCallAuditFlowThunk = createAsyncThunk(
  "onboardingVoiceCallAudit/analyzeFlow",
  async (flowId: string, { rejectWithValue }) => {
    try {
      await analyzeOnboardingVoiceCallAuditFlow(flowId)
      return { flowId }
    } catch (err: unknown) {
      return rejectWithValue(
        resolveErrorMessage(err, "No se pudo ejecutar el análisis con IA.")
      )
    }
  }
)

export const analyzeOnboardingVoiceCallAuditBackfillThunk = createAsyncThunk(
  "onboardingVoiceCallAudit/analyzeBackfill",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { month } = (getState() as RootState).onboardingVoiceCallAudit.filters
      const { from, to } = monthRangeIsoFromYYYYMM(month)
      const result = await analyzeOnboardingVoiceCallAuditBackfill({
        from,
        to,
        onlyMissing: true,
        limit: 50,
      })
      return result
    } catch (err: unknown) {
      return rejectWithValue(
        resolveErrorMessage(err, "No se pudo ejecutar el backfill de análisis.")
      )
    }
  }
)

const onboardingVoiceCallAuditSlice = createSlice({
  name: "onboardingVoiceCallAudit",
  initialState,
  reducers: {
    setOnboardingVoiceCallAuditFiltersAct(
      state,
      action: PayloadAction<Partial<OnboardingVoiceCallAuditState["filters"]>>
    ) {
      state.filters = { ...state.filters, ...action.payload }
      if (action.payload.month !== undefined) {
        state.backfillResult = null
      }
    },
    clearOnboardingVoiceCallAuditErrorAct(state) {
      state.error = null
    },
    clearOnboardingVoiceCallAuditBackfillResultAct(state) {
      state.backfillResult = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboardingVoiceCallAuditConfigThunk.pending, (state) => {
        state.loadingConfig = true
      })
      .addCase(fetchOnboardingVoiceCallAuditConfigThunk.fulfilled, (state, action) => {
        state.loadingConfig = false
        state.config = action.payload
      })
      .addCase(fetchOnboardingVoiceCallAuditConfigThunk.rejected, (state, action) => {
        state.loadingConfig = false
        state.error =
          typeof action.payload === "string" ? action.payload : "Error al cargar configuración"
      })
      .addCase(fetchOnboardingVoiceCallAuditAiReviewThunk.pending, (state) => {
        state.loadingAiReview = true
        state.error = null
      })
      .addCase(fetchOnboardingVoiceCallAuditAiReviewThunk.fulfilled, (state, action) => {
        state.loadingAiReview = false
        state.aiReview = action.payload
      })
      .addCase(fetchOnboardingVoiceCallAuditAiReviewThunk.rejected, (state, action) => {
        state.loadingAiReview = false
        state.error =
          typeof action.payload === "string" ? action.payload : "Error al cargar revisión IA"
      })
      .addCase(analyzeOnboardingVoiceCallAuditFlowThunk.pending, (state, action) => {
        state.analyzingFlowIds = addAnalyzingFlowId(
          state.analyzingFlowIds,
          action.meta.arg
        )
        state.error = null
      })
      .addCase(analyzeOnboardingVoiceCallAuditFlowThunk.fulfilled, (state, action) => {
        state.analyzingFlowIds = removeAnalyzingFlowId(
          state.analyzingFlowIds,
          action.payload.flowId
        )
      })
      .addCase(analyzeOnboardingVoiceCallAuditFlowThunk.rejected, (state, action) => {
        state.analyzingFlowIds = removeAnalyzingFlowId(
          state.analyzingFlowIds,
          action.meta.arg
        )
        state.error =
          typeof action.payload === "string" ? action.payload : "Error al analizar"
      })
      .addCase(analyzeOnboardingVoiceCallAuditBackfillThunk.pending, (state) => {
        state.isBackfillRunning = true
        state.error = null
      })
      .addCase(analyzeOnboardingVoiceCallAuditBackfillThunk.fulfilled, (state, action) => {
        state.isBackfillRunning = false
        state.backfillResult = action.payload
      })
      .addCase(analyzeOnboardingVoiceCallAuditBackfillThunk.rejected, (state, action) => {
        state.isBackfillRunning = false
        state.error =
          typeof action.payload === "string" ? action.payload : "Error en backfill"
      })
  },
})

export const {
  setOnboardingVoiceCallAuditFiltersAct,
  clearOnboardingVoiceCallAuditErrorAct,
  clearOnboardingVoiceCallAuditBackfillResultAct,
} = onboardingVoiceCallAuditSlice.actions

export default onboardingVoiceCallAuditSlice.reducer
