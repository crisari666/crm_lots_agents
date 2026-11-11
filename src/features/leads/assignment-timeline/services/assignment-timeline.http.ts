import { customersMsAuthHeaders, customersMsAxios } from "../../../../app/customers-ms-http"
import type {
  AssignmentTimelineResult,
  ListAssignmentTimelineParams,
} from "../types/assignment-timeline.types"

const PATH = "admin/customer/assignment-timeline"

export async function listAssignmentTimeline(
  params: ListAssignmentTimelineParams
): Promise<AssignmentTimelineResult> {
  const response = await customersMsAxios.get<AssignmentTimelineResult>(PATH, {
    headers: customersMsAuthHeaders(),
    params: {
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      ...(params.ventorId?.trim() ? { ventorId: params.ventorId.trim() } : {}),
      ...(params.flowStrategy ? { flowStrategy: params.flowStrategy } : {}),
      ...(params.cursorBefore ? { cursorBefore: params.cursorBefore } : {}),
      ...(params.limit != null ? { limit: params.limit } : {}),
    },
  })
  return response.data
}
