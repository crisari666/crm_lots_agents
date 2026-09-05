export type WebinarEventStatus = "draft" | "active" | "closed"

export type WebinarLeadStatus = "registered" | "converted" | "discarded"

export type WebinarEvent = {
  readonly id: string
  readonly name: string
  readonly dayLabel: string
  readonly dateText: string
  readonly timeText: string
  readonly meetLink: string
  readonly googleCalendarEventId?: string
  readonly status: WebinarEventStatus
  readonly scheduledAt: string
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type WebinarLeadFieldDataRow = {
  name: string
  values: string[]
}

export type WebinarLead = {
  readonly id: string
  readonly name: string
  readonly lastName: string
  readonly email: string
  readonly phone: string
  readonly metaLeadgenId: string
  readonly formName?: string
  readonly mappedFields?: Record<string, string>
  readonly fieldData?: WebinarLeadFieldDataRow[]
  readonly platform?: string
  readonly campaignName?: string
  readonly webinarEventId?: string | null
  readonly customerId?: string | null
  readonly notificationSentAt?: string | null
  readonly whatsappMessageId?: string
  readonly notificationError?: string
  readonly status: WebinarLeadStatus
  readonly convertedCustomerId?: string | null
  readonly convertedAt?: string | null
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type CreateWebinarEventBody = {
  readonly name: string
  readonly scheduledAt: string
  readonly status?: WebinarEventStatus
}

export type CreateWebinarLeadBody = {
  readonly webinarEventId: string
  readonly name: string
  readonly lastName?: string
  readonly email?: string
  readonly phone: string
  readonly sendNotification?: boolean
}

export type ImportWebinarLeadItem = {
  readonly name: string
  readonly lastName?: string
  readonly email?: string
  readonly phone: string
}

export type ImportWebinarLeadsBody = {
  readonly webinarEventId: string
  readonly leads: readonly ImportWebinarLeadItem[]
  readonly sendNotification?: boolean
}

export type ImportWebinarLeadResultItem =
  | {
      readonly phone: string
      readonly status: "created"
      readonly leadId: string
      readonly notificationSent: boolean
    }
  | {
      readonly phone: string
      readonly status: "already_exists"
      readonly leadId: string
    }
  | {
      readonly phone: string
      readonly status: "error"
      readonly message: string
    }

export type ImportWebinarLeadsResponse = {
  readonly results: readonly ImportWebinarLeadResultItem[]
  readonly created: number
  readonly alreadyExists: number
  readonly errors: number
  readonly notificationsSent: number
}

export type UpdateWebinarEventBody = {
  readonly name?: string
  readonly status?: WebinarEventStatus
  readonly scheduledAt?: string
}

export type ListWebinarLeadsParams = {
  readonly webinarEventId?: string
  readonly status?: WebinarLeadStatus
  readonly phone?: string
  readonly page?: number
  readonly limit?: number
}

export type WebinarLeadsListResponse = {
  readonly items: WebinarLead[]
  readonly total: number
  readonly page: number
  readonly limit: number
}

export type WebinarEventFormState = {
  name: string
  status: WebinarEventStatus
  scheduledAt: string
}

export type WebinarLeadFormState = {
  name: string
  lastName: string
  email: string
  phone: string
}

export type WebinarEventsListFilter = "all" | WebinarEventStatus
