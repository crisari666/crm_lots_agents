import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
  getCeoLeadsResumeReq,
  getCeoOperationsSummaryReq,
} from "../../../app/services/ceo-operations-summary.service"
import { listCustomersAdmin } from "../../customer-v2/services/customers-ms.service"
import type { CeoOperationsSummaryState } from "./ceo-operations-summary.state"

const initialState: CeoOperationsSummaryState = {
  summary: null,
  crmV2Total: null,
  crmV2Skipped: false,
  isLoading: false,
  error: null,
  crmError: null,
  leadsResume: null,
  isLeadsResumeLoading: false,
  leadsResumeError: null,
}

export type FetchCeoOperationsSummaryParams = {
  readonly fromIso: string
  readonly toMonolithIso: string
  readonly crmToIso: string
}

export const fetchCeoOperationsSummaryThunk = createAsyncThunk(
  "ceoOperationsSummary/fetch",
  async (params: FetchCeoOperationsSummaryParams) => {
    const cmsBase = (import.meta.env.VITE_URL_CUSTOMERS_MS as string | undefined)?.trim() ?? ""
    const cmsPromise: Promise<{ total: number | null; err: string | null }> =
      cmsBase.length > 0
        ? listCustomersAdmin({
            createdFrom: params.fromIso,
            createdTo: params.crmToIso,
            limit: 1,
            skip: 0,
          })
            .then((cms) => ({ total: cms.total, err: null }))
            .catch(() => ({ total: null, err: "CRM V2: no disponible" }))
        : Promise.resolve({ total: null, err: null })
    const [summary, cms] = await Promise.all([
      getCeoOperationsSummaryReq({ from: params.fromIso, to: params.toMonolithIso }),
      cmsPromise,
    ])
    return {
      summary,
      crmV2Total: cms.err !== null ? null : cms.total,
      crmV2Skipped: cmsBase.length === 0,
      crmError: cms.err,
    }
  }
)

export type FetchCeoLeadsResumeParams = {
  readonly fromIso: string
  readonly toMonolithIso: string
  readonly includeDetails: boolean
}

export const fetchCeoLeadsResumeThunk = createAsyncThunk(
  "ceoOperationsSummary/fetchLeadsResume",
  async (params: FetchCeoLeadsResumeParams) =>
    getCeoLeadsResumeReq({
      from: params.fromIso,
      to: params.toMonolithIso,
      includeDetails: params.includeDetails,
    })
)

const ceoOperationsSummarySlice = createSlice({
  name: "ceoOperationsSummary",
  initialState,
  reducers: {
    clearCeoOperationsSummaryErrorAct: (state) => {
      state.error = null
    },
    clearCeoOperationsSummaryCrmErrorAct: (state) => {
      state.crmError = null
    },
    clearCeoLeadsResumeErrorAct: (state) => {
      state.leadsResumeError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCeoOperationsSummaryThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.crmError = null
      })
      .addCase(fetchCeoOperationsSummaryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload.summary
        state.crmV2Total = action.payload.crmV2Total
        state.crmV2Skipped = action.payload.crmV2Skipped
        state.crmError = action.payload.crmError
      })
      .addCase(fetchCeoOperationsSummaryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.summary = null
        state.crmV2Total = null
        state.crmV2Skipped = false
        state.error =
          action.error.message != null ? action.error.message : "Error al cargar datos"
      })
      .addCase(fetchCeoLeadsResumeThunk.pending, (state) => {
        state.isLeadsResumeLoading = true
        state.leadsResumeError = null
      })
      .addCase(fetchCeoLeadsResumeThunk.fulfilled, (state, action) => {
        state.isLeadsResumeLoading = false
        state.leadsResume = action.payload
      })
      .addCase(fetchCeoLeadsResumeThunk.rejected, (state, action) => {
        state.isLeadsResumeLoading = false
        state.leadsResume = null
        state.leadsResumeError =
          action.error.message != null
            ? action.error.message
            : "Error al cargar el resumen de leads"
      })
  },
})

export const {
  clearCeoOperationsSummaryErrorAct,
  clearCeoOperationsSummaryCrmErrorAct,
  clearCeoLeadsResumeErrorAct,
} =
  ceoOperationsSummarySlice.actions

export default ceoOperationsSummarySlice.reducer
