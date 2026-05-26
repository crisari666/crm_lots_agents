import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import moment from "moment"
import {
  getCeoLeadsResumeReq,
  getCeoOperationsSummaryReq,
} from "../../../app/services/ceo-operations-summary.service"
import type { RootState } from "../../../app/store"
import { getCallAuditAiReview } from "../../customer-v2/services/customers-ms-admin-call-audit.http"
import { listCustomersAdmin } from "../../customer-v2/services/customers-ms.service"
import type { CeoOperationsSummaryState } from "./ceo-operations-summary.state"

const initialState: CeoOperationsSummaryState = {
  summary: null,
  crmV2Total: null,
  crmV2ReferralTotal: null,
  crmV2Skipped: false,
  callAuditAiSummary: null,
  callAuditAiMonth: null,
  callAuditAiSkipped: false,
  isLoading: false,
  error: null,
  crmError: null,
  callAuditAiError: null,
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
  async (params: FetchCeoOperationsSummaryParams, { getState }) => {
    const cmsBase = (import.meta.env.VITE_URL_CUSTOMERS_MS as string | undefined)?.trim() ?? ""
    const isCrmAdmin = (getState() as RootState).login.currentUser?.level === 0
    const cmsPromise: Promise<{ total: number | null; referralTotal: number | null; err: string | null }> =
      cmsBase.length > 0
        ? Promise.all([
            listCustomersAdmin({
              createdFrom: params.fromIso,
              createdTo: params.crmToIso,
              limit: 1,
              skip: 0,
            }),
            listCustomersAdmin({
              createdFrom: params.fromIso,
              createdTo: params.crmToIso,
              isReferral: true,
              limit: 1,
              skip: 0,
            }),
          ])
            .then(([cms, cmsReferral]) => ({
              total: cms.total,
              referralTotal: cmsReferral.total,
              err: null,
            }))
            .catch(() => ({ total: null, referralTotal: null, err: "CRM V2: no disponible" }))
        : Promise.resolve({ total: null, referralTotal: null, err: null })
    const callAuditAiPromise: Promise<{
      summary: CeoOperationsSummaryState["callAuditAiSummary"]
      month: string | null
      err: string | null
      skipped: boolean
    }> =
      cmsBase.length > 0 && isCrmAdmin
        ? getCallAuditAiReview({
            month: moment(params.crmToIso).format("YYYY-MM"),
            limit: 1,
            skip: 0,
          })
            .then((response) => ({
              summary: response.summary,
              month: response.month,
              err: null,
              skipped: false,
            }))
            .catch(() => ({
              summary: null,
              month: null,
              err: "Auditoría IA: no disponible",
              skipped: false,
            }))
        : Promise.resolve({
            summary: null,
            month: null,
            err: null,
            skipped: true,
          })
    const [summary, cms, callAuditAi] = await Promise.all([
      getCeoOperationsSummaryReq({ from: params.fromIso, to: params.toMonolithIso }),
      cmsPromise,
      callAuditAiPromise,
    ])
    return {
      summary,
      crmV2Total: cms.err !== null ? null : cms.total,
      crmV2ReferralTotal: cms.err !== null ? null : cms.referralTotal,
      crmV2Skipped: cmsBase.length === 0,
      crmError: cms.err,
      callAuditAiSummary: callAuditAi.summary,
      callAuditAiMonth: callAuditAi.month,
      callAuditAiSkipped: callAuditAi.skipped,
      callAuditAiError: callAuditAi.err,
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
    clearCeoOperationsSummaryCallAuditAiErrorAct: (state) => {
      state.callAuditAiError = null
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
        state.callAuditAiError = null
      })
      .addCase(fetchCeoOperationsSummaryThunk.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload.summary
        state.crmV2Total = action.payload.crmV2Total
        state.crmV2ReferralTotal = action.payload.crmV2ReferralTotal
        state.crmV2Skipped = action.payload.crmV2Skipped
        state.crmError = action.payload.crmError
        state.callAuditAiSummary = action.payload.callAuditAiSummary
        state.callAuditAiMonth = action.payload.callAuditAiMonth
        state.callAuditAiSkipped = action.payload.callAuditAiSkipped
        state.callAuditAiError = action.payload.callAuditAiError
      })
      .addCase(fetchCeoOperationsSummaryThunk.rejected, (state, action) => {
        state.isLoading = false
        state.summary = null
        state.crmV2Total = null
        state.crmV2ReferralTotal = null
        state.crmV2Skipped = false
        state.callAuditAiSummary = null
        state.callAuditAiMonth = null
        state.callAuditAiSkipped = false
        state.callAuditAiError = null
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
  clearCeoOperationsSummaryCallAuditAiErrorAct,
  clearCeoLeadsResumeErrorAct,
} =
  ceoOperationsSummarySlice.actions

export default ceoOperationsSummarySlice.reducer
