import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../../app/store"
import type {
  CreateTrainingPayload,
  TrainingAttendeeType,
  TrainingDetailType,
  TrainingWithCountsType,
  UpdateTrainingPayload
} from "../types/training-traking.types"
import {
  acceptAttendeeReq,
  addUserByEmailReq,
  createTrainingReq,
  declineAttendeeReq,
  getTrainingDetailReq,
  getTrainingsReq,
  removeAttendeeReq,
  toggleCheckInReq,
  updateTrainingReq
} from "../services/training-traking.service"
import {
  trainingTrakingInitialState,
  type TrainingTrakingSliceState
} from "./training-traking.state"

export const fetchTrainingsThunk = createAsyncThunk(
  "trainingTraking/fetchTrainings",
  async () => {
    return getTrainingsReq()
  }
)

export const fetchTrainingDetailThunk = createAsyncThunk(
  "trainingTraking/fetchTrainingDetail",
  async (id: string) => {
    return getTrainingDetailReq(id)
  }
)

export const createTrainingThunk = createAsyncThunk(
  "trainingTraking/createTraining",
  async (payload: CreateTrainingPayload) => {
    return createTrainingReq(payload)
  }
)

export const toggleCheckInThunk = createAsyncThunk(
  "trainingTraking/toggleCheckIn",
  async (params: { trainingId: string; attendeeId: string }) => {
    return toggleCheckInReq(params)
  }
)

export const updateTrainingThunk = createAsyncThunk(
  "trainingTraking/updateTraining",
  async (params: { id: string; payload: UpdateTrainingPayload }, { dispatch }) => {
    const updated = await updateTrainingReq(params.id, params.payload)
    await dispatch(fetchTrainingsThunk())
    return updated
  }
)

export const addUserToTrainingByEmailThunk = createAsyncThunk(
  "trainingTraking/addUserToTrainingByEmail",
  async (params: { trainingId: string; email: string }, { dispatch }) => {
    const attendee = await addUserByEmailReq(params.trainingId, { email: params.email })
    await dispatch(fetchTrainingDetailThunk(params.trainingId))
    await dispatch(fetchTrainingsThunk())
    return attendee
  }
)

export const acceptAttendeeThunk = createAsyncThunk(
  "trainingTraking/acceptAttendee",
  async (params: { trainingId: string; attendeeId: string }, { dispatch }) => {
    const response = await acceptAttendeeReq(params.attendeeId)
    await dispatch(fetchTrainingDetailThunk(params.trainingId))
    await dispatch(fetchTrainingsThunk())
    return response
  }
)

export const declineAttendeeThunk = createAsyncThunk(
  "trainingTraking/declineAttendee",
  async (params: { trainingId: string; attendeeId: string; reason: string }, { dispatch }) => {
    const response = await declineAttendeeReq(params.attendeeId, params.reason)
    await dispatch(fetchTrainingDetailThunk(params.trainingId))
    await dispatch(fetchTrainingsThunk())
    return response
  }
)

export const removeAttendeeThunk = createAsyncThunk(
  "trainingTraking/removeAttendee",
  async (params: { trainingId: string; attendeeId: string }, { dispatch }) => {
    const response = await removeAttendeeReq(params)
    await dispatch(fetchTrainingDetailThunk(params.trainingId))
    await dispatch(fetchTrainingsThunk())
    return response
  }
)

