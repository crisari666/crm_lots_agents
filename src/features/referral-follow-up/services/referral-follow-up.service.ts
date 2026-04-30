import Api from "../../../app/axios"
import type {
  CreateReferralSituationPayload,
  ReferralEligibleUser,
  ReferralSituationRow,
} from "../types/referral-follow-up.types"

function unwrapResult<T>(response: any): T {
  if (response == null) {
    throw new Error("Empty response")
  }
  const { error, result, message } = response
  if (error != null && error !== "") {
    throw new Error(typeof error === "string" ? error : JSON.stringify(error))
  }
  if (message === "success" || result !== undefined) {
    return result as T
  }
  throw new Error("Unexpected response")
}

export async function getEligibleReferralUsersReq(): Promise<
  ReferralEligibleUser[]
> {
  const api = Api.getInstance()
  const response = await api.get({
    path: "users/referral-situations/eligible-users",
  })
  return unwrapResult<ReferralEligibleUser[]>(response)
}

export async function listReferralSituationsReq(params: {
  readonly dateFrom: Date
  readonly dateTo: Date
}): Promise<ReferralSituationRow[]> {
  const api = Api.getInstance()
  const response = await api.get({
    path: "users/referral-situations",
    data: {
      dateFrom: params.dateFrom.toISOString(),
      dateTo: params.dateTo.toISOString(),
    },
  })
  return unwrapResult<ReferralSituationRow[]>(response)
}

export async function createReferralSituationReq(
  payload: CreateReferralSituationPayload,
): Promise<{ readonly id: string }> {
  const api = Api.getInstance()
  const response = await api.post({
    path: "users/referral-situations",
    data: {
      userId: payload.userId,
      event: payload.event,
      description: payload.description,
    },
  })
  return unwrapResult<{ readonly id: string }>(response)
}
