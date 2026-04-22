import type {
  CustomerAdminListItem,
  CustomerStepDistributionItem,
} from "../services/customers-ms.service"

/**
 * Groups current table rows by pipeline step (same ids/labels/colors as list API).
 */
export function aggregateStepsFromListItems(
  items: CustomerAdminListItem[]
): CustomerStepDistributionItem[] {
  const byKey = new Map<
    string | null,
    { count: number; name: string; color?: string }
  >()

  for (const row of items) {
    const stepId = row.customerStepId?.trim() ? row.customerStepId.trim() : null
    const name = row.currentStep?.trim() ? row.currentStep.trim() : "Sin paso"
    const color = row.currentStepColor?.trim() || undefined
    const prev = byKey.get(stepId)
    if (prev) {
      prev.count += 1
      if (!prev.color && color) {
        prev.color = color
      }
    } else {
      byKey.set(stepId, { count: 1, name, ...(color ? { color } : {}) })
    }
  }

  const rows: CustomerStepDistributionItem[] = [...byKey.entries()].map(
    ([customerStepId, v]) => ({
      customerStepId,
      name: v.name,
      ...(v.color ? { color: v.color } : {}),
      count: v.count,
    })
  )

  rows.sort((a, b) => b.count - a.count)
  return rows
}
