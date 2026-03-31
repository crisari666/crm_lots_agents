export type TrainingAttendeeStatusType = "pending" | "confirmed" | "declined"

export type TrainingType = {
  id: string
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  maxSlots: number
  createdAt: string
  updatedAt: string
}

export type TrainingWithCountsType = TrainingType & {
  attendeeCounts: {
    total: number
    confirmed: number
    pending: number
    declined: number
  }
}

export type TrainingAttendeeType = {
  id: string
  trainingId: string
  uniqueCode: string
  name: string
  phoneNumber?: string | null
  email: string
  status: TrainingAttendeeStatusType
  declineReason?: string | null
  checkedIn: boolean
  createdAt: string
  updatedAt: string
}

export type TrainingDetailType = TrainingType & {
  attendees: TrainingAttendeeType[]
}

export type TrainingListResponse = {
  data: TrainingWithCountsType[]
}

export type TrainingDetailResponse = {
  data: TrainingDetailType
}

export type CreateTrainingPayload = {
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  maxSlots: number
}

