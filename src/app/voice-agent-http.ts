import axios, { type AxiosResponse } from "axios"

const baseURL = (import.meta.env.VITE_URL_VOICE_AGENT as string)?.trim?.() ?? ""

const voiceAgentAxios = axios.create({
  baseURL,
  headers: {
    "Content-type": "application/json"
  }
})

export class VoiceAgentHttp {
  private static instance: VoiceAgentHttp

  public static getInstance(): VoiceAgentHttp {
    if (!VoiceAgentHttp.instance) {
      VoiceAgentHttp.instance = new VoiceAgentHttp()
    }
    return VoiceAgentHttp.instance
  }

  async post<T>(path: string, data: unknown): Promise<T> {
    const response: AxiosResponse<T> = await voiceAgentAxios.post(path, data)
    return response.data
  }
}

export function getVoiceAgentWebsocketUrl(): string {
  const raw = (import.meta.env.VITE_URL_VOICE_AGENT_WEBSOCKET as string)?.trim?.() ?? ""
  const withoutTrailing = raw.replace(/\/$/, "")
  const ws = withoutTrailing.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://")
  return `${ws}/twilio`
}
