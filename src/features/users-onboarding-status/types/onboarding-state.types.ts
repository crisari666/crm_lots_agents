export type OnboardingStatusType =
  | "Imported"
  | "WS_sent"
  | "Scheduled"
  | "WS_video_sent"
  | "WS_confirmar_capacitacion_dispatched"
  | "WS_training_slots_list_sent"
  | "WS_training_slot_selected"
  | "Needs_human_whatsapp"
  | "Interested"
  | "Call_programmed"
  | "Call_voicemail"
  | "Reschedule_due_twilio_number_occupiedt"
  | "Call_done_success"
  | "Call_failed"
  | "WS_training_sent"
  | "Confirmed_training_request"

export type OnboardingUserType = {
  _id: string
  email: string
  name: string
  phone: string
  lastName: string
}

export type OnboardingLogUpdateType = {
  date: string
  status: string
}

/** List row from `GET onboarding-state/list`; `userId` may be null for orphan state rows. */
export type OnboardingStateType = {
  _id?: string
  userId: OnboardingUserType | null
  createdAt: string
  lastUpdate: string
  status: string
  logsUpdate: OnboardingLogUpdateType[]
  updatedAt?: string
}

export function isOrphanOnboardingListRow(x: OnboardingStateType): boolean {
  return x.userId == null && Boolean((x._id ?? "").trim())
}

export type OnboardingStateListResponse = {
  result: OnboardingStateType[]
  message: string
  error?: string
}

export type OnboardingStatsByLogStatusResponse = {
  result: {
    totalRecords: number
    statusStats: Array<{ status: string | null; count: number }>
  }
  message: string
  error?: string
}

export type OnboardingTriggerResponse = {
  flowId: string
  message: string
}

/** `POST /ms-events/onboarding/send-confirmar-capacitacion` — success body */
export type SendConfirmarCapacitacionResponse = {
  success: true
  triggerAction: string
  flowId: string
  userId: string
  phoneNumber: string
  nameUsed: string
}

/** `POST /ms-events/onboarding/start-voice-call` — success body */
export type StartOnboardingVoiceCallResponse = {
  success: true
  flowId: string
  userId: string
  phoneNumber: string
  nameUsed: string
  voiceCallDispatchedToAgent: boolean
}

/** `GET /onboarding-state/user/:userId/flows` → `result.flows[]` */
export type OnboardingFlowSummaryType = {
  flowId: string
  date: string
  currentStatus: string
  lastEventAt: string
}

export type OnboardingUserFlowsListResponse = {
  result: { flows: OnboardingFlowSummaryType[] }
  message: string
  error?: string
}

export type OnboardingFlowWhatsappMessageIds = {
  greetingMessageId?: string
  videoMessageId?: string
  trainingMessageId?: string
  callNotificationMessageId?: string
}

export type OnboardingFlowEventItemType = {
  date: string
  event: string
  details?: Record<string, unknown>
}

/** `GET /onboarding-state/pipeline/:flowId/logs` — body is not wrapped in `result` */
export type OnboardingFlowDetailType = {
  flowId: string
  userId: string
  phoneNumber: string
  name: string
  whatsappMessageIds: OnboardingFlowWhatsappMessageIds
  createdAt: string | null
  updatedAt: string | null
  events: OnboardingFlowEventItemType[]
}

/** `POST /onboarding-state/flows/delete` */
export type OnboardingFlowsDeleteResponse = {
  result: { deletedCount: number }
  message: string
  error?: string
}

/** `POST /onboarding-state/import/recreate-schedules` */
export type OnboardingRecreateScheduleItemStatus =
  | "scheduled"
  | "immediate_triggered"
  | "lead_candidate_not_found"
  | "missing_phone"

export type OnboardingRecreateSchedulesResponse = {
  result: Array<{
    leadCandidateId: string
    status: OnboardingRecreateScheduleItemStatus
  }>
  message: string
  error?: string
}
