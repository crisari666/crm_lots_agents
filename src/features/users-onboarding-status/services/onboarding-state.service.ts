import Api from "../../../app/axios"
import type {
  OnboardingTriggerResponse,
  OnboardingStateListResponse,
  OnboardingStateType,
  OnboardingStatusType
} from "../types/onboarding-state.types"

export async function getOnboardingStateListReq({
  status
}: {
  status?: OnboardingStatusType
}): Promise<OnboardingStateType[]> {
  try {
    const api = Api.getInstance()
    const response: OnboardingStateListResponse = await api.get({
      path: `onboarding-state/list`,
      data: status ? { status } : undefined
    })

    const { error } = response
    if (error == null) {
      return response.result
    }

    throw error
  } catch (error) {
    console.error("ERROR ON getOnboardingStateListReq")
    console.error({ error })
    throw error
  }
}

export async function triggerOnboardingFlowReq({
  userId,
  phoneNumber,
  name
}: {
  userId: string
  phoneNumber: string
  name: string
}): Promise<OnboardingTriggerResponse> {
  try {
    const api = Api.getInstance()
    const response: OnboardingTriggerResponse = await api.post({
      path: "onboarding-state/trigger",
      data: { userId, phoneNumber, name }
    })
    return response
  } catch (error) {
    console.error("ERROR ON triggerOnboardingFlowReq")
    console.error({ error })
    throw error
  }
}