const trainingTrakingSlice = createSlice({
  name: "trainingTraking",
  initialState: trainingTrakingInitialState,
  reducers: {
    setSelectedTrainingId(
      state: TrainingTrakingSliceState,
      action: PayloadAction<string | null>
    ) {
      state.selectedId = action.payload
    },
    clearTrainingTrakingError(state: TrainingTrakingSliceState) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainingsThunk.pending, (state) => {
        state.isLoadingList = true
        state.error = null
      })
      .addCase(
        fetchTrainingsThunk.fulfilled,
        (state, action: PayloadAction<TrainingWithCountsType[]>) => {
          state.isLoadingList = false
          state.list = action.payload
        }
      )
      .addCase(fetchTrainingsThunk.rejected, (state, action) => {
        state.isLoadingList = false
        state.error = action.error.message ?? "Error fetching trainings"
      })

      .addCase(fetchTrainingDetailThunk.pending, (state) => {
        state.isLoadingDetail = true
        state.error = null
      })
      .addCase(
        fetchTrainingDetailThunk.fulfilled,
        (state, action: PayloadAction<TrainingDetailType>) => {
          state.isLoadingDetail = false
          state.detail = action.payload
        }
      )
      .addCase(fetchTrainingDetailThunk.rejected, (state, action) => {
        state.isLoadingDetail = false
        state.error = action.error.message ?? "Error fetching training detail"
      })

      .addCase(createTrainingThunk.pending, (state) => {
        state.isCreating = true
        state.error = null
      })
      .addCase(
        createTrainingThunk.fulfilled,
        (state, action: PayloadAction<TrainingDetailType>) => {
          state.isCreating = false
          state.detail = action.payload
          state.selectedId = action.payload.id
          const attendees = action.payload.attendees ?? []
          const total = attendees.length
          const confirmed = attendees.filter((a) => a.status === "confirmed").length
          const pending = attendees.filter((a) => a.status === "pending").length
          const declined = attendees.filter((a) => a.status === "declined").length
          const newItem: TrainingWithCountsType = {
            id: action.payload.id,
            name: action.payload.name,
            date: action.payload.date,
            time: action.payload.time,
            location: action.payload.location,
            mapsUrl: action.payload.mapsUrl,
            maxSlots: action.payload.maxSlots,
            createdAt: action.payload.createdAt,
            updatedAt: action.payload.updatedAt,
            attendeeCounts: {
              total,
              confirmed,
              pending,
              declined
            }
          }
          state.list = [...state.list, newItem]
        }
      )
      .addCase(createTrainingThunk.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.error.message ?? "Error creating training"
      })

      .addCase(updateTrainingThunk.pending, (state) => {
        state.isUpdatingTraining = true
        state.error = null
      })
      .addCase(updateTrainingThunk.fulfilled, (state, action: PayloadAction<TrainingDetailType>) => {
        state.isUpdatingTraining = false
        state.detail = action.payload
      })
      .addCase(updateTrainingThunk.rejected, (state, action) => {
        state.isUpdatingTraining = false
        state.error = action.error.message ?? "Error updating training"
      })

      .addCase(addUserToTrainingByEmailThunk.pending, (state) => {
        state.isAddingUserToTraining = true
        state.error = null
      })
      .addCase(addUserToTrainingByEmailThunk.fulfilled, (state) => {
        state.isAddingUserToTraining = false
      })
      .addCase(addUserToTrainingByEmailThunk.rejected, (state, action) => {
        state.isAddingUserToTraining = false
        state.error = action.error.message ?? "Error adding user to training"
      })

      .addCase(acceptAttendeeThunk.pending, (state) => {
        state.isUpdatingAttendeeStatus = true
        state.error = null
      })
      .addCase(acceptAttendeeThunk.fulfilled, (state) => {
        state.isUpdatingAttendeeStatus = false
      })
      .addCase(acceptAttendeeThunk.rejected, (state, action) => {
        state.isUpdatingAttendeeStatus = false
        state.error = action.error.message ?? "Error confirming attendee"
      })

      .addCase(declineAttendeeThunk.pending, (state) => {
        state.isUpdatingAttendeeStatus = true
        state.error = null
      })
      .addCase(declineAttendeeThunk.fulfilled, (state) => {
        state.isUpdatingAttendeeStatus = false
      })
      .addCase(declineAttendeeThunk.rejected, (state, action) => {
        state.isUpdatingAttendeeStatus = false
        state.error = action.error.message ?? "Error declining attendee"
      })

      .addCase(removeAttendeeThunk.pending, (state) => {
        state.isUpdatingAttendeeStatus = true
        state.error = null
      })
      .addCase(removeAttendeeThunk.fulfilled, (state) => {
        state.isUpdatingAttendeeStatus = false
      })
      .addCase(removeAttendeeThunk.rejected, (state, action) => {
        state.isUpdatingAttendeeStatus = false
        state.error = action.error.message ?? "Error removing attendee"
      })

      .addCase(toggleCheckInThunk.pending, (state) => {
        state.isTogglingCheckIn = true
        state.error = null
      })
      .addCase(
        toggleCheckInThunk.fulfilled,
        (state, action: PayloadAction<TrainingAttendeeType>) => {
          state.isTogglingCheckIn = false
          if (state.detail == null) return
          state.detail = {
            ...state.detail,
            attendees: state.detail.attendees.map((a) =>
              a.id === action.payload.id ? { ...a, checkedIn: action.payload.checkedIn } : a
            )
          }
        }
      )
      .addCase(toggleCheckInThunk.rejected, (state, action) => {
        state.isTogglingCheckIn = false
        state.error = action.error.message ?? "Error updating check-in"
      })
  }
})

export const { setSelectedTrainingId, clearTrainingTrakingError } =
  trainingTrakingSlice.actions

export const selectTrainingTrakingState = (state: RootState): TrainingTrakingSliceState =>
  state.trainingTraking

export const selectTrainingTrakingList = (state: RootState) =>
  selectTrainingTrakingState(state).list

export const selectTrainingTrakingDetail = (state: RootState) =>
  selectTrainingTrakingState(state).detail

export default trainingTrakingSlice.reducer

