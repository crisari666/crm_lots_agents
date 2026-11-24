export type LeadAssistantStepKey =
  | "connection"
  | "identity"
  | "knowledge"
  | "recovery"
  | "activation"

export type LeadPricePolicy = "entry_ticket_first" | "full_price" | "defer_to_advisor"

export type LeadFlowVersion = "v1" | "v2"

export type LeadTemplateBindingSource =
  | "customer_first_name"
  | "assistant_name"
  | "business_name"
  | "project_title"
  | "static"

export type LeadTemplateBinding = {
  readonly variable: string
  readonly component: "header" | "body"
  readonly format: "named" | "positional"
  readonly source: LeadTemplateBindingSource
  readonly staticValue?: string
}

export type LeadTemplateRef = {
  readonly name: string
  readonly language: string
  readonly bodyText: string
  readonly bindings: LeadTemplateBinding[]
}

export type LeadWhatsappTemplateVariable = {
  readonly name: string
  readonly component: "header" | "body"
  readonly format: "named" | "positional"
}

export type LeadWhatsappTemplate = {
  readonly name: string
  readonly language: string
  readonly category: string
  readonly bodyText: string
  readonly headerFormat?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT"
  readonly headerText?: string
  readonly footerText?: string
  readonly buttons: { readonly type: string; readonly text: string }[]
  readonly variables: LeadWhatsappTemplateVariable[]
  readonly isSupported: boolean
  readonly unsupportedReason?: "media_header" | "dynamic_button"
}

export type LeadTemplatesResponse = {
  readonly templates: LeadWhatsappTemplate[]
  readonly phoneNumberId?: string
  readonly fetchedAt: string
  readonly error?: string
}

export type LeadAssistantSettings = {
  readonly assistantName: string
  readonly businessName: string
  readonly greeting: string
  readonly pricePolicy: LeadPricePolicy
  readonly defaultInboundFlow: LeadFlowVersion
  readonly enabled: boolean
  readonly replyDebounceSeconds: number
  readonly welcomeTemplate?: LeadTemplateRef
  readonly updatedAt?: string
}

export type UpdateLeadAssistantSettingsBody = {
  readonly assistantName?: string
  readonly businessName?: string
  readonly greeting?: string
  readonly pricePolicy?: LeadPricePolicy
  readonly defaultInboundFlow?: LeadFlowVersion
  readonly enabled?: boolean
  readonly replyDebounceSeconds?: number
  readonly welcomeTemplate?: LeadTemplateRef | null
}

export type LeadFaqCategory =
  | "price"
  | "financing"
  | "legal"
  | "location"
  | "services"
  | "process"
  | "other"

export type LeadFaqProjectAnswer = {
  readonly projectId: string
  readonly projectTitle: string
  readonly answer: string
}

