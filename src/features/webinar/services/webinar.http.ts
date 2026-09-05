import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  CreateWebinarEventBody,
  CreateWebinarLeadBody,
  ImportWebinarLeadsBody,
  ImportWebinarLeadsResponse,
  ListWebinarLeadsParams,
  UpdateWebinarEventBody,
  WebinarEvent,
  WebinarEventStatus,
  WebinarLead,
  WebinarLeadStatus,
  WebinarLeadsListResponse,
} from "../types/webinar.types"

const auth = () => ({ headers: customersMsAuthHeaders() })

type RawDoc = Record<string, unknown> & {
  readonly _id?: unknown
  readonly id?: unknown
}

function resolveId(raw: RawDoc): string {
  if (typeof raw.id === "string" && raw.id.length > 0) {
    return raw.id
  }
  if (raw._id != null) {
    return String(raw._id)
  }
  return ""
}

function resolveOptionalId(value: unknown): string | null {
  if (value == null) {
    return null
  }
  if (typeof value === "string") {
    return value.length > 0 ? value : null
  }
  if (typeof value === "object" && value !== null && "_id" in value) {
    return String((value as { _id: unknown })._id)
  }
  return String(value)
}

function mapEvent(raw: RawDoc): WebinarEvent {
  const status = raw.status as WebinarEventStatus
  const scheduledAtRaw = raw.scheduledAt
  const scheduledAt =
    scheduledAtRaw == null
      ? ""
      : typeof scheduledAtRaw === "string"
        ? scheduledAtRaw
        : String(scheduledAtRaw)
  return {
    id: resolveId(raw),
    name: typeof raw.name === "string" ? raw.name : "",
    dayLabel: typeof raw.dayLabel === "string" ? raw.dayLabel : "",
    dateText: typeof raw.dateText === "string" ? raw.dateText : "",
    timeText: typeof raw.timeText === "string" ? raw.timeText : "",
    meetLink: typeof raw.meetLink === "string" ? raw.meetLink : "",
    googleCalendarEventId:
      typeof raw.googleCalendarEventId === "string"
        ? raw.googleCalendarEventId
        : undefined,
    status: status ?? "draft",
    scheduledAt,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  }
}

function mapLead(raw: RawDoc): WebinarLead {
  const status = raw.status as WebinarLeadStatus
  const mappedFieldsRaw = raw.mappedFields
  const mappedFields =
    mappedFieldsRaw != null && typeof mappedFieldsRaw === "object"
      ? (mappedFieldsRaw as Record<string, string>)
      : undefined
  const fieldDataRaw = raw.fieldData
  const fieldData = Array.isArray(fieldDataRaw)
    ? fieldDataRaw
        .filter(
          (row): row is { name: string; values?: string[] } =>
            row != null && typeof row === "object" && "name" in row
        )
        .map((row) => ({
          name: String(row.name),
          values: Array.isArray(row.values)
            ? row.values.map((value) => String(value))
            : [],
        }))
    : undefined
  return {
    id: resolveId(raw),
    name: typeof raw.name === "string" ? raw.name : "",
    lastName: typeof raw.lastName === "string" ? raw.lastName : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    metaLeadgenId: typeof raw.metaLeadgenId === "string" ? raw.metaLeadgenId : "",
    formName: typeof raw.formName === "string" ? raw.formName : undefined,
    mappedFields,
    fieldData,
    platform: typeof raw.platform === "string" ? raw.platform : undefined,
    campaignName: typeof raw.campaignName === "string" ? raw.campaignName : undefined,
    webinarEventId: resolveOptionalId(raw.webinarEventId),
    customerId: resolveOptionalId(raw.customerId),
    notificationSentAt:
      raw.notificationSentAt == null
        ? null
        : typeof raw.notificationSentAt === "string"
          ? raw.notificationSentAt
          : String(raw.notificationSentAt),
    whatsappMessageId:
      typeof raw.whatsappMessageId === "string" ? raw.whatsappMessageId : undefined,
    notificationError:
      typeof raw.notificationError === "string" ? raw.notificationError : undefined,
    status: status ?? "registered",
    convertedCustomerId: resolveOptionalId(raw.convertedCustomerId),
    convertedAt:
      raw.convertedAt == null
        ? null
        : typeof raw.convertedAt === "string"
          ? raw.convertedAt
          : String(raw.convertedAt),
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : undefined,
  }
}

export async function listWebinarEvents(): Promise<WebinarEvent[]> {
  const response = await customersMsAxios.get<RawDoc[]>("webinar-events", auth())
  return (response.data ?? []).map(mapEvent)
}

export async function getWebinarEvent(eventId: string): Promise<WebinarEvent> {
  const response = await customersMsAxios.get<RawDoc>(`webinar-events/${eventId}`, auth())
  return mapEvent(response.data)
}

export async function createWebinarEvent(
  body: CreateWebinarEventBody
): Promise<WebinarEvent> {
  const response = await customersMsAxios.post<RawDoc>("webinar-events", body, auth())
  return mapEvent(response.data)
}

export async function updateWebinarEvent(
  eventId: string,
  body: UpdateWebinarEventBody
): Promise<WebinarEvent> {
  const response = await customersMsAxios.patch<RawDoc>(
    `webinar-events/${eventId}`,
    body,
    auth()
  )
  return mapEvent(response.data)
}

export async function deleteWebinarEvent(
  eventId: string
): Promise<{ readonly deleted: true; readonly id: string }> {
  const response = await customersMsAxios.delete<{
    deleted: true
    id: string
  }>(`webinar-events/${eventId}`, auth())
  return response.data
}

export async function listWebinarLeads(
  params?: ListWebinarLeadsParams
): Promise<WebinarLeadsListResponse> {
  const response = await customersMsAxios.get<{
    items?: RawDoc[]
    total?: number
    page?: number
    limit?: number
  }>("webinar-leads", { params, ...auth() })
  const data = response.data
  return {
    items: (data.items ?? []).map(mapLead),
    total: data.total ?? 0,
    page: data.page ?? 1,
    limit: data.limit ?? 20,
  }
}

export async function getWebinarLead(leadId: string): Promise<WebinarLead> {
  const response = await customersMsAxios.get<RawDoc>(`webinar-leads/${leadId}`, auth())
  return mapLead(response.data)
}

export async function convertWebinarLead(leadId: string): Promise<WebinarLead> {
  const response = await customersMsAxios.post<RawDoc>(
    `webinar-leads/${leadId}/convert`,
    {},
    auth()
  )
  return mapLead(response.data)
}

export async function createWebinarLead(
  body: CreateWebinarLeadBody
): Promise<WebinarLead> {
  const response = await customersMsAxios.post<RawDoc>("webinar-leads", body, auth())
  return mapLead(response.data)
}

export async function importWebinarLeads(
  body: ImportWebinarLeadsBody
): Promise<ImportWebinarLeadsResponse> {
  const response = await customersMsAxios.post<ImportWebinarLeadsResponse>(
    "webinar-leads/import",
    body,
    auth()
  )
  return response.data
}

export async function deleteWebinarLead(
  leadId: string
): Promise<{ readonly deleted: true; readonly id: string }> {
  const response = await customersMsAxios.delete<{
    deleted: true
    id: string
  }>(`webinar-leads/${leadId}`, auth())
  return response.data
}
