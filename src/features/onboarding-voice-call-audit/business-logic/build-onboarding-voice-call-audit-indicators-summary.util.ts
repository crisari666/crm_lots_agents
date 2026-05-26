export type OnboardingVoiceCallAuditIndicatorsSummary = {
  passed: number
  total: number
  failedLabels: string[]
}

export function buildOnboardingVoiceCallAuditIndicatorsSummary(
  indicators: ReadonlyArray<{ passed: boolean; label: string }>
): OnboardingVoiceCallAuditIndicatorsSummary {
  let passed = 0
  const failedLabels: string[] = []
  for (const row of indicators) {
    if (row.passed) {
      passed += 1
    } else {
      failedLabels.push(row.label)
    }
  }
  return { passed, total: indicators.length, failedLabels }
}
