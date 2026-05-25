import axios from "axios"
import { fetchCallRecording } from "./voip-call-recording.service"
import type { CallRecordingResult } from "./voip-call-recording.types"

export async function fetchCallLogRecordingWithRetry(
  callSid: string,
  options?: { maxAttempts?: number; intervalMs?: number }
): Promise<CallRecordingResult> {
  const maxAttempts = options?.maxAttempts ?? 30
  const intervalMs = options?.intervalMs ?? 2500
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await fetchCallRecording(callSid)
    } catch (err) {
      const status = axios.isAxiosError(err) ? err.response?.status : undefined
      if (status !== 404 || attempt === maxAttempts - 1) {
        throw err
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }
  throw new Error("La grabación aún no está disponible. Intente de nuevo en unos segundos.")
}
