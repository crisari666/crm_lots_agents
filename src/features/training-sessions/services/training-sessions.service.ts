import Api from "../../../app/axios"
import type {
  CreateTrainingSessionPayload,
  TrainingSessionAttendeeType,
  TrainingSessionDetailResponse,
  TrainingSessionDetailType,
  TrainingSessionListResponse,
  TrainingSessionUserSearchResponse,
  UpdateTrainingSessionPayload
} from "../types/training-sessions.types"

export async function listTrainingSessionsReq(params: {
  page: number
  limit: number
}): Promise<TrainingSessionListResponse> {
  const api = Api.getInstance()
  return api.get({
    path: "/training-sessions",
    data: { page: params.page, limit: params.limit }
  })
}

export async function getTrainingSessionDetailReq(id: string): Promise<TrainingSessionDetailType> {
  const api = Api.getInstance()
  const response: TrainingSessionDetailResponse = await api.get({
    path: `/training-sessions/${id}`
  })
  return response.data
}

export async function createTrainingSessionReq(
  payload: CreateTrainingSessionPayload
): Promise<TrainingSessionDetailType> {
  const api = Api.getInstance()
  const response: TrainingSessionDetailResponse = await api.post({
    path: "/training-sessions",
    data: payload
  })
  return response.data
}

export async function updateTrainingSessionReq(
  id: string,
  payload: UpdateTrainingSessionPayload
): Promise<TrainingSessionDetailType> {
  const api = Api.getInstance()
  const response: TrainingSessionDetailResponse = await api.patch({
    path: `/training-sessions/${id}`,
    data: payload
  })
  return response.data
}

export async function addTrainingSessionAttendeeReq(
  sessionId: string,
  payload: { userId?: string; email?: string }
): Promise<TrainingSessionAttendeeType> {
  const api = Api.getInstance()
  const response: { data: TrainingSessionAttendeeType } = await api.post({
    path: `/training-sessions/${sessionId}/attendees`,
    data: payload
  })
  return response.data
}

export async function removeTrainingSessionAttendeeReq(params: {
  sessionId: string
  attendeeId: string
}): Promise<void> {
  const api = Api.getInstance()
  await api.delete({
    path: `/training-sessions/${params.sessionId}/attendees/${params.attendeeId}`
  })
}

export async function searchTrainingSessionUsersReq(
  query: string,
  limit = 20
): Promise<TrainingSessionUserSearchResponse["data"]> {
  const api = Api.getInstance()
  const response: TrainingSessionUserSearchResponse = await api.get({
    path: "/training-sessions/users/search",
    data: { q: query, limit }
  })
  return response.data
}
