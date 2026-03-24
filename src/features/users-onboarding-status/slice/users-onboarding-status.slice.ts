import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type { OnboardingStateType, OnboardingStatusType } from "../types/onboarding-state.types"
import type { UsersOnboardingStatusState } from "./users-onboarding-status.state"
import {
  getOnboardingStateListReq,
  getOnboardingFlowLogsReq,
  getUserOnboardingFlowsReq,
  triggerOnboardingFlowReq
} from "../services/onboarding-state.service"

const historyFlowsInitial = {
  userId: null,
  items: [] as UsersOnboardingStatusState["historyFlows"]["items"],
  isLoading: false,
  error: null
}

const historyFlowLogsInitial = {
  flowId: null,
  detail: null,
  isLoading: false,
  error: null
}

const initialState: UsersOnboardingStatusState = {
  items: [],
  isLoading: false,
  error: null,
  statusFilter: "all",
  searchTerm: "",
  historyFlows: historyFlowsInitial,
  historyFlowLogs: historyFlowLogsInitial
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

export const fetchUserOnboardingFlowsThunk = createAsyncThunk(
  "usersOnboardingStatus/fetchUserFlows",
  async (userId: string) => {
    return getUserOnboardingFlowsReq(userId)
  }
)

export const fetchOnboardingFlowLogsThunk = createAsyncThunk(
  "usersOnboardingStatus/fetchFlowLogs",
  async (flowId: string) => {
    return getOnboardingFlowLogsReq(flowId)
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
    },
    clearHistoryFlowsAct: (state) => {
      state.historyFlows = { ...historyFlowsInitial, items: [] }
    },
    clearHistoryFlowLogsAct: (state) => {
      state.historyFlowLogs = { ...historyFlowLogsInitial, detail: null }
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
      .addCase(fetchUserOnboardingFlowsThunk.pending, (state, action) => {
        state.historyFlows.userId = action.meta.arg
        state.historyFlows.isLoading = true
        state.historyFlows.error = null
        state.historyFlows.items = []
      })
      .addCase(fetchUserOnboardingFlowsThunk.fulfilled, (state, action) => {
        if (state.historyFlows.userId !== action.meta.arg) {
          return
        }
        state.historyFlows.isLoading = false
        state.historyFlows.items = action.payload
        state.historyFlows.error = null
      })
      .addCase(fetchUserOnboardingFlowsThunk.rejected, (state, action) => {
        if (state.historyFlows.userId !== action.meta.arg) {
          return
        }
        state.historyFlows.isLoading = false
        state.historyFlows.error =
          action.error.message ?? "Error loading onboarding flows"
      })
      .addCase(fetchOnboardingFlowLogsThunk.pending, (state, action) => {
        state.historyFlowLogs.flowId = action.meta.arg
        state.historyFlowLogs.isLoading = true
        state.historyFlowLogs.error = null
        state.historyFlowLogs.detail = null
      })
      .addCase(fetchOnboardingFlowLogsThunk.fulfilled, (state, action) => {
        if (state.historyFlowLogs.flowId !== action.meta.arg) {
          return
        }
        state.historyFlowLogs.isLoading = false
        state.historyFlowLogs.detail = action.payload
        state.historyFlowLogs.error = null
      })
      .addCase(fetchOnboardingFlowLogsThunk.rejected, (state, action) => {
        if (state.historyFlowLogs.flowId !== action.meta.arg) {
          return
        }
        state.historyFlowLogs.isLoading = false
        state.historyFlowLogs.error = action.error.message ?? "Error loading flow logs"
      })
  }
})

export const {
  setOnboardingStatusFilterAct,
  setOnboardingSearchTermAct,
  clearUsersOnboardingStatusErrorAct,
  clearHistoryFlowsAct,
  clearHistoryFlowLogsAct
} = usersOnboardingStatusSlice.actions

export const selectUsersOnboardingStatusState = (state: RootState) => state.usersOnboardingStatus

export const selectHistoryFlowsState = (state: RootState) =>
  state.usersOnboardingStatus.historyFlows

export const selectHistoryFlowLogsState = (state: RootState) =>
  state.usersOnboardingStatus.historyFlowLogs

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

