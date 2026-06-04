import type {
  WhatsappMarketingAudienceMode,
  WhatsappMarketingCampaignType,
  WhatsappMarketingTemplateHeaderMediaType,
} from "../services/customers-ms-whatsapp-marketing.types"

const NAME_MAX_LENGTH = 120
const TEMPLATE_HEADER_MEDIA_ID_MAX_LENGTH = 256
const TEMPLATE_LANGUAGE_MAX_LENGTH = 16
const BATCH_SIZE_MIN = 1
const BATCH_SIZE_MAX = 50
/** Minimum pause between dispatch batches (5 seconds). */
export const BATCH_DELAY_MS_MIN = 5 * 1000
/** Maximum pause between dispatch batches (20 minutes). */
export const BATCH_DELAY_MS_MAX = 20 * 60 * 1000

export type WhatsappMarketingCampaignFormValues = {
  readonly name: string
  readonly templateName: string
  readonly templateLanguage: string
  readonly templateParamsText: string
  readonly templateHeaderMediaId?: string
  readonly templateHeaderMediaType?: WhatsappMarketingTemplateHeaderMediaType
  readonly batchSize: number
  readonly batchDelayMs: number
  readonly campaignType: WhatsappMarketingCampaignType
  readonly audienceMode: WhatsappMarketingAudienceMode
  readonly manualCustomerCount: number
  readonly previewTotal: number | null
  readonly previewLoading: boolean
  /** True when Redux preview is from a previous audience payload (debounce / in flight). */
  readonly previewIsStale?: boolean
}

export type WhatsappMarketingCampaignFieldErrors = Partial<{
  name: string
  templateName: string
  templateLanguage: string
  templateParamsText: string
  templateHeaderMediaId: string
  batchSize: string
  batchDelayMs: string
  audience: string
  preview: string
}>

export type WhatsappMarketingCampaignValidationResult = {
  readonly errors: WhatsappMarketingCampaignFieldErrors
  readonly templateComponents?: Record<string, unknown>[]
}

function isIntegerInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max
}

function parseTemplateComponentsJson(
  templateParamsText: string
): { readonly ok: true; readonly value: Record<string, unknown>[] } | { readonly ok: false } {
  const trimmed = templateParamsText.trim()
  if (trimmed === "") {
    return { ok: true, value: [] }
  }
  try {
    const parsed = JSON.parse(trimmed) as unknown
    if (!Array.isArray(parsed)) {
      return { ok: false }
    }
    return { ok: true, value: parsed as Record<string, unknown>[] }
  } catch {
    return { ok: false }
  }
}

export function validateWhatsappMarketingCampaignForm(
  values: WhatsappMarketingCampaignFormValues
): WhatsappMarketingCampaignValidationResult {
  const errors: WhatsappMarketingCampaignFieldErrors = {}
  const trimmedName = values.name.trim()
  if (trimmedName === "") {
    errors.name = "El nombre de la campaña es obligatorio"
  } else if (trimmedName.length > NAME_MAX_LENGTH) {
    errors.name = `Máximo ${NAME_MAX_LENGTH} caracteres`
  }
  const trimmedTemplateName = values.templateName.trim()
  if (trimmedTemplateName === "") {
    errors.templateName = "El nombre de la plantilla es obligatorio"
  } else if (trimmedTemplateName.length > NAME_MAX_LENGTH) {
    errors.templateName = `Máximo ${NAME_MAX_LENGTH} caracteres`
  }
  const trimmedLanguage = values.templateLanguage.trim()
  if (trimmedLanguage.length > TEMPLATE_LANGUAGE_MAX_LENGTH) {
    errors.templateLanguage = `Máximo ${TEMPLATE_LANGUAGE_MAX_LENGTH} caracteres`
  }
  const componentsParse = parseTemplateComponentsJson(values.templateParamsText)
  if (!componentsParse.ok) {
    errors.templateParamsText =
      "Debe ser un JSON válido: un arreglo de componentes de plantilla"
  }
  const trimmedHeaderMediaId = (values.templateHeaderMediaId ?? "").trim()
  if (trimmedHeaderMediaId.length > TEMPLATE_HEADER_MEDIA_ID_MAX_LENGTH) {
    errors.templateHeaderMediaId = `Máximo ${TEMPLATE_HEADER_MEDIA_ID_MAX_LENGTH} caracteres`
  }
  if (!isIntegerInRange(values.batchSize, BATCH_SIZE_MIN, BATCH_SIZE_MAX)) {
    errors.batchSize = `Entre ${BATCH_SIZE_MIN} y ${BATCH_SIZE_MAX}`
  }
  if (!isIntegerInRange(values.batchDelayMs, BATCH_DELAY_MS_MIN, BATCH_DELAY_MS_MAX)) {
    errors.batchDelayMs = `Entre ${BATCH_DELAY_MS_MIN / 1000} s y ${BATCH_DELAY_MS_MAX / 60_000} min (${BATCH_DELAY_MS_MIN}–${BATCH_DELAY_MS_MAX} ms)`
  }
  if (values.audienceMode === "manual" && values.manualCustomerCount === 0) {
    errors.audience = "Agrega al menos un cliente en la búsqueda manual"
  }
  const previewPending = values.previewLoading === true || values.previewIsStale === true
  if (previewPending) {
    errors.preview = "Espera a que termine la vista previa de audiencia"
  } else if (values.previewTotal === null) {
    errors.preview = "No se pudo calcular la audiencia; revisa los filtros"
  } else if (values.previewTotal === 0) {
    if (values.audienceMode === "manual" && values.manualCustomerCount > 0) {
      errors.preview = "Ningún destinatario manual tiene teléfono válido"
    } else {
      errors.preview = "La audiencia no tiene destinatarios con teléfono válido"
    }
  }
  const templateComponents =
    componentsParse.ok && componentsParse.value.length > 0
      ? componentsParse.value
      : undefined
  return { errors, templateComponents }
}

export function hasWhatsappMarketingCampaignErrors(
  errors: WhatsappMarketingCampaignFieldErrors
): boolean {
  return Object.keys(errors).length > 0
}
