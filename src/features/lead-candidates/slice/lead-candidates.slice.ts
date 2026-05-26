import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type {
  CreateLeadCandidatePayload,
  LeadCandidateRow,
  UpdateLeadCandidatePayload,
} from "../types/lead-candidates.types"
import {
  createLeadCandidateReq,
  getLeadCandidateByIdReq,
  listLeadCandidatesReq,
  updateLeadCandidateReq,
} from "../services/lead-candidates.service"
import {
  leadCandidatesInitialState,
  type LeadCandidatesSliceState,
} from "./lead-candidates.state"

export const fetchLeadCandidatesThunk = createAsyncThunk(
  "leadCandidates/fetchList",
  async (_: void, { getState }) => {
    const { filters } = (getState() as RootState).leadCandidates
    return listLeadCandidatesReq({
      dateFrom: filters.excludeDate ? undefined : filters.dateFrom,
      dateTo: filters.excludeDate ? undefined : filters.dateTo,
      excludeDate: filters.excludeDate,
      search: filters.search,
      page: filters.page,
      limit: filters.limit,
    })
  },
)

export const fetchLeadCandidateDetailThunk = createAsyncThunk(
  "leadCandidates/fetchDetail",
  async (id: string) => {
    return getLeadCandidateByIdReq(id)
  },
)

export const createLeadCandidateThunk = createAsyncThunk(
  "leadCandidates/create",
  async (payload: CreateLeadCandidatePayload) => {
    return createLeadCandidateReq(payload)
  },
)

export const updateLeadCandidateThunk = createAsyncThunk(
  "leadCandidates/update",
  async (input: { readonly id: string; readonly payload: UpdateLeadCandidatePayload }) => {
    return updateLeadCandidateReq(input.id, input.payload)
  },
)

const leadCandidatesSlice = createSlice({
  name: "leadCandidates",
  initialState: leadCandidatesInitialState,
  reducers: {
    clearLeadCandidatesErrorAct: (state) => {
      state.error = null
    },
    setLeadCandidatesFiltersAct: (
      state,
      action: PayloadAction<
        Partial<LeadCandidatesSliceState["filters"]>
      >,
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearLeadCandidateDetailAct: (state) => {
      state.detailRow = null
      state.isLoadingDetail = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadCandidatesThunk.pending, (state) => {
        state.isLoadingRows = true
        state.error = null
      })
      .addCase(fetchLeadCandidatesThunk.fulfilled, (state, action) => {
        state.isLoadingRows = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchLeadCandidatesThunk.rejected, (state, action) => {
        state.isLoadingRows = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "fetch list failed"
      })
      .addCase(fetchLeadCandidateDetailThunk.pending, (state) => {
        state.isLoadingDetail = true
        state.error = null
      })
      .addCase(fetchLeadCandidateDetailThunk.fulfilled, (state, action) => {
        state.isLoadingDetail = false
        state.detailRow = action.payload
      })
      .addCase(fetchLeadCandidateDetailThunk.rejected, (state, action) => {
        state.isLoadingDetail = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "fetch detail failed"
      })
      .addCase(createLeadCandidateThunk.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(createLeadCandidateThunk.fulfilled, (state) => {
        state.isSubmitting = false
      })
      .addCase(createLeadCandidateThunk.rejected, (state, action) => {
        state.isSubmitting = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "create failed"
      })
      .addCase(updateLeadCandidateThunk.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(updateLeadCandidateThunk.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.detailRow = action.payload
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateLeadCandidateThunk.rejected, (state, action) => {
        state.isSubmitting = false
        state.error =
          action.error.message != null
            ? action.error.message
            : "update failed"
      })
  },
})

export const {
  clearLeadCandidatesErrorAct,
  setLeadCandidatesFiltersAct,
  clearLeadCandidateDetailAct,
} = leadCandidatesSlice.actions

export default leadCandidatesSlice.reducer

export const selectLeadCandidatesState = (
  root: RootState,
): LeadCandidatesSliceState => root.leadCandidates
