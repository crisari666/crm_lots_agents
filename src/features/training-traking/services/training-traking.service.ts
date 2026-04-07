import Api from "../../../app/axios"
import type {
  AddUserByEmailPayload,
  ConfirmStatusResponse,
  CreateTrainingPayload,
  TrainingAttendeeType,
  TrainingDetailResponse,
  TrainingDetailType,
  TrainingListResponse,
  TrainingWithCountsType,
  UpdateTrainingPayload
} from "../types/training-traking.types"

export async function getTrainingsReq(): Promise<TrainingWithCountsType[]> {
  try {
    const api = Api.getInstance()
    const response: TrainingListResponse = await api.get({
      path: "/trainings"
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON getTrainingsReq", error)
    throw error
  }
}

export async function getTrainingDetailReq(id: string): Promise<TrainingDetailType> {
  try {
    const api = Api.getInstance()
    const response: TrainingDetailResponse = await api.get({
      path: `/trainings/${id}`
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON getTrainingDetailReq", error)
    throw error
  }
}

export async function createTrainingReq(payload: CreateTrainingPayload): Promise<TrainingDetailType> {
  try {
    const api = Api.getInstance()
    const response: TrainingDetailResponse = await api.post({
      path: "/trainings",
      data: payload
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON createTrainingReq", error)
    throw error
  }
}

export async function updateTrainingReq(
  id: string,
  payload: UpdateTrainingPayload
): Promise<TrainingDetailType> {
  try {
    const api = Api.getInstance()
    const response: TrainingDetailResponse = await api.patch({
      path: `/trainings/${id}`,
      data: payload
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON updateTrainingReq", error)
    throw error
  }
}

export async function addUserByEmailReq(
  trainingId: string,
  payload: AddUserByEmailPayload
): Promise<TrainingAttendeeType> {
  try {
    const api = Api.getInstance()
    const response: { data: TrainingAttendeeType } = await api.post({
      path: `/trainings/${trainingId}/attendees/user`,
      data: payload
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON addUserByEmailReq", error)
    throw error
  }
}

export async function toggleCheckInReq(params: {
  trainingId: string
  attendeeId: string
}): Promise<TrainingAttendeeType> {
  try {
    const api = Api.getInstance()
    const response: { data: TrainingAttendeeType } = await api.patch({
      path: `/trainings/${params.trainingId}/attendees/${params.attendeeId}/check-in`
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON toggleCheckInReq", error)
    throw error
  }
}

export async function acceptAttendeeReq(attendeeId: string): Promise<ConfirmStatusResponse["data"]> {
  try {
    const api = Api.getInstance()
    const response: ConfirmStatusResponse = await api.post({
      path: `/trainings/attendees/${attendeeId}/accept`,
      data: {}
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON acceptAttendeeReq", error)
    throw error
  }
}

export async function declineAttendeeReq(
  attendeeId: string,
  reason: string
): Promise<ConfirmStatusResponse["data"]> {
  try {
    const api = Api.getInstance()
    const response: ConfirmStatusResponse = await api.post({
      path: `/trainings/attendees/${attendeeId}/decline`,
      data: { reason }
    })
    return response.data
  } catch (error) {
    console.error("ERROR ON declineAttendeeReq", error)
    throw error
  }
}

