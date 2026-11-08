import type { LeadListItem } from "../types/leads.types"

/**
 * Convert CTA only for unpromoted leads that still have no ventor assignee.
 */
export function canConvertLead(
  item: Pick<LeadListItem, "isPromoted" | "assignedTo">
): boolean {
  return !item.isPromoted && !item.assignedTo?.trim()
}
