import type { LeadCandidateRow } from "../types/lead-candidates.types"

export const LEAD_CANDIDATE_SOURCE_MANUAL = "manual" as const
export const LEAD_CANDIDATE_SOURCE_IMPORT = "import" as const

const EDITABLE_SOURCE_TYPES: ReadonlySet<string> = new Set([
  LEAD_CANDIDATE_SOURCE_IMPORT,
  LEAD_CANDIDATE_SOURCE_MANUAL,
])

export function canEditLeadCandidate(row: LeadCandidateRow): boolean {
  if (!EDITABLE_SOURCE_TYPES.has(row.sourceType)) {
    return false
  }
  if (row.status !== "imported") {
    return false
  }
  if (row.promotedUserId != null && row.promotedUserId !== "") {
    return false
  }
  return true
}
