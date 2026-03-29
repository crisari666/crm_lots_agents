/** User-facing copy for users-onboarding-status feature */
export const usersOnboardingStatusStrings = {
  actionsDialogTitle: "Onboarding actions",
  userLabel: "User",
  triggerOnboardingFlow: "Trigger onboarding flow",
  triggerGreeting: "Saludo inicial",
  triggerCall: "Llamada",
  triggerProposal: "Mensaje confirmación a capacitación",
  close: "Close",
  sending: "Sending…",
  success: "Action completed successfully",
  errorGeneric: "Something went wrong",
  missingPhone: "User has no phone number",
  missingVoiceConfig: "Configure VITE_VOICE_AGENT_FROM_NUMBER in .env",
  viewHistory: "View history",
  actionsOpen: "Triggers",
  historyDialogTitle: "Onboarding flows",
  historyLoading: "Loading flows…",
  historyNoFlows: "No flows found for this user",
  historyColFlowStart: "Flow start",
  historyColCurrentStatus: "Current status",
  historyColLastEvent: "Last event",
  historyOpenLogs: "Open log",
  flowLogsDialogTitle: "Flow timeline",
  flowLogsLoading: "Loading events…",
  flowLogsNoEvents: "No events in this flow",
  flowLogsColWhen: "When",
  flowLogsColEvent: "Event",
  flowLogsColDetails: "Details",
  flowLogsMetaName: "Name",
  flowLogsMetaPhone: "Phone",
  flowLogsMetaCreated: "Created",
  flowLogsMetaUpdated: "Updated",
  flowLogsWhatsappIds: "WhatsApp message IDs",
  transcriptChatHeading: "Call conversation",
  transcriptChatSpeakerAssistant: "Assistant",
  transcriptChatSpeakerUser: "Caller",
  deleteOrphanFlows: "Delete selected",
  deleteOrphanFlowsConfirmTitle: "Delete selected records?",
  deleteOrphanFlowsConfirmBody: (count: number) =>
    `The server will receive ${count} id(s) from the selected rows (list _id values as flowIds).`,
  deleteFlowsNoSelection: "Select at least one row without a user",
  selectOrphanRows: "Select rows without user",
  deleteFlowsConfirmAction: "Delete",
  deleteFlowsCancel: "Cancel",
  deleteFlowsGenericError: "Could not delete flows"
} as const

/** API `event` / `currentStatus` keys → localized label (match keys exactly) */
export const onboardingFlowEventLabels: Record<string, string> = {
  "onboarding.flow_triggered": "Flow started (CRM trigger)",
  "whatsapp.message_sent": "Greeting accepted by pipeline",
  "whatsapp.video_message_sent": "Video template message recorded",
  "whatsapp.interested_button_clicked": "User tapped CTA on greeting",
  "whatsapp.message_delivered": "WhatsApp delivery confirmed",
  "user.clicked_call_button": "User tapped call on video message",
  "call.notification_sent": "Call notification sent; voice handoff",
  "call.transcript_complete": "Voice transcript completed",
  "call.completed_successfully": "Call completed; training booking follows",
  "sent.training_message": "Training message sent"
}

export function onboardingFlowEventLabel(eventKey: string): string {
  return onboardingFlowEventLabels[eventKey] ?? eventKey
}

/** Optional `details` object keys → short labels */
export const onboardingFlowDetailFieldLabels: Record<string, string> = {
  userId: "User ID",
  name: "Name",
  greetingMessageId: "Greeting message ID",
  videoMessageId: "Video message ID",
  trainingMessageId: "Training message ID",
  callNotificationMessageId: "Call notification message ID",
  buttonPayload: "Button payload",
  fromWaId: "From WhatsApp ID",
  resolvedByWaId: "Resolved by WhatsApp ID",
  messageId: "Message ID",
  transcript: "Transcript",
  callSid: "Call SID",
  customer_id: "Customer ID",
  segments: "Segments",
  trainingId: "Training ID",
  trainingDate: "Training date"
}
