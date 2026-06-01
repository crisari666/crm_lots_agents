import { emptyFilters, type FilterFormState } from "../../customer-v2/types/filter-form.types"
import type { MarketingAudienceFilterBody } from "../services/customers-ms-whatsapp-marketing.types"

/** Default audience filters for the marketing wizard (no implicit unassigned-only). */
export function emptyMarketingCampaignAudienceFilters(): FilterFormState {
  return {
    ...emptyFilters(),
    excludeFecha: false,
    unassignedOnly: false,
  }
}

function resolveCustomerStepIds(
  applied: FilterFormState,
  selectedStepIds: readonly string[],
): string[] {
  const fromFilterPanel = applied.customerStepId.trim()
  const merged = new Set<string>()
  for (const stepId of selectedStepIds) {
    const trimmed = stepId.trim()
    if (trimmed.length > 0) {
      merged.add(trimmed)
    }
  }
  if (fromFilterPanel.length > 0) {
    merged.add(fromFilterPanel)
  }
  return [...merged]
}

export function buildMarketingAudienceFilterBody(
  applied: FilterFormState,
  selectedStepIds: readonly string[],
): MarketingAudienceFilterBody {
  const search = applied.search.trim()
  const customerStepIds = resolveCustomerStepIds(applied, selectedStepIds)
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
