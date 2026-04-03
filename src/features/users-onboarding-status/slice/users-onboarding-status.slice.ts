import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import type { RootState } from "../../../app/store"
import type { OnboardingStateType, OnboardingStatusType } from "../types/onboarding-state.types"
import { isOrphanOnboardingListRow } from "../types/onboarding-state.types"
import type { UsersOnboardingStatusState } from "./users-onboarding-status.state"
import {
  getOnboardingStateListReq,
  getOnboardingFlowLogsReq,
  getUserOnboardingFlowsReq,
  triggerOnboardingFlowReq,
  deleteOnboardingFlowsReq,
  recreateImportSchedulesReq
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
  selectedOrphanRowIds: [],
  selectedRescheduleUserIds: [],
  bulkDeleteFlowsLoading: false,
  bulkRecreateSchedulesLoading: false,
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

/** Sends list row `_id` values as `flowIds` to `POST onboarding-state/flows/delete` (no pipeline/logs). */
export const deleteOnboardingFlowsBySelectedIdsThunk = createAsyncThunk<
  { deletedCount: number },
  string[],
  { state: RootState; rejectValue: string }
>(
  "usersOnboardingStatus/deleteFlowsBySelectedIds",
  async (flowIds, { dispatch, getState, rejectWithValue }) => {
    try {
      if (flowIds.length === 0) {
        return rejectWithValue("noSelection")
      }
      const { deletedCount } = await deleteOnboardingFlowsReq(flowIds)
      const { statusFilter } = getState().usersOnboardingStatus
      const status = statusFilter === "all" ? undefined : statusFilter
      await dispatch(fetchUsersOnboardingStatusThunk({ status }))
      return { deletedCount }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "deleteFailed"
      return rejectWithValue(msg)
    }
  }
)

export const recreateImportSchedulesForNeedsHumanWhatsappThunk = createAsyncThunk<
  { updatedCount: number },
  void,
  { state: RootState; rejectValue: string }
>(
  "usersOnboardingStatus/recreateImportSchedulesForNeedsHumanWhatsapp",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const { items, statusFilter } = getState().usersOnboardingStatus
      const userIds = Array.from(
        new Set(
          items
            .filter((x) => x.status === "Needs_human_whatsapp")
            .map((x) => x.userId?._id)
            .filter((id): id is string => typeof id === "string" && id.trim() !== "")
        )
      )

      if (userIds.length === 0) {
        return rejectWithValue("noNeedsHumanWhatsappUsers")
      }

      const result = await recreateImportSchedulesReq({
        userIds,
        importFirstStep: "scheduled_whatsapp_import_greeting"
      })
      const status = statusFilter === "all" ? undefined : statusFilter
      await dispatch(fetchUsersOnboardingStatusThunk({ status }))
      return { updatedCount: result.length }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "recreateSchedulesFailed"
      return rejectWithValue(msg)
    }
  }
)

export const recreateImportSchedulesForSelectedUserIdsThunk = createAsyncThunk<
  { updatedCount: number },
  { importFirstStep: UserImportFirstStepType },
  { state: RootState; rejectValue: string }
