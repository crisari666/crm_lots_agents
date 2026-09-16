import type { CallAuditIndicatorResult } from "../services/customers-ms-admin-call-audit.types"

export type CallAuditIndicatorsSummary = {
  passed: number
  total: number
  failedLabels: string[]
  earnedPoints: number
  maxPoints: number
  scorePercent: number
}

export function buildCallAuditIndicatorsSummary(
  indicators: ReadonlyArray<
    Pick<CallAuditIndicatorResult, "passed" | "label" | "pointsEarned" | "maxPoints">
  >
): CallAuditIndicatorsSummary {
  const total = indicators.length
  let passed = 0
  let earnedPoints = 0
  let maxPoints = 0
  const failedLabels: string[] = []
  for (const indicator of indicators) {
    earnedPoints += indicator.pointsEarned ?? 0
    maxPoints += indicator.maxPoints ?? 0
    if (indicator.passed === true) {
      passed += 1
    } else {
      failedLabels.push(indicator.label)
    }
  }
  const scorePercent =
    maxPoints > 0 ? Math.round((earnedPoints / maxPoints) * 1000) / 10 : 0
  return {
    passed,
    total,
    failedLabels,
    earnedPoints,
    maxPoints,
    scorePercent,
  }
}
