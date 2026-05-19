import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type {
  CreateTrainingSessionPayload,
  UpdateTrainingSessionPayload
} from "../types/training-sessions.types"
import {
  addTrainingSessionAttendeeReq,
  createTrainingSessionReq,
  getTrainingSessionDetailReq,
  listTrainingSessionsReq,
  removeTrainingSessionAttendeeReq,
  searchTrainingSessionUsersReq,
  updateTrainingSessionReq
} from "../services/training-sessions.service"
import {
  trainingSessionsInitialState,
  type TrainingSessionsSliceState
} from "./training-sessions.state"

export const fetchTrainingSessionsThunk = createAsyncThunk(
  "trainingSessions/fetchList",
  async (params: { page: number; limit: number }) => listTrainingSessionsReq(params)
)

export const fetchTrainingSessionDetailThunk = createAsyncThunk(
  "trainingSessions/fetchDetail",
  async (id: string) => getTrainingSessionDetailReq(id)
)

export const createTrainingSessionThunk = createAsyncThunk(
  "trainingSessions/create",
  async (payload: CreateTrainingSessionPayload, { dispatch, getState }) => {
    const created = await createTrainingSessionReq(payload)
    const state = getState() as RootState
    await dispatch(
      fetchTrainingSessionsThunk({ page: state.trainingSessions.page, limit: state.trainingSessions.limit })
    )
    return created
  }
)

export const updateTrainingSessionThunk = createAsyncThunk(
  "trainingSessions/update",
  async (params: { id: string; payload: UpdateTrainingSessionPayload }, { dispatch, getState }) => {
    const updated = await updateTrainingSessionReq(params.id, params.payload)
    const state = getState() as RootState
    await dispatch(
      fetchTrainingSessionsThunk({ page: state.trainingSessions.page, limit: state.trainingSessions.limit })
    )
    await dispatch(fetchTrainingSessionDetailThunk(params.id))
    return updated
  }
)

export const addTrainingSessionAttendeeThunk = createAsyncThunk(
  "trainingSessions/addAttendee",
  async (
    params: { sessionId: string; userId?: string; email?: string },
    { dispatch, getState }
  ) => {
    const attendee = await addTrainingSessionAttendeeReq(params.sessionId, {
      userId: params.userId,
      email: params.email
    })
    await dispatch(fetchTrainingSessionDetailThunk(params.sessionId))
    const state = getState() as RootState
    await dispatch(
      fetchTrainingSessionsThunk({ page: state.trainingSessions.page, limit: state.trainingSessions.limit })
    )
    return attendee
  }
)

export const removeTrainingSessionAttendeeThunk = createAsyncThunk(
  "trainingSessions/removeAttendee",
  async (params: { sessionId: string; attendeeId: string }, { dispatch, getState }) => {
    await removeTrainingSessionAttendeeReq(params)
    await dispatch(fetchTrainingSessionDetailThunk(params.sessionId))
    const state = getState() as RootState
    await dispatch(
      fetchTrainingSessionsThunk({ page: state.trainingSessions.page, limit: state.trainingSessions.limit })
    )
  }
)

export const searchTrainingSessionUsersThunk = createAsyncThunk(
  "trainingSessions/searchUsers",
  async (query: string) => searchTrainingSessionUsersReq(query)
)

const trainingSessionsSlice = createSlice({
  name: "trainingSessions",
  initialState: trainingSessionsInitialState,
  reducers: {
    setSelectedTrainingSessionId(state, action: PayloadAction<string | null>) {
      state.selectedId = action.payload
    },
    clearTrainingSessionUserSearch(state) {
      state.userSearchItems = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingSessionsThunk.pending, (state) => {
        state.isLoadingList = true
        state.error = null
      })
      .addCase(fetchTrainingSessionsThunk.fulfilled, (state, action) => {
        state.isLoadingList = false
        state.list = action.payload.data
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchTrainingSessionsThunk.rejected, (state, action) => {
        state.isLoadingList = false
        state.error = action.error.message ?? "Error loading sessions"
      })
      .addCase(fetchTrainingSessionDetailThunk.pending, (state) => {
        state.isLoadingDetail = true
      })
      .addCase(fetchTrainingSessionDetailThunk.fulfilled, (state, action) => {
        state.isLoadingDetail = false
        state.detail = action.payload
      })
      .addCase(fetchTrainingSessionDetailThunk.rejected, (state) => {
        state.isLoadingDetail = false
      })
      .addCase(createTrainingSessionThunk.pending, (state) => {
        state.isCreating = true
      })
      .addCase(createTrainingSessionThunk.fulfilled, (state, action) => {
        state.isCreating = false
        state.selectedId = action.payload.id
        state.detail = action.payload
      })
      .addCase(createTrainingSessionThunk.rejected, (state) => {
        state.isCreating = false
      })
      .addCase(updateTrainingSessionThunk.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateTrainingSessionThunk.fulfilled, (state) => {
        state.isUpdating = false
      })
      .addCase(updateTrainingSessionThunk.rejected, (state) => {
        state.isUpdating = false
      })
      .addCase(addTrainingSessionAttendeeThunk.pending, (state) => {
        state.isAddingAttendee = true
      })
      .addCase(addTrainingSessionAttendeeThunk.fulfilled, (state) => {
        state.isAddingAttendee = false
      })
      .addCase(addTrainingSessionAttendeeThunk.rejected, (state) => {
        state.isAddingAttendee = false
      })
      .addCase(removeTrainingSessionAttendeeThunk.pending, (state) => {
        state.isRemovingAttendee = true
      })
      .addCase(removeTrainingSessionAttendeeThunk.fulfilled, (state) => {
        state.isRemovingAttendee = false
      })
      .addCase(removeTrainingSessionAttendeeThunk.rejected, (state) => {
        state.isRemovingAttendee = false
      })
      .addCase(searchTrainingSessionUsersThunk.pending, (state) => {
        state.isSearchingUsers = true
      })
      .addCase(searchTrainingSessionUsersThunk.fulfilled, (state, action) => {
        state.isSearchingUsers = false
        state.userSearchItems = action.payload
      })
      .addCase(searchTrainingSessionUsersThunk.rejected, (state) => {
        state.isSearchingUsers = false
        state.userSearchItems = []
      })
  }
})

export const { setSelectedTrainingSessionId, clearTrainingSessionUserSearch } =
  trainingSessionsSlice.actions

export const selectTrainingSessionsState = (state: RootState): TrainingSessionsSliceState =>
  state.trainingSessions

export default trainingSessionsSlice.reducer
