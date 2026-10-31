import { customersMsAuthHeaders, customersMsAxios } from "../../../app/customers-ms-http"
import type {
  LeadCallEditableStatus,
  LeadCallItem,
  LeadCallVentor,
  ListLeadCallsParams,
} from "../types/lead-call-schedule.types"

const BASE_PATH = "admin/customer/lead-calls/agenda"

const auth = () => ({ headers: customersMsAuthHeaders() })
const eventPath = (eventId: string): string => `${BASE_PATH}/${encodeURIComponent(eventId)}`

export async function listLeadCalls(params: ListLeadCallsParams): Promise<LeadCallItem[]> {
  const response = await customersMsAxios.get<LeadCallItem[]>(BASE_PATH, {
    ...auth(),
    params: {
      from: params.from,
      to: params.to,
      ...(params.userId ? { userId: params.userId } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  })
  return response.data
}

export async function listLeadCallVentors(): Promise<LeadCallVentor[]> {
  const response = await customersMsAxios.get<LeadCallVentor[]>(`${BASE_PATH}/ventors`, auth())
  return response.data
}

export async function reassignLeadCall(eventId: string, userId?: string): Promise<LeadCallItem> {
  const response = await customersMsAxios.patch<LeadCallItem>(
    `${eventPath(eventId)}/reassign`,
    userId ? { userId } : {},
    auth()
  )
  return response.data
}

export type RescheduleLeadCallBody = {
  date: string
  time: string
  userId?: string
}

export async function rescheduleLeadCall(
  eventId: string,
  body: RescheduleLeadCallBody
): Promise<LeadCallItem> {
  const response = await customersMsAxios.patch<LeadCallItem>(
    `${eventPath(eventId)}/reschedule`,
    {
      date: body.date,
      time: body.time,
      ...(body.userId ? { userId: body.userId } : {}),
    },
    auth()
  )
  return response.data
}

export async function updateLeadCallStatus(eventId: string, status: LeadCallEditableStatus): Promise<LeadCallItem> {
  const response = await customersMsAxios.patch<LeadCallItem>(`${eventPath(eventId)}/status`, { status }, auth())
  return response.data
}
