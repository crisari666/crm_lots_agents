import type { ListCustomersAdminParams } from "../services/customers-ms.service"
import type { FilterFormState } from "../types/filter-form.types"

export type BuildListQueryOptions = {
  /** When true, omit `customerStepId` (e.g. step distribution / summary under other filters). */
  excludeStepFilter?: boolean
  /** Office/team user ids for `assignedToIn` when no single assignee is selected. */
  scopeUserIds?: string[]
}

export function buildCustomerListQueryParams(
  applied: FilterFormState,
  options?: BuildListQueryOptions
): Omit<ListCustomersAdminParams, "limit" | "skip"> {
  const search = applied.search.trim()
  const stepId =
    options?.excludeStepFilter === true ? "" : applied.customerStepId.trim()
  const scopeUserIds = options?.scopeUserIds ?? []
  const hasAssignedTo = applied.assignedTo.trim() !== ""
  const assigneeFilter = hasAssignedTo
    ? { assignedTo: applied.assignedTo }
    : scopeUserIds.length > 0
      ? { assignedToIn: scopeUserIds }
      : applied.unassignedOnly
        ? { unassignedOnly: true }
        : {}
  return {
    ...(applied.excludeFecha ? { omitDateRange: true } : {}),
    ...(!applied.excludeFecha && applied.createdFrom
      ? { createdFrom: applied.createdFrom.clone().startOf("day").toISOString() }
      : {}),
    ...(!applied.excludeFecha && applied.createdTo
      ? { createdTo: applied.createdTo.clone().endOf("day").toISOString() }
      : {}),
    ...assigneeFilter,
    ...(applied.enabledOnly ? { enabled: true } : {}),
    ...(applied.referralOnly ? { isReferral: true } : {}),
    ...(search ? { search } : {}),
    ...(stepId ? { customerStepId: stepId } : {}),
    ...(applied.createdBy.trim() ? { createdBy: applied.createdBy.trim() } : {}),
  }
}
