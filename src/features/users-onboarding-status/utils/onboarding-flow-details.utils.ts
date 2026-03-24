import { onboardingFlowDetailFieldLabels } from "../../../i18n/locales/users-onboarding-status.strings"

function formatDetailValue(value: unknown): string {
  if (value == null) {
    return ""
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export type OnboardingFlowDetailRowType = {
  fieldKey: string
  label: string
  value: string
}

export function rowsFromOnboardingFlowDetails(
  details: Record<string, unknown> | undefined
): OnboardingFlowDetailRowType[] {
  if (details == null) {
    return []
  }
  return Object.entries(details).map(([fieldKey, value]) => ({
    fieldKey,
    label: onboardingFlowDetailFieldLabels[fieldKey] ?? fieldKey,
    value: formatDetailValue(value)
  }))
}
