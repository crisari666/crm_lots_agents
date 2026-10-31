import type {
  LeadConversationListItem,
  LeadConversationStatus,
  LeadConversationStep,
} from "../../lead-conversations/types/lead-conversations.types"
import type { LeadListItem } from "../types/leads.types"

const STATUSES: ReadonlySet<string> = new Set([
  "active",
  "scheduled",
  "disqualified",
  "abandoned",
])

const STEPS: ReadonlySet<string> = new Set([
  "initial",
  "ask_project",
  "ask_lot_range",
  "ask_payment",
  "ask_schedule",
  "ask_call_slot",
  "reminder_sent",
  "scheduled",
  "closed",
])

/**
 * Builds a list-row stub so LeadConversationChatDrawer header works when opened from the leads inbox.
 */
export function mapLeadToConversationItem(lead: LeadListItem): LeadConversationListItem | null {
  const sessionId = lead.leadSession?.sessionId?.trim()
  if (!sessionId) {
    return null
  }
  const statusRaw = lead.leadSession?.status ?? "active"
  const stepRaw = lead.leadSession?.step ?? "initial"
  const status: LeadConversationStatus = STATUSES.has(statusRaw)
    ? (statusRaw as LeadConversationStatus)
    : "active"
  const step: LeadConversationStep = STEPS.has(stepRaw) ? (stepRaw as LeadConversationStep) : "initial"
  const customerName = `${lead.name} ${lead.lastName}`.trim() || lead.phone
  return {
    sessionId,
    customerId: lead.id,
    customerName,
    phone: lead.phone,
    isAllProjects: false,
    step,
    status,
    score: lead.leadSession?.score ?? 0,
    maxScore: 10,
    priority: lead.leadSession?.priority ?? 1,
  }
}
