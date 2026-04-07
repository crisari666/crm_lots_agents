import type { TrainingDetailType, TrainingWithCountsType } from "../types/training-traking.types"

export type TrainingTrakingSliceState = {
  list: TrainingWithCountsType[]
  selectedId: string | null
  detail: TrainingDetailType | null
  isLoadingList: boolean
  isLoadingDetail: boolean
  isCreating: boolean
  isUpdatingTraining: boolean
  isAddingUserToTraining: boolean
  isUpdatingAttendeeStatus: boolean
  isTogglingCheckIn: boolean
  error: string | null
}

export const trainingTrakingInitialState: TrainingTrakingSliceState = {
  list: [],
  selectedId: null,
  detail: null,
  isLoadingList: false,
  isLoadingDetail: false,
  isCreating: false,
  isUpdatingTraining: false,
  isAddingUserToTraining: false,
  isUpdatingAttendeeStatus: false,
  isTogglingCheckIn: false,
  error: null
}

