import Api from "../../../app/axios"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import type {
  OnboardingTriggerResponse,
  OnboardingStateListResponse,
  OnboardingStateType,
  OnboardingStatusType,
  OnboardingUserFlowsListResponse,
  OnboardingFlowSummaryType,
  OnboardingFlowDetailType,
  OnboardingFlowsDeleteResponse,
  OnboardingRecreateSchedulesResponse
} from "../types/onboarding-state.types"

export async function getOnboardingStateListReq({
  status,
  lastUpdateFrom,
  lastUpdateTo
}: {
  status?: OnboardingStatusType
  lastUpdateFrom?: string
  lastUpdateTo?: string
}): Promise<OnboardingStateType[]> {
  try {
    const api = Api.getInstance()
    const query: Record<string, string> = {}
    if (status != null) query.status = status
    if (lastUpdateFrom != null && lastUpdateFrom.trim() !== "") query.lastUpdateFrom = lastUpdateFrom
    if (lastUpdateTo != null && lastUpdateTo.trim() !== "") query.lastUpdateTo = lastUpdateTo
    const response: OnboardingStateListResponse = await api.get({
      path: `onboarding-state/list`,
      data: Object.keys(query).length > 0 ? query : undefined
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

export async function deleteOnboardingFlowsReq(flowIds: string[]): Promise<{ deletedCount: number }> {
  try {
    const api = Api.getInstance()
    const response = (await api.post({
      path: "onboarding-state/flows/delete",
      data: { stateIds: flowIds }
    })) as OnboardingFlowsDeleteResponse | { message: string; error: string }

    if (response != null && "message" in response && response.message === "error") {
      throw new Error("error" in response && response.error != null ? String(response.error) : "Delete failed")
    }

    const ok = response as OnboardingFlowsDeleteResponse
    if (ok?.result == null || typeof ok.result.deletedCount !== "number") {
      throw new Error("Invalid delete response")
    }
    return ok.result
  } catch (error) {
    console.error("ERROR ON deleteOnboardingFlowsReq")
    console.error({ error })
    throw error
  }
}

export async function recreateImportSchedulesReq({
  userIds,
  importFirstStep
}: {
  userIds: string[]
  importFirstStep: UserImportFirstStepType
}): Promise<OnboardingRecreateSchedulesResponse["result"]> {
  try {
    const api = Api.getInstance()
    const response = (await api.post({
      path: "onboarding-state/import/recreate-schedules",
      data: { userIds, importFirstStep }
    })) as OnboardingRecreateSchedulesResponse | { message: string; error: string } | undefined

    if (response == null) {
      throw new Error("Invalid recreate schedules response")
    }

    if ("message" in response && response.message === "error") {
      throw new Error("error" in response && response.error != null ? String(response.error) : "Recreate schedules failed")
    }

    const ok = response as OnboardingRecreateSchedulesResponse
    if (!Array.isArray(ok.result)) {
      throw new Error("Invalid recreate schedules response")
    }
    return ok.result
  } catch (error) {
    console.error("ERROR ON recreateImportSchedulesReq")
    console.error({ error })
    throw error
  }
}
