import type { ListCustomersAdminParams } from "../services/customers-ms.service"
import type { FilterFormState } from "../types/filter-form.types"

export type BuildListQueryOptions = {
  /** When true, omit `customerStepId` (e.g. step distribution / summary under other filters). */
  excludeStepFilter?: boolean
}

export function buildCustomerListQueryParams(
  applied: FilterFormState,
  options?: BuildListQueryOptions
): Omit<ListCustomersAdminParams, "limit" | "skip"> {
  const search = applied.search.trim()
  const stepId =
    options?.excludeStepFilter === true ? "" : applied.customerStepId.trim()
  return {
    ...(applied.excludeFecha ? { omitDateRange: true } : {}),
    ...(!applied.excludeFecha && applied.createdFrom
      ? { createdFrom: applied.createdFrom.clone().startOf("day").toISOString() }
      : {}),
    ...(!applied.excludeFecha && applied.createdTo
      ? { createdTo: applied.createdTo.clone().endOf("day").toISOString() }
      : {}),
    ...(applied.assignedTo
      ? { assignedTo: applied.assignedTo }
      : applied.unassignedOnly
        ? { unassignedOnly: true }
        : {}),
    ...(applied.enabledOnly ? { enabled: true } : {}),
    ...(search ? { search } : {}),
    ...(stepId ? { customerStepId: stepId } : {}),
  }
}
