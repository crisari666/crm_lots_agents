import Api from "../../../app/axios"
import type {
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
