import { Device, type Call } from "@twilio/voice-sdk"

export type CoachConnectionPhase = "idle" | "connecting" | "open" | "closed" | "error"

let coachDevice: Device | null = null
let coachCall: Call | null = null
let phaseListener: ((phase: CoachConnectionPhase) => void) | null = null
let errorListener: ((message: string) => void) | null = null

export function setCoachRuntimeListeners(listeners: {
  onPhase?: (phase: CoachConnectionPhase) => void
  onError?: (message: string) => void
}): void {
  phaseListener = listeners.onPhase ?? null
  errorListener = listeners.onError ?? null
}

export async function registerCoachDevice(tokenJwt: string): Promise<void> {
  await destroyCoachDevice()
  const device = new Device(tokenJwt, { logLevel: "error" })
  device.on("error", (err) => {
    errorListener?.(err.message ?? "Error de Twilio Device")
  })
  await device.register()
  coachDevice = device
}

export async function destroyCoachDevice(): Promise<void> {
  disconnectCoachCall()
  if (coachDevice) {
    coachDevice.destroy()
    coachDevice = null
  }
}

export function disconnectCoachCall(): void {
  if (coachCall) {
    try {
      coachCall.disconnect()
    } catch {
      /* ignore */
    }
    coachCall = null
  }
}

export function setCoachMuted(muted: boolean): void {
  coachCall?.mute(muted)
}

export async function connectCoachCall(params: {
  conferenceName: string
  agentCallSid: string
  supervisorId: string
  mode?: "coach" | "monitor"
}): Promise<void> {
  if (!coachDevice) {
    throw new Error("Dispositivo de coaching no registrado.")
  }
  phaseListener?.("connecting")
  const call = await coachDevice.connect({
    params: {
      __TWI_MODE: params.mode ?? "coach",
      __TWI_CONFERENCE: params.conferenceName,
      __TWI_AGENT_CALL_SID: params.agentCallSid,
      __TWI_SUPERVISOR_ID: params.supervisorId,
    },
  })
  coachCall = call
  call.on("accept", () => phaseListener?.("open"))
  call.on("disconnect", () => {
    phaseListener?.("closed")
    coachCall = null
  })
  call.on("cancel", () => {
    phaseListener?.("closed")
    coachCall = null
  })
  call.on("reject", () => {
    phaseListener?.("closed")
    coachCall = null
  })
  call.on("error", (err) => {
    errorListener?.(err.message ?? "Error en la llamada de coaching")
    phaseListener?.("error")
    coachCall = null
  })
}
