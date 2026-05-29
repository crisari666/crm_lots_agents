import type { FilterFormState } from "../../customer-v2/types/filter-form.types"
import type { MarketingAudienceFilterBody } from "../services/customers-ms-whatsapp-marketing.types"

export function buildMarketingAudienceFilterBody(
  applied: FilterFormState,
  customerStepIds: string[]
): MarketingAudienceFilterBody {
  const search = applied.search.trim()
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
    ...(applied.referralOnly ? { isReferral: true } : {}),
    ...(search ? { search } : {}),
    ...(customerStepIds.length > 0 ? { customerStepIds } : {}),
  }
}
