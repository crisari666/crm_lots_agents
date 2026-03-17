import type { TrainingDetailType, TrainingWithCountsType } from "../types/training-traking.types"

export type TrainingTrakingSliceState = {
  list: TrainingWithCountsType[]
  selectedId: string | null
  detail: TrainingDetailType | null
  isLoadingList: boolean
  isLoadingDetail: boolean
  isCreating: boolean
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
  isTogglingCheckIn: false,
  error: null
}

