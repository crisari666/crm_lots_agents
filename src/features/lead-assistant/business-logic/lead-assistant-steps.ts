import type { LeadAssistantStepKey } from "../types/lead-assistant.types"

export const LEAD_ASSISTANT_STEP_KEYS: readonly LeadAssistantStepKey[] = [
  "connection",
  "identity",
  "knowledge",
  "recovery",
  "activation",
] as const

export const DEFAULT_LEAD_ASSISTANT_STEP: LeadAssistantStepKey = "connection"

export function isLeadAssistantStepKey(value: string | null): value is LeadAssistantStepKey {
  return value != null && (LEAD_ASSISTANT_STEP_KEYS as readonly string[]).includes(value)
}

export function parseLeadAssistantStep(value: string | null): LeadAssistantStepKey {
  return isLeadAssistantStepKey(value) ? value : DEFAULT_LEAD_ASSISTANT_STEP
}
