import Api from "../../../app/axios"
import type {
  OnboardingTriggerResponse,
  OnboardingStateListResponse,
  OnboardingStateType,
  OnboardingStatusType,
  OnboardingUserFlowsListResponse,
  OnboardingFlowSummaryType,
  OnboardingFlowDetailType
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

export async function getUserOnboardingFlowsReq(userId: string): Promise<OnboardingFlowSummaryType[]> {
  try {
    const api = Api.getInstance()
    const response = (await api.get({
      path: `onboarding-state/user/${userId}/flows`
    })) as OnboardingUserFlowsListResponse | undefined

    if (response == null) {
      throw new Error("Failed to load onboarding flows")
    }

    const { error } = response
    if (error != null) {
      throw new Error(typeof error === "string" ? error : "Failed to load onboarding flows")
    }

    return response.result?.flows ?? []
  } catch (error) {
    console.error("ERROR ON getUserOnboardingFlowsReq")
    console.error({ error })
    throw error
  }
}

export async function getOnboardingFlowLogsReq(flowId: string): Promise<OnboardingFlowDetailType> {
  try {
    const api = Api.getInstance()
    const response = (await api.get({
      path: `onboarding-state/pipeline/${flowId}/logs`
    })) as OnboardingFlowDetailType | { message?: string; error?: string } | undefined

    if (response == null) {
      throw new Error("Failed to load flow logs")
    }

    if ("message" in response && response.message === "error" && response.error != null) {
      throw new Error(String(response.error))
    }

    if (!("events" in response) || !Array.isArray(response.events)) {
      throw new Error("Invalid flow logs response")
    }

    return response as OnboardingFlowDetailType
  } catch (error) {
    console.error("ERROR ON getOnboardingFlowLogsReq")
    console.error({ error })
    throw error
  }
}
