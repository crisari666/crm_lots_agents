import { voipAxios } from "../../../app/voip-http"
import type {
  ActiveLiveCallItem,
  CoachSessionResult,
  VoipListResponse,
  VoipTokenResult,
} from "./voip-live-calls.types"

export async function fetchActiveLiveCalls(): Promise<ActiveLiveCallItem[]> {
  const { data } = await voipAxios.get<VoipListResponse<ActiveLiveCallItem[]>>("/calls/active")
  return data.result ?? []
}

export async function fetchCoachSession(callSid: string): Promise<CoachSessionResult> {
  const { data } = await voipAxios.get<VoipListResponse<CoachSessionResult>>(
    `/calls/${encodeURIComponent(callSid)}/coach-session`
  )
  if (!data?.result) {
    throw new Error("No se pudo obtener la sesión de coaching.")
  }
  return data.result
}

export async function fetchCoachVoipToken(supervisorUserId: string): Promise<string> {
  const identity = `coach-${supervisorUserId}`
  const { data } = await voipAxios.get<VoipListResponse<VoipTokenResult>>(
    `/token/create-token/identity/${encodeURIComponent(identity)}`
  )
  if (!data?.result?.tokenJWT) {
    throw new Error("Token VoIP inválido para coaching.")
  }
  return data.result.tokenJWT
}
