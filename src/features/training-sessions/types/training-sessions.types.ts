export type TrainingSessionListItemType = {
  id: string
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  googleMeetUrl: string
  responsibleUserId: string | null
  attendeeCount: number
  createdAt: string
  updatedAt: string
}

export type TrainingSessionAttendeeType = {
  id: string
  userId: string
  name: string
  email: string
  createdAt: string
}

export type TrainingSessionDetailType = {
  id: string
  name: string
  date: string
  time: string
  location: string
  mapsUrl: string
  googleMeetUrl: string
  responsibleUserId: string | null
  attendees: TrainingSessionAttendeeType[]
  createdAt: string
  updatedAt: string
}

export type TrainingSessionListResponse = {
  data: TrainingSessionListItemType[]
  total: number
  page: number
  limit: number
}

export type TrainingSessionDetailResponse = {
  data: TrainingSessionDetailType
}

export type CreateTrainingSessionPayload = {
  name: string
  date: string
  time: string
  location: string
  mapsUrl?: string
  responsibleUserId?: string
}

export type UpdateTrainingSessionPayload = Partial<CreateTrainingSessionPayload>

export type TrainingSessionUserSearchItem = {
  id: string
  name: string
  lastName: string
  email: string
  user: string
}

export type TrainingSessionUserSearchResponse = {
  data: TrainingSessionUserSearchItem[]
}
