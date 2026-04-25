import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import {
  createSignupCampaignReq,
  fetchSignupCampaignRegistrationsReq,
  fetchSignupCampaignsReq,
  updateSignupCampaignReq,
} from "../services/signup-campaign-admin.service"
import type {
  CreateSignupCampaignReqBody,
  SignupCampaignAdminItem,
  SignupCampaignRegistrationItem,
  UpdateSignupCampaignReqBody,
} from "../types/signup-campaign.types"
import type { SignupCampaignState } from "./signup-campaign.state"

const initialState: SignupCampaignState = {
  items: [],
  itemsLoading: false,
  itemsError: null,
  selectedCampaignId: null,
  registrations: [],
  registrationsLoading: false,
  registrationsError: null,
  createStatus: "idle",
  createError: null,
  updatingCampaignId: null,
}

export const fetchSignupCampaignsThunk = createAsyncThunk(
  "signupCampaign/fetchAll",
  async () => {
    return fetchSignupCampaignsReq()
  },
)

export const createSignupCampaignThunk = createAsyncThunk<
  SignupCampaignAdminItem | null,
  CreateSignupCampaignReqBody
>("signupCampaign/create", async (body) => {
  return createSignupCampaignReq(body)
})

export const updateSignupCampaignThunk = createAsyncThunk<
  SignupCampaignAdminItem | null,
  { readonly id: string; readonly body: UpdateSignupCampaignReqBody }
>("signupCampaign/update", async ({ id, body }) => {
  return updateSignupCampaignReq(id, body)
})

export const fetchSignupCampaignRegistrationsThunk = createAsyncThunk<
  SignupCampaignRegistrationItem[],
  string
>("signupCampaign/fetchRegistrations", async (campaignId) => {
  return fetchSignupCampaignRegistrationsReq(campaignId)
})

const signupCampaignSlice = createSlice({
  name: "signupCampaign",
  initialState,
  reducers: {
    selectSignupCampaignAct: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedCampaignId = action.payload
      if (action.payload === null) {
        state.registrations = []
        state.registrationsError = null
      }
    },
    clearSignupCampaignErrorAct: (state) => {
      state.itemsError = null
      state.registrationsError = null
      state.createError = null
    },
    resetCreateSignupCampaignStatusAct: (state) => {
      state.createStatus = "idle"
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignupCampaignsThunk.pending, (state) => {
        state.itemsLoading = true
        state.itemsError = null
      })
      .addCase(fetchSignupCampaignsThunk.fulfilled, (state, action) => {
        state.itemsLoading = false
        state.items = action.payload
      })
      .addCase(fetchSignupCampaignsThunk.rejected, (state, action) => {
        state.itemsLoading = false
        state.itemsError =
          action.error.message != null
            ? action.error.message
            : "Failed to load signup campaigns"
      })
      .addCase(createSignupCampaignThunk.pending, (state) => {
        state.createStatus = "submitting"
        state.createError = null
      })
      .addCase(createSignupCampaignThunk.fulfilled, (state, action) => {
        state.createStatus = "success"
        if (action.payload != null) {
          state.items = [action.payload, ...state.items]
        }
      })
      .addCase(createSignupCampaignThunk.rejected, (state, action) => {
        state.createStatus = "error"
        state.createError =
          action.error.message != null
            ? action.error.message
            : "Failed to create signup campaign"
      })
      .addCase(updateSignupCampaignThunk.pending, (state, action) => {
        state.updatingCampaignId = action.meta.arg.id
      })
      .addCase(updateSignupCampaignThunk.fulfilled, (state, action) => {
        state.updatingCampaignId = null
        const updated = action.payload
        if (updated == null) return
        const idx = state.items.findIndex((c) => c.id === updated.id)
        if (idx !== -1) {
          state.items[idx] = updated
        }
      })
      .addCase(updateSignupCampaignThunk.rejected, (state, action) => {
        state.updatingCampaignId = null
        state.itemsError =
          action.error.message != null
            ? action.error.message
            : "Failed to update signup campaign"
      })
      .addCase(fetchSignupCampaignRegistrationsThunk.pending, (state) => {
        state.registrationsLoading = true
        state.registrationsError = null
      })
      .addCase(
        fetchSignupCampaignRegistrationsThunk.fulfilled,
        (state, action) => {
          state.registrationsLoading = false
          state.registrations = action.payload
        },
      )
      .addCase(
        fetchSignupCampaignRegistrationsThunk.rejected,
        (state, action) => {
          state.registrationsLoading = false
          state.registrationsError =
            action.error.message != null
              ? action.error.message
              : "Failed to load registrations"
        },
      )
  },
})

export const {
  selectSignupCampaignAct,
  clearSignupCampaignErrorAct,
  resetCreateSignupCampaignStatusAct,
} = signupCampaignSlice.actions

const selectSlice = (state: RootState): SignupCampaignState =>
  state.signupCampaign

export const selectSignupCampaignsItems = createSelector(
  [selectSlice],
  (slice) => slice.items,
)

export const selectSignupCampaignsLoading = createSelector(
  [selectSlice],
  (slice) => slice.itemsLoading,
)

export const selectSignupCampaignsError = createSelector(
  [selectSlice],
  (slice) => slice.itemsError,
)

export const selectSelectedSignupCampaignId = createSelector(
  [selectSlice],
  (slice) => slice.selectedCampaignId,
)

export const selectSignupCampaignById = (id: string | null) =>
  createSelector([selectSignupCampaignsItems], (items) => {
    if (id === null) return null
    return items.find((c) => c.id === id) ?? null
  })

export const selectSignupCampaignRegistrations = createSelector(
  [selectSlice],
  (slice) => slice.registrations,
)

export const selectSignupCampaignRegistrationsLoading = createSelector(
  [selectSlice],
  (slice) => slice.registrationsLoading,
)

export const selectSignupCampaignRegistrationsError = createSelector(
  [selectSlice],
  (slice) => slice.registrationsError,
)

export const selectCreateSignupCampaignStatus = createSelector(
  [selectSlice],
  (slice) => slice.createStatus,
)

export const selectCreateSignupCampaignError = createSelector(
  [selectSlice],
  (slice) => slice.createError,
)

export const selectUpdatingSignupCampaignId = createSelector(
  [selectSlice],
  (slice) => slice.updatingCampaignId,
)

export default signupCampaignSlice.reducer