>(
  "usersOnboardingStatus/recreateImportSchedulesForSelectedUserIds",
  async ({ importFirstStep }, { dispatch, getState, rejectWithValue }) => {
    try {
      const { selectedRescheduleUserIds, statusFilter } = getState().usersOnboardingStatus
      const userIds = Array.from(
        new Set(
          selectedRescheduleUserIds.filter((id) => typeof id === "string" && id.trim() !== "")
        )
      )

      if (userIds.length === 0) {
        return rejectWithValue("noRescheduleSelection")
      }

      const result = await recreateImportSchedulesReq({ userIds, importFirstStep })
      const status = statusFilter === "all" ? undefined : statusFilter
      await dispatch(fetchUsersOnboardingStatusThunk({ status }))
      return { updatedCount: result.length }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "recreateSchedulesFailed"
      return rejectWithValue(msg)
    }
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
    },
    toggleOrphanOnboardingRowSelectedAct: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const i = state.selectedOrphanRowIds.indexOf(id)
      if (i >= 0) state.selectedOrphanRowIds.splice(i, 1)
      else state.selectedOrphanRowIds.push(id)
    },
    toggleSelectAllVisibleOrphanOnboardingRowsAct: (state, action: PayloadAction<string[]>) => {
      const orphanIds = action.payload
      const set = new Set(orphanIds)
      const allSelected =
        orphanIds.length > 0 && orphanIds.every((id) => state.selectedOrphanRowIds.includes(id))
      if (allSelected) {
        state.selectedOrphanRowIds = state.selectedOrphanRowIds.filter((id) => !set.has(id))
      } else {
        state.selectedOrphanRowIds = [...new Set([...state.selectedOrphanRowIds, ...orphanIds])]
      }
    },
    toggleRescheduleUserSelectedAct: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const i = state.selectedRescheduleUserIds.indexOf(id)
      if (i >= 0) state.selectedRescheduleUserIds.splice(i, 1)
      else state.selectedRescheduleUserIds.push(id)
    },
    toggleSelectAllVisibleRescheduleUsersAct: (state, action: PayloadAction<string[]>) => {
      const userIds = action.payload
      const set = new Set(userIds)
      const allSelected =
        userIds.length > 0 &&
        userIds.every((id) => state.selectedRescheduleUserIds.includes(id))
      if (allSelected) {
        state.selectedRescheduleUserIds = state.selectedRescheduleUserIds.filter((id) => !set.has(id))
      } else {
        state.selectedRescheduleUserIds = [
          ...new Set([...state.selectedRescheduleUserIds, ...userIds])
        ]
      }
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
          const valid = new Set(
            action.payload
              .filter(isOrphanOnboardingListRow)
              .map((x) => x._id)
              .filter((id): id is string => Boolean(id))
          )
          state.selectedOrphanRowIds = state.selectedOrphanRowIds.filter((id) => valid.has(id))
          const validUserIds = new Set(
            action.payload
              .map((x) => x.userId?._id)
              .filter((id): id is string => Boolean(id))
          )
          state.selectedRescheduleUserIds = state.selectedRescheduleUserIds.filter((id) =>
            validUserIds.has(id)
          )
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
      .addCase(deleteOnboardingFlowsBySelectedIdsThunk.pending, (state) => {
        state.bulkDeleteFlowsLoading = true
      })
      .addCase(deleteOnboardingFlowsBySelectedIdsThunk.fulfilled, (state) => {
        state.bulkDeleteFlowsLoading = false
        state.selectedOrphanRowIds = []
      })
      .addCase(deleteOnboardingFlowsBySelectedIdsThunk.rejected, (state) => {
        state.bulkDeleteFlowsLoading = false
      })
      .addCase(recreateImportSchedulesForNeedsHumanWhatsappThunk.pending, (state) => {
        state.bulkRecreateSchedulesLoading = true
      })
      .addCase(recreateImportSchedulesForNeedsHumanWhatsappThunk.fulfilled, (state) => {
        state.bulkRecreateSchedulesLoading = false
      })
      .addCase(recreateImportSchedulesForNeedsHumanWhatsappThunk.rejected, (state) => {
        state.bulkRecreateSchedulesLoading = false
      })
      .addCase(recreateImportSchedulesForSelectedUserIdsThunk.pending, (state) => {
        state.bulkRecreateSchedulesLoading = true
      })
      .addCase(recreateImportSchedulesForSelectedUserIdsThunk.fulfilled, (state) => {
        state.bulkRecreateSchedulesLoading = false
        state.selectedRescheduleUserIds = []
      })
      .addCase(recreateImportSchedulesForSelectedUserIdsThunk.rejected, (state) => {
        state.bulkRecreateSchedulesLoading = false
      })
  }
})

export const {
  setOnboardingStatusFilterAct,
  setOnboardingSearchTermAct,
  clearUsersOnboardingStatusErrorAct,
  clearHistoryFlowsAct,
  clearHistoryFlowLogsAct,
  toggleOrphanOnboardingRowSelectedAct,
  toggleSelectAllVisibleOrphanOnboardingRowsAct,
  toggleRescheduleUserSelectedAct,
  toggleSelectAllVisibleRescheduleUsersAct
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
    const idMatch = (x._id ?? "").toLowerCase().includes(term)
    return fullName.includes(term) || email.includes(term) || idMatch
  })
}

export const selectSelectedOrphanOnboardingRowIds = (state: RootState) =>
  state.usersOnboardingStatus.selectedOrphanRowIds

export const selectSelectedRescheduleUserIds = (state: RootState) =>
  state.usersOnboardingStatus.selectedRescheduleUserIds

export default usersOnboardingStatusSlice.reducer

