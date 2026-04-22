export type TrainingAttendeeStatusType = "pending" | "confirmed" | "declined"
export type TrainingListFilterType = "all" | "todayAndFuture"

export type TrainingType = {
  id: string
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  googleMeetUrl: string
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
  userId?: string | null
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
  googleMeetUrl?: string
  maxSlots: number
}

export type UpdateTrainingPayload = Partial<CreateTrainingPayload>

export type AddUserByEmailPayload = {
  email: string
}

export type ConfirmStatusResponse = {
  data: {
    status: TrainingAttendeeStatusType
    message: string
    reason?: string
  }
}

export type RemoveAttendeeResponse = {
  data: {
    removed: boolean
  }
}

export type SendTrainingReminderPayload = {
  trackingId: string
  userId: string
  template_name: string
}