export type LeadFaq = {
  readonly id: string
  readonly question: string
  readonly alternativePhrasings: string[]
  readonly category: LeadFaqCategory
  readonly defaultAnswer?: string
  readonly projectAnswers: LeadFaqProjectAnswer[]
  readonly enabled: boolean
  readonly timesUsed: number
  readonly lastUsedAt?: string
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type LeadFaqBody = {
  readonly question?: string
  readonly alternativePhrasings?: string[]
  readonly category: LeadFaqCategory
  readonly defaultAnswer?: string
  readonly projectAnswers?: LeadFaqProjectAnswer[]
  readonly enabled?: boolean
}

export type LeadUnansweredStatus = "open" | "converted" | "dismissed"

export type LeadUnansweredQuestion = {
  readonly id: string
  readonly question: string
  readonly sessionId: string
  readonly customerId: string
  readonly projectId?: string
  readonly projectTitle?: string
  readonly status: LeadUnansweredStatus
  readonly faqId?: string
  readonly askedAt: string
}

export type LeadUnansweredPage = {
  readonly items: LeadUnansweredQuestion[]
  readonly total: number
  readonly page: number
  readonly limit: number
}

export type LeadUnansweredConvertResult = {
  readonly faq: LeadFaq
  readonly question: LeadUnansweredQuestion
}

export type LeadRecoveryStep = {
  readonly id: string
  readonly label: string
  readonly offsetHours: number
  readonly enabled: boolean
  readonly template: LeadTemplateRef
  readonly sentCount: number
  readonly repliedCount: number
}

export type LeadRecoveryStepBody = {
  readonly id?: string
  readonly label: string
  readonly offsetHours: number
  readonly enabled: boolean
  readonly template: LeadTemplateRef
}

export type LeadRecoverySequence = {
  readonly steps: LeadRecoveryStep[]
}

export type LeadReadinessStatus = "ready" | "attention" | "missing"

export type LeadReadinessItem = {
  readonly key: LeadAssistantStepKey
  readonly status: LeadReadinessStatus
  readonly detail: string
}

export type LeadReadiness = {
  readonly items: LeadReadinessItem[]
  readonly readyCount: number
  readonly total: number
}

export type LeadProfileStage = "opening" | "discovery" | "value" | "bridge" | "booking" | "booked"

export type LeadProfile = {
  readonly stage?: LeadProfileStage
  readonly stageTurns?: number
  readonly motivation?: "build" | "invest" | "leisure" | "exploring"
  readonly experience?: "first_property" | "has_property"
  readonly paymentMethod?: "financed" | "cash"
  readonly timeline?:
    | "immediate"
    | "within_30_days"
    | "within_3_months"
    | "future"
    | "not_now"
  readonly budget?: string
  readonly lotPreference?: string
  readonly mainObjection?: string
  readonly sentMedia?: ("video" | "plan" | "brochure")[]
}

export type LeadTemperature = "hot" | "warm" | "cold"

export type LeadSimulatedMessageKind =
  | "text"
  | "image"
  | "document"
  | "buttons"
  | "list"
  | "contacts"
  | "template"
  | "video"

export type LeadSimulatedOption = {
  readonly id: string
  readonly title: string
  readonly description?: string
}

export type LeadSimulatedReply = {
  readonly kind: LeadSimulatedMessageKind
  readonly body?: string
  readonly options?: LeadSimulatedOption[]
  readonly mediaUrl?: string
}

export type LeadSimulatedTranscriptMessage = {
  readonly direction: "inbound" | "outbound"
  readonly body: string
}

export type LeadSimulatedAnswers = {
  readonly rangoLote?: string
  readonly formaPago?: "financed" | "cash"
  readonly horarioLlamada?: string
  readonly fechaLlamada?: string
}

/** Opaque conversation state the client round-trips on every simulate turn. */
export type LeadSimulatedState = {
  readonly firstName: string
  readonly step: string
  readonly status: "active" | "scheduled" | "disqualified" | "abandoned"
  readonly projectId?: string
  readonly projectTitle?: string
  readonly leadProfile: LeadProfile
  readonly scoreSignals: string[]
  readonly transcript: LeadSimulatedTranscriptMessage[]
  readonly answers?: LeadSimulatedAnswers
}

export type LeadSimulateRequest = {
  readonly projectId?: string
  readonly state?: LeadSimulatedState
  readonly message: string
}

export type LeadSimulatorInsights = {
  readonly stage: LeadProfileStage
  readonly profile: LeadProfile
  readonly score: number
  readonly maxScore: number
  readonly temperature: LeadTemperature
  readonly signals: string[]
  readonly usedFaqs: { readonly id: string; readonly question: string }[]
  readonly unansweredQuestion?: string
}

export type LeadSimulateResponse = {
  readonly replies: LeadSimulatedReply[]
  readonly state: LeadSimulatedState
  readonly insights: LeadSimulatorInsights
}

export type LeadAssistantLoadStatus = "idle" | "loading" | "ready" | "failed"

/** Project reduced to what the lead assistant needs. */
export type LeadAssistantProject = {
  readonly id: string
  readonly title: string
}

export type LeadTemplateRenderContext = {
  readonly firstName: string
  readonly assistantName: string
  readonly businessName: string
  readonly projectTitle: string
}
