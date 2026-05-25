import axios from "axios"
import type { CallRecordingApiResponse, CallRecordingResult } from "./voip-call-recording.types"

function resolveVoipBaseUrl(): string {
  const raw = import.meta.env.VITE_URL_VOIP_SERVER?.trim() ?? ""
  if (raw === "") {
    throw new Error("Falta VITE_URL_VOIP_SERVER en el entorno.")
  }
  return raw.replace(/\/$/, "")
}

export async function fetchCallRecording(callSid: string): Promise<CallRecordingResult> {
  const base = resolveVoipBaseUrl()
  const url = `${base}/calls/${encodeURIComponent(callSid)}/recording`
  const { data } = await axios.get<CallRecordingApiResponse>(url, {
    headers: { "ngrok-skip-browser-warning": "69420" },
  })
  if (!data?.result?.audioBase64) {
    throw new Error("No se pudo cargar la grabación de la llamada.")
  }
  return data.result
}
