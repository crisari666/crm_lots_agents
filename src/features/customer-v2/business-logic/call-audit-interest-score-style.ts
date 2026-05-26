export function interestScoreChipColor(
  score: number
): "default" | "warning" | "success" {
  if (score >= 4) {
    return "success"
  }
  if (score >= 3) {
    return "warning"
  }
  return "default"
}

export function formatChecklistLabel(passed: number, total: number, checklistWord: string): string {
  return `${passed}/${total} ${checklistWord}`
}

export function buildFailedTooltip(failedLabels: string[]): string {
  if (failedLabels.length === 0) {
    return ""
  }
  const joined = failedLabels.join(", ")
  if (joined.length <= 120) {
    return joined
  }
  return `${joined.slice(0, 117)}…`
}

export function isAtRiskAiCall(
  interestScore: number,
  passed: number,
  total: number
): boolean {
  if (total === 0) {
    return interestScore <= 2
  }
  return interestScore <= 2 || passed / total < 0.5
}
