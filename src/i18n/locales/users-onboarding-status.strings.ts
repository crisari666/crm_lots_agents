import type { OnboardingStatusType } from "../../features/users-onboarding-status/types/onboarding-state.types"

/** Título y descripción para el filtro de estado (valores de API sin cambiar) */
export const onboardingStatusFilterI18n: Record<
  OnboardingStatusType | "all",
  { title: string; description: string }
> = {
  all: {
    title: "Todos",
    description: "Muestra todos los usuarios, sin filtrar por etapa del proceso"
  },
  Imported: {
    title: "Importado",
    description: "Se importó en el CRM; aún no se programa el flujo"
  },
  Scheduled: {
    title: "Programado",
    description: "Tiene el flujo automático agendado; aún no ha iniciado"
  },
  WS_sent: {
    title: "Saludo por WhatsApp enviado",
    description: "Ya recibió el mensaje de bienvenida o saludo inicial por WhatsApp"
  },
  WS_video_sent: {
    title: "Video o siguiente mensaje enviado",
    description: "Ya se le envió el video o el mensaje posterior al saludo por WhatsApp"
  },
  WS_confirmar_capacitacion_dispatched: {
    title: "Confirmar capacitación enviado",
    description: "Se despachó la plantilla de confirmación de capacitación por WhatsApp"
  },
  WS_training_slots_list_sent: {
    title: "Lista de cupos enviada",
    description: "Se envió la lista interactiva de horarios de capacitación por WhatsApp"
  },
  WS_training_slot_selected: {
    title: "Cupo seleccionado",
    description: "El usuario eligió un horario desde la lista de capacitación"
  },
  Needs_human_whatsapp: {
    title: "Requiere atención humana (WhatsApp)",
    description: "Reportado como spam por WhatsApp Business"
  },
  Interested: {
    title: "Mostró interés",
    description: "Pulsó el botón de interés en el video"
  },
  Call_programmed: {
    title: "Llamada programada",
    description: "Tiene una llamada telefónica agendada con el agente de voz"
  },
  Call_done_success: {
    title: "Llamada completada",
    description: "La persona contestó la llamada"
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
    title: "Buzón de voz",
    description: "La persona no contestó"
  },
  Reschedule_due_twilio_number_occupiedt: {
    title: "Reagendado: número Twilio ocupado",
    description: "El número de Twilio estaba ocupado; se reagendó la llamada"
  }
}

