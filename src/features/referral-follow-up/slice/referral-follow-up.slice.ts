import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type { CreateReferralSituationPayload } from "../types/referral-follow-up.types"
import {
  createReferralSituationReq,
  getEligibleReferralUsersReq,
  listReferralSituationsReq,
} from "../services/referral-follow-up.service"
import {
  referralFollowUpInitialState,
  type ReferralFollowUpSliceState,
} from "./referral-follow-up.state"

export const fetchEligibleReferralUsersThunk = createAsyncThunk(
  "referralFollowUp/fetchEligible",
  async () => {
    return getEligibleReferralUsersReq()
  },
)

export const fetchReferralSituationsThunk = createAsyncThunk(
  "referralFollowUp/fetchSituations",
  async (params: { readonly dateFrom: Date; readonly dateTo: Date }) => {
    return listReferralSituationsReq(params)
  },
)

export const createReferralSituationThunk = createAsyncThunk(
  "referralFollowUp/createSituation",
  async (payload: CreateReferralSituationPayload) => {
    return createReferralSituationReq(payload)
  },
)

const referralFollowUpSlice = createSlice({
  name: "referralFollowUp",
  initialState: referralFollowUpInitialState,
  reducers: {
    clearReferralFollowUpErrorAct: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEligibleReferralUsersThunk.pending, (state) => {
        state.isLoadingEligible = true
        state.error = null
      })
      .addCase(fetchEligibleReferralUsersThunk.fulfilled, (state, action) => {
        state.isLoadingEligible = false
        state.eligibleUsers = action.payload
      })
      .addCase(fetchEligibleReferralUsersThunk.rejected, (state, action) => {
        state.isLoadingEligible = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "fetch eligible failed"
      })
      .addCase(fetchReferralSituationsThunk.pending, (state) => {
        state.isLoadingRows = true
        state.error = null
      })
      .addCase(fetchReferralSituationsThunk.fulfilled, (state, action) => {
        state.isLoadingRows = false
        state.rows = action.payload
      })
      .addCase(fetchReferralSituationsThunk.rejected, (state, action) => {
        state.isLoadingRows = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "fetch situations failed"
      })
      .addCase(createReferralSituationThunk.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(createReferralSituationThunk.fulfilled, (state) => {
        state.isSubmitting = false
      })
      .addCase(createReferralSituationThunk.rejected, (state, action) => {
        state.isSubmitting = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "create failed"
      })
  },
})

export const { clearReferralFollowUpErrorAct } = referralFollowUpSlice.actions

export default referralFollowUpSlice.reducer

export const selectReferralFollowUpState = (
  root: RootState,
): ReferralFollowUpSliceState => root.referralFollowUp
