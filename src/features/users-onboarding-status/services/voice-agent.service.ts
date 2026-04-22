import {VoiceAgentHttp } from "../../../app/voice-agent-http"

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
export async function iniciarLlamadaReq(payload: IniciarLlamadaPayload): Promise<unknown> {
  try {
    const http = VoiceAgentHttp.getInstance()
    return await http.post(PATH_INICIAR_LLAMADA, payload)
  } catch (error) {
    console.error("ERROR ON iniciarLlamadaReq", error)
    throw error
  }
}
