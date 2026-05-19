import type {
  TrainingSessionDetailType,
  TrainingSessionListItemType,
  TrainingSessionUserSearchItem
} from "../types/training-sessions.types"

export type TrainingSessionsSliceState = {
  list: TrainingSessionListItemType[]
  total: number
  page: number
  limit: number
  selectedId: string | null
  detail: TrainingSessionDetailType | null
  userSearchItems: TrainingSessionUserSearchItem[]
  isLoadingList: boolean
  isLoadingDetail: boolean
  isSearchingUsers: boolean
  isCreating: boolean
  isUpdating: boolean
  isAddingAttendee: boolean
  isRemovingAttendee: boolean
  error: string | null
}

export const trainingSessionsInitialState: TrainingSessionsSliceState = {
  list: [],
  total: 0,
  page: 0,
  limit: 20,
  selectedId: null,
  detail: null,
  userSearchItems: [],
  isLoadingList: false,
  isLoadingDetail: false,
  isSearchingUsers: false,
  isCreating: false,
  isUpdating: false,
  isAddingAttendee: false,
  isRemovingAttendee: false,
  error: null
}
