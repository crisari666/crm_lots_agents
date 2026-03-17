import { getVoiceAgentWebsocketUrl, VoiceAgentHttp } from "../../../app/voice-agent-http"

const PATH_INICIAR_LLAMADA = "iniciar-llamada"

export type IniciarLlamadaPayload = {
  websocketUrl: string
  fromNumber: string
  toNumber: string
  customer_name: string
  customer_id: string
  agentId: string
  is_dev: boolean
}

export function buildIniciarLlamadaPayload(params: {
  fromNumber: string
  toNumber: string
  customer_name: string
  customer_id: string
  agentId: string
  is_dev?: boolean
}): IniciarLlamadaPayload {
  return {
    websocketUrl: getVoiceAgentWebsocketUrl(),
    fromNumber: params.fromNumber,
    toNumber: params.toNumber,
    customer_name: params.customer_name,
    customer_id: params.customer_id,
    agentId: params.agentId,
    is_dev: params.is_dev ?? import.meta.env.DEV
  }
}

export async function iniciarLlamadaReq(payload: IniciarLlamadaPayload): Promise<unknown> {
  try {
    const http = VoiceAgentHttp.getInstance()
    return await http.post(PATH_INICIAR_LLAMADA, payload)
  } catch (error) {
    console.error("ERROR ON iniciarLlamadaReq", error)
    throw error
  }
}
