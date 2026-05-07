import type { CustomerEventType } from "../../services/customers-ms.service"

export type CustomerEventTypeOption = {
  id: CustomerEventType
  label: string
}

/** Single source of truth for Spanish customer event type names. */
export const CUSTOMER_EVENT_TYPE_OPTIONS: CustomerEventTypeOption[] = [
  { id: "WHATSAPP_CALL", label: "Llamada por WhatsApp" },
  { id: "WHATSAPP_MESSAGE", label: "Mensaje por WhatsApp" },
  { id: "PHONE_CALL", label: "Llamada telefonica" },
  { id: "VIDEO_CALL", label: "Videollamada" },
  { id: "CALL_CRM", label: "Llamada desde CRM" },
  { id: "CUSTOM_SENT_LAND", label: "Envio al lote programado" },
  { id: "CUSTOMER_CANCELLED_VISIT_LAND", label: "Visita al lote cancelada" },
  { id: "CUSTOMER_VISIT_LAND", label: "Visita al lote completada" },
]

const labelByType: Record<CustomerEventType, string> = CUSTOMER_EVENT_TYPE_OPTIONS.reduce(
  (acc, option) => {
    acc[option.id] = option.label
    return acc
  },
  {} as Record<CustomerEventType, string>
)

/** Returns the Spanish label for a given event type, or the raw type when unknown. */
export function getCustomerEventTypeLabel(eventType: CustomerEventType | string): string {
  return labelByType[eventType as CustomerEventType] ?? eventType
}