/** Textos de interfaz del módulo de estado de onboarding */
export const usersOnboardingStatusStrings = {
  actionsDialogTitle: "Acciones de onboarding",
  userLabel: "Usuario",
  triggerOnboardingFlow: "Disparar flujo de onboarding",
  triggerGreeting: "Saludo inicial",
  triggerCall: "Llamada",
  triggerProposal: "Mensaje de confirmación a capacitación",
  sendConfirmarCapacitacion: "Enviar flujo confirmar capacitación",
  sendConfirmarCapacitacionSuccess: (flowId: string) =>
    `Confirmar capacitación enviado. Nuevo ID de flujo: ${flowId}`,
  trainingDateLabel: "Fecha de capacitación",
  trainingDatePlaceholder: "Selecciona una fecha de capacitación",
  missingTrainingDate: "Selecciona una fecha de capacitación antes de enviar",
  trainingDateLoading: "Cargando fechas de capacitación…",
  noTrainingDates: "No hay fechas de capacitación disponibles",
  close: "Cerrar",
  sending: "Enviando…",
  success: "Acción completada correctamente",
  errorGeneric: "Algo salió mal",
  missingPhone: "El usuario no tiene número de teléfono",
  missingVoiceConfig: "Configura VITE_VOICE_AGENT_FROM_NUMBER en .env",
  voiceCallStartSuccessDispatched: (flowId: string) =>
    `Llamada de voz enviada al agente. ID de flujo: ${flowId}`,
  voiceCallStartSuccessScheduled: (flowId: string) =>
    `Llamada de voz programada (aún no hay línea libre; se reintentará). ID de flujo: ${flowId}`,
  filtersSectionTitle: "Filtros de la lista",
  statusFilterLabel: "Estado del proceso",
  includeSpecificUpdateLabel: "Buscar en historial",
  containsStatusInLogsLabel: "Estado en registros",
  searchUserLabel: "Buscar usuario",
  refresh: "Actualizar",
  lastUpdateFromLabel: "Última actualización desde",
  lastUpdateToLabel: "Última actualización hasta",
  lastUpdateRangeLabel: "Rango de última actualización",
  /** Filas visibles; con búsqueda, total = filas devueltas antes de filtrar en cliente */
  listRowsShown: (visible: number, total: number) =>
    visible === total
      ? `Se muestran ${visible} fila${visible === 1 ? "" : "s"}`
      : `Se muestran ${visible} de ${total} fila${total === 1 ? "" : "s"} (búsqueda activa)`,
  viewHistory: "Ver historial",
  actionsOpen: "Disparadores",
  historyDialogTitle: "Flujos de onboarding",
  historyLoading: "Cargando flujos…",
  historyNoFlows: "No hay flujos para este usuario",
  historyColFlowStart: "Inicio del flujo",
  historyColCurrentStatus: "Estado actual",
  historyColLastEvent: "Último evento",
  historyOpenLogs: "Abrir registro",
  flowLogsDialogTitle: "Línea de tiempo del flujo",
  flowLogsLoading: "Cargando eventos…",
  flowLogsNoEvents: "No hay eventos en este flujo",
  flowLogsColWhen: "Cuándo",
  flowLogsColEvent: "Evento",
  flowLogsColDetails: "Detalles",
  flowLogsMetaName: "Nombre",
  flowLogsMetaPhone: "Teléfono",
  flowLogsMetaCreated: "Creado",
  flowLogsMetaUpdated: "Actualizado",
  flowLogsWhatsappIds: "IDs de mensajes de WhatsApp",
  transcriptChatHeading: "Conversación de la llamada",
  transcriptChatSpeakerAssistant: "Asistente",
  transcriptChatSpeakerUser: "Persona que llama",
  deleteOrphanFlows: "Eliminar seleccionados",
  deleteOrphanFlowsConfirmTitle: "¿Eliminar los registros seleccionados?",
  deleteOrphanFlowsConfirmBody: (count: number) =>
    `El servidor recibirá ${count} id(s) de las filas seleccionadas (valores _id de la lista como flowIds).`,
  deleteFlowsNoSelection: "Selecciona al menos una fila sin usuario",
  selectOrphanRows: "Seleccionar filas sin usuario",
  deleteFlowsConfirmAction: "Eliminar",
  deleteFlowsCancel: "Cancelar",
  deleteFlowsGenericError: "No se pudieron eliminar los flujos",
  recreateSchedulesNeedsHumanWhatsapp: "Reprogramar Needs_human_whatsapp",
  recreateSchedulesNoUsers: "No hay usuarios con Needs_human_whatsapp en la lista actual",
  recreateSchedulesError: "No se pudieron reprogramar los horarios",
  selectUsersForReschedule: "Seleccionar usuarios para reprogramar el primer paso del import",
  rescheduleFirstStepLabel: "Primer paso al reprogramar",
  rescheduleFirstStepPlaceholder: "Elige el primer paso",
  rescheduleFirstStepScheduledWhatsapp: "Saludo WhatsApp programado (cola de import)",
  rescheduleFirstStepImmediateWhatsapp: "WhatsApp inmediato (onboarding.user_imported)",
  rescheduleFirstStepVoice: "Llamada de voz (cola de import)",
  rescheduleSelectedUsers: "Reprogramar seleccionados",
  rescheduleNoSelection: "Selecciona al menos un usuario y un primer paso",
  exportVisibleRows: "Exportar usuarios visibles",
  listColUser: "Usuario",
  listColPhone: "Teléfono",
  listColEmail: "Correo",
  listColStatus: "Estado",
  listColWhatsApp: "WhatsApp",
  listColLastUpdate: "Última actualización",
  listColHistory: "Historial",
  listNoUsersFound: "No se encontraron usuarios",
  listEmptyStateHint: "Prueba a cambiar filtros o actualizar la lista.",
  listLoadingLabel: "Cargando lista de onboarding",
  listEmptyCell: "—",
  listHeaderOrphanSelect: "Fila huérfana",
  listHeaderRescheduleSelect: "Reprogramar",
  listSelectOrphanRowA11y: "Seleccionar esta fila de onboarding sin usuario",
  listSelectUserForRescheduleA11y: "Seleccionar este usuario para reprogramar el import",
  actionsTooltipNoUser: "Esta fila no tiene usuario en el CRM",
  historyTooltipNoUser: "El historial requiere un usuario vinculado en el CRM",
  whatsappTooltipNoUser: "WhatsApp requiere un usuario vinculado en el CRM",
  whatsappTooltipNoPhone: "No hay número de teléfono registrado",
  statusChartTitle: "Distribución por estado",
  statusChartNoData: "No hay datos para mostrar en el gráfico",
  statusChartOpen: "Ver gráfico de estados",
  statusChartDialogTitle: "Gráfico de estados de onboarding",
  logStatusStatsChartOpen: "Ver gráfico de estadísticas de registros",
  logStatusStatsChartDialogTitle: "Estadísticas de estados en registros de onboarding",
  logStatusStatsBarLabel: "Registros",
  logStatusStatsTotalRecords: (count: number) => `Total de registros en el rango: ${count}`,
  statusWithoutLogs: "Sin estado en registros",
  whatsappChatOpen: "Conversación de WhatsApp",
  whatsappChatDialogTitle: "Chat de WhatsApp",
  whatsappChatLoading: "Cargando conversación…",
  whatsappChatNoPhone: "El usuario no tiene teléfono para asociar un chat",
  whatsappChatNotFound: "No hay chat de WhatsApp para este número",
  whatsappChatError: "No se pudieron cargar los mensajes de WhatsApp",
  whatsappChatEmpty: "Aún no hay mensajes en este chat",
  whatsappChatUserBubble: "Usuario",
  whatsappChatSystemBubble: "Asistente",
  whatsappChatMessageOtherType: (messageType: string) => `[${messageType}]`,
  whatsappChatSend: "Enviar",
  whatsappChatMessagePlaceholder: "Escribe un mensaje",
  whatsappChatSendError: "No se pudo enviar el mensaje",
  whatsappChatReload: "Recargar mensajes",
  controlsReportsExportTitle: "Informes y exportación",
  controlsBulkActionsSectionTitle: "Acciones masivas",
  controlsFiltersUpdatingLabel: "Actualizando lista…",
  controlsStatusChartDisabledNoRows: "Hace falta al menos una fila visible para este gráfico",
  controlsExportDisabledNoRows: "No hay nada visible para exportar",
  controlsActionWaitLoading: "Espera a que termine de cargar la lista",
  controlsActionWaitInFlight: "Espera a que termine la solicitud en curso",
  includeSpecificUpdateA11y: "Buscar dentro del historial de onboarding al filtrar",
  containsStatusInLogsA11y: "Coincidir filas cuyos registros contengan los estados seleccionados"
} as const

