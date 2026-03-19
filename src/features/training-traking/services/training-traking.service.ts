import Api from "../../../app/axios"
import type {
  CreateTrainingPayload,
  TrainingAttendeeType,
  TrainingDetailResponse,
  TrainingDetailType,
  TrainingListResponse,
  TrainingWithCountsType
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

