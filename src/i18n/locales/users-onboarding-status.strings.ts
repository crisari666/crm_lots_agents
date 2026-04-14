import type { OnboardingStatusType } from "../../features/users-onboarding-status/types/onboarding-state.types"

/** Título y descripción para el filtro de estado (valores de API sin cambiar) */
export const onboardingStatusFilterI18n: Record<
  OnboardingStatusType | "all",
  { title: string; description: string }
> = {
  all: {
    title: "Todos",
    description: "Muestra a todos los usuarios, sin filtrar por en qué van del proceso"
  },
  Imported: {
    title: "Importado",
    description: "Se importo en el CRM, no se programao el flujo"
  },
  Scheduled: {
    title: "Programado",
    description: "Tiene agendado el flujo automatico, no ha iniciado el flujo"
  },
  WS_sent: {
    title: "Saludo por WhatsApp enviado",
    description: "Ya recibió el mensaje de bienvenida o saludo inicial por WhatsApp"
  },
  WS_video_sent: {
    title: "Video o siguiente mensaje enviado",
    description: "Ya se le envió el video o el mensaje que sigue al saludo en WhatsApp"
  },
  Needs_human_whatsapp: {
    title: "Requiere atención humana (WhatsApp)",
    description: "Reportado como spam por Whatsapp Business"
  },
  Interested: {
    title: "Mostró interés",
    description: "Oprimio el boton interesado del video"
  },
  Call_programmed: {
    title: "Llamada programada",
    description: "Tiene una llamada telefónica agendada con el agente de voz"
  },
  Call_done_success: {
    title: "Llamada completada",
    description: "La persona contesto la llamada pero colgo."
  },
  Call_failed: {
    title: "Llamada no completada",
    description: "La llamada no se pudo completar o hubo un fallo técnico"
  },
  WS_training_sent: {
    title: "Mensaje de capacitación enviado",
    description: "Ya recibió por WhatsApp la información sobre la capacitación"
  },
  Confirmed_training_request: {
    title: "Capacitación confirmada",
    description: "Confirmó asistencia o fecha para la capacitación"
  },
  Call_voicemail: {
    title: "Correo de Voz",
    description: "La persona no contesto"
  },
  Reschedule_due_twilio_number_occupiedt: {
    title: "Reagendado debido a que el número de Twilio está ocupado",
    description: "El número de Twilio está ocupado, se reagendó la llamada"
  }
}

/** User-facing copy for users-onboarding-status feature */
export const usersOnboardingStatusStrings = {
  actionsDialogTitle: "Onboarding actions",
  userLabel: "User",
  triggerOnboardingFlow: "Trigger onboarding flow",
  triggerGreeting: "Saludo inicial",
  triggerCall: "Llamada",
  triggerProposal: "Mensaje confirmación a capacitación",
  sendConfirmarCapacitacion: "Enviar flujo confirmar capacitación",
  sendConfirmarCapacitacionSuccess: (flowId: string) =>
    `Confirmar capacitación enviado. Nuevo flow ID: ${flowId}`,
  trainingDateLabel: "Training date",
  trainingDatePlaceholder: "Select a training date",
  missingTrainingDate: "Select a training date before sending",
  trainingDateLoading: "Loading training dates...",
  noTrainingDates: "No training dates available",
  close: "Close",
  sending: "Sending…",
  success: "Action completed successfully",
  errorGeneric: "Something went wrong",
  missingPhone: "User has no phone number",
  missingVoiceConfig: "Configure VITE_VOICE_AGENT_FROM_NUMBER in .env",
  voiceCallStartSuccessDispatched: (flowId: string) =>
    `Voice call sent to agent. Flow ID: ${flowId}`,
  voiceCallStartSuccessScheduled: (flowId: string) =>
    `Voice call scheduled (no free line yet; will retry). Flow ID: ${flowId}`,
  statusFilterLabel: "Estado del proceso",
  searchUserLabel: "Search user",
  refresh: "Refresh",
  lastUpdateFromLabel: "Last update from",
  lastUpdateToLabel: "Last update to",
  lastUpdateRangeLabel: "Last update range",
  /** Filas que ves en la tabla; si hay búsqueda, total es lo que devolvió el estado antes de filtrar */
  listRowsShown: (visible: number, total: number) =>
    visible === total
      ? `Se muestran ${visible} fila${visible === 1 ? "" : "s"}`
      : `Se muestran ${visible} de ${total} fila${total === 1 ? "" : "s"} (búsqueda activa)`,
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
  deleteFlowsGenericError: "Could not delete flows",
  recreateSchedulesNeedsHumanWhatsapp: "Reschedule Needs_human_whatsapp",
  recreateSchedulesNoUsers: "No users with Needs_human_whatsapp in current list",
  recreateSchedulesError: "Could not recreate schedules",
  selectUsersForReschedule: "Select users to reschedule import first step",
  rescheduleFirstStepLabel: "First step for reschedule",
  rescheduleFirstStepPlaceholder: "Choose first step",
  rescheduleFirstStepScheduledWhatsapp: "Scheduled WhatsApp greeting (import queue)",
  rescheduleFirstStepImmediateWhatsapp: "Immediate WhatsApp (onboarding.user_imported)",
  rescheduleFirstStepVoice: "Voice call (import queue)",
  rescheduleSelectedUsers: "Reschedule selected",
  rescheduleNoSelection: "Select at least one user and a first step",
  exportVisibleRows: "Export visible users",
  listColUser: "User",
  listColPhone: "Phone",
  listColEmail: "Email",
  listColStatus: "Status",
  statusChartTitle: "Status distribution",
  statusChartNoData: "No data to display in chart",
  whatsappChatOpen: "WhatsApp conversation",
  whatsappChatDialogTitle: "WhatsApp chat",
  whatsappChatLoading: "Loading conversation…",
  whatsappChatNoPhone: "User has no phone number to match a chat",
  whatsappChatNotFound: "No WhatsApp chat found for this phone number",
  whatsappChatError: "Could not load WhatsApp messages",
  whatsappChatEmpty: "No messages in this chat yet",
  whatsappChatUserBubble: "User",
  whatsappChatSystemBubble: "Assistant",
  whatsappChatMessageOtherType: (messageType: string) => `[${messageType}]`,
  whatsappChatSend: "Send",
  whatsappChatMessagePlaceholder: "Type a message",
  whatsappChatSendError: "Could not send the message",
  whatsappChatReload: "Reload messages"
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
  "sent.training_message": "Training message sent",
  "onboarding.manual_send_confirmar_capacitacion": "Manual: confirmar capacitación (CRM)",
  "whatsapp.confirmar_capacitacion_dispatched": "Confirmar capacitación template dispatched"
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
  confirmarCapacitacionMessageId: "Confirmar capacitación message ID",
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
