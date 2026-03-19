import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type { OnboardingStateType, OnboardingStatusType } from "../types/onboarding-state.types"
import type { UsersOnboardingStatusState } from "./users-onboarding-status.state"
import { getOnboardingStateListReq, triggerOnboardingFlowReq } from "../services/onboarding-state.service"

const initialState: UsersOnboardingStatusState = {
  items: [],
  isLoading: false,
  error: null,
  statusFilter: "all",
  searchTerm: ""
}

export const fetchUsersOnboardingStatusThunk = createAsyncThunk(
  "usersOnboardingStatus/fetchList",
  async ({ status }: { status?: OnboardingStatusType }) => {
    return getOnboardingStateListReq({ status })
  }
)

export const triggerOnboardingFlowThunk = createAsyncThunk(
  "usersOnboardingStatus/triggerFlow",
  async ({
    userId,
    phoneNumber,
    name
  }: {
    userId: string
    phoneNumber: string
    name: string
  }) => {
    return triggerOnboardingFlowReq({ userId, phoneNumber, name })
  }
)

const usersOnboardingStatusSlice = createSlice({
  name: "usersOnboardingStatus",
  initialState,
  reducers: {
    setOnboardingStatusFilterAct: (
      state,
      action: PayloadAction<OnboardingStatusType | "all">
    ) => {
      state.statusFilter = action.payload
    },
    setOnboardingSearchTermAct: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    clearUsersOnboardingStatusErrorAct: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersOnboardingStatusThunk.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchUsersOnboardingStatusThunk.fulfilled,
        (state, action: PayloadAction<OnboardingStateType[]>) => {
          state.isLoading = false
          state.items = action.payload
          state.error = null
        }
      )
      .addCase(fetchUsersOnboardingStatusThunk.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message ?? "Error fetching onboarding users"
      })
  }
})

export const {
  setOnboardingStatusFilterAct,
  setOnboardingSearchTermAct,
  clearUsersOnboardingStatusErrorAct
} = usersOnboardingStatusSlice.actions

export const selectUsersOnboardingStatusState = (state: RootState) => state.usersOnboardingStatus

export const selectUsersOnboardingStatusFilteredItems = (state: RootState) => {
  const { items, searchTerm } = selectUsersOnboardingStatusState(state)
  const term = searchTerm.trim().toLowerCase()
  if (term === "") return items

  return items.filter((x: OnboardingStateType) => {
    const fullName = `${x.userId?.name ?? ""} ${x.userId?.lastName ?? ""}`.trim().toLowerCase()
    const email = (x.userId?.email ?? "").toLowerCase()
    return fullName.includes(term) || email.includes(term)
  })
}

export default usersOnboardingStatusSlice.reducer