/** Claves de API `event` / `currentStatus` → etiqueta en español (coincidir claves exactas) */
export const onboardingFlowEventLabels: Record<string, string> = {
  "onboarding.flow_triggered": "Flujo iniciado (disparador CRM)",
  "whatsapp.message_sent": "Saludo aceptado por el pipeline",
  "whatsapp.video_message_sent": "Mensaje de plantilla de video registrado",
  "whatsapp.interested_button_clicked": "El usuario pulsó el CTA del saludo",
  "whatsapp.message_delivered": "Entrega de WhatsApp confirmada",
  "user.clicked_call_button": "El usuario pulsó llamar en el mensaje de video",
  "call.notification_sent": "Notificación de llamada enviada; handoff a voz",
  "call.transcript_complete": "Transcripción de voz completada",
  "call.completed_successfully": "Llamada completada; sigue reserva de capacitación",
  "sent.training_message": "Mensaje de capacitación enviado",
  "onboarding.manual_send_confirmar_capacitacion": "Manual: confirmar capacitación (CRM)",
  "whatsapp.confirmar_capacitacion_dispatched": "Plantilla confirmar capacitación despachada"
}

export function onboardingFlowEventLabel(eventKey: string): string {
  return onboardingFlowEventLabels[eventKey] ?? eventKey
}

/** Claves opcionales del objeto `details` → etiquetas cortas */
export const onboardingFlowDetailFieldLabels: Record<string, string> = {
  userId: "ID de usuario",
  name: "Nombre",
  greetingMessageId: "ID del mensaje de saludo",
  videoMessageId: "ID del mensaje de video",
  trainingMessageId: "ID del mensaje de capacitación",
  confirmarCapacitacionMessageId: "ID del mensaje confirmar capacitación",
  callNotificationMessageId: "ID del mensaje de notificación de llamada",
  buttonPayload: "Payload del botón",
  fromWaId: "ID de WhatsApp de origen",
  resolvedByWaId: "Resuelto por ID de WhatsApp",
  messageId: "ID del mensaje",
  transcript: "Transcripción",
  callSid: "SID de la llamada",
  customer_id: "ID de cliente",
  segments: "Segmentos",
  trainingId: "ID de capacitación",
  trainingDate: "Fecha de capacitación"
}
