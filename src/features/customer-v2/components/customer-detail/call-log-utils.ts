import type { CustomerCallLogAdminOutcome } from "../../services/customers-ms.service"

export function formatCallDurationSeconds(sec?: number): string {
  if (sec === undefined || sec === null || Number.isNaN(sec)) {
    return "—"
  }
  const s = Math.max(0, Math.floor(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, "0")}`
}

export function outcomeLabelEs(outcome: CustomerCallLogAdminOutcome): string {
  switch (outcome) {
    case "answered":
      return "Contestada"
    case "busy":
      return "Ocupado"
    case "no_answer":
      return "Sin contestar"
    case "failed":
      return "Fallida"
    case "canceled":
      return "Cancelada"
    case "ringing":
      return "Sonando"
    case "in_progress":
      return "En curso"
    default:
      return "Desconocido"
  }
}

export function directionLabelEs(direction?: string): string {
  if (!direction) {
    return ""
  }
  if (direction.includes("inbound")) {
    return "Entrante"
  }
  if (direction.includes("outbound")) {
    return "Saliente"
  }
  return direction
}
