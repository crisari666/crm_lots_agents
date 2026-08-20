export const customerCaptureStrings = {
  tabLabel: "Captura",
  stageLabel: "Etapa 3 - Prospecto calificado",
  progress: "{{completed}} de {{total}} datos completos",
  saving: "Guardando…",
  loading: "Cargando captura…",
  loadFailed: "No se pudo cargar la captura de datos.",
  saveFailed: "No se pudo guardar la captura.",
  warning:
    "ADVERTENCIA: Si falta ALGUNO de estos datos, el prospecto NO puede avanzar.",
  selectPlaceholder: "Seleccionar…",
  cityPlaceholder: "Ciudad del prospecto",
  fieldEconomicCapacity: "Capacidad económica",
  fieldCity: "Ciudad",
  fieldTimeToBuy: "Tiempo para comprar",
  fieldPaymentMethod: "Forma de pago",
  fieldBuyMotive: "Motivo de compra",
  fieldProjectId: "Proyecto de interés",
  fieldUrgencyLevel: "Nivel de urgencia",
  fieldDecisionMaker: "Tomador de decisión",
  optionTimeToBuy_immediate: "Inmediato",
  optionTimeToBuy_1_3_months: "1 a 3 meses",
  optionTimeToBuy_3_6_months: "3 a 6 meses",
  optionTimeToBuy_6_12_months: "6 a 12 meses",
  optionTimeToBuy_over_1_year: "Más de 1 año",
  optionPaymentMethod_cash: "Contado",
  optionPaymentMethod_financing: "Financiación",
  optionPaymentMethod_cash_and_financing: "Contado y financiación",
  optionPaymentMethod_subsidy: "Subsidio",
  optionBuyMotive_live: "Vivir",
  optionBuyMotive_invest: "Invertir",
  optionBuyMotive_both: "Ambos",
  optionUrgencyLevel_low: "Baja",
  optionUrgencyLevel_medium: "Media",
  optionUrgencyLevel_high: "Alta",
  optionDecisionMaker_self: "Él / ella",
  optionDecisionMaker_spouse: "Cónyuge",
  optionDecisionMaker_family: "Familia",
  optionDecisionMaker_other: "Otro",
} as const

export function customerCaptureProgress(
  completed: number,
  total: number
): string {
  return customerCaptureStrings.progress
    .replace("{{completed}}", String(completed))
    .replace("{{total}}", String(total))
}

export function customerCaptureFieldLabel(key: string): string {
  const map: Record<string, string> = {
    economicCapacity: customerCaptureStrings.fieldEconomicCapacity,
    city: customerCaptureStrings.fieldCity,
    timeToBuy: customerCaptureStrings.fieldTimeToBuy,
    paymentMethod: customerCaptureStrings.fieldPaymentMethod,
    buyMotive: customerCaptureStrings.fieldBuyMotive,
    projectId: customerCaptureStrings.fieldProjectId,
    urgencyLevel: customerCaptureStrings.fieldUrgencyLevel,
    decisionMaker: customerCaptureStrings.fieldDecisionMaker,
  }
  return map[key] ?? key
}

export function customerCaptureOptionLabel(
  fieldKey: string,
  code: string
): string {
  if (fieldKey === "economicCapacity") {
    const match = /^(\d+)_(\d+)m$/.exec(code)
    if (match) {
      return `$${match[1]}M - $${match[2]}M`
    }
  }
  const key =
    `option${fieldKey.charAt(0).toUpperCase()}${fieldKey.slice(1)}_${code}` as keyof typeof customerCaptureStrings
  const value = customerCaptureStrings[key]
  return typeof value === "string" ? value : code
}
