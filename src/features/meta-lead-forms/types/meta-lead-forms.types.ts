export type MetaLeadFormFlowStrategy = "immediate_assign" | "lead_conversation"

export type MetaLeadFormItem = {
  readonly id: string
  readonly formId: string
  readonly formName: string
  readonly flowStrategy: MetaLeadFormFlowStrategy
  readonly enabled: boolean
  readonly notes: string
  readonly createdByOfficeUserId?: string
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type MetaLeadFormSettings = {
  readonly outboundDelayMinutes: number
}

export type MetaLeadFormCampaignGroup = {
  readonly formId: string
  readonly formName: string
  readonly leadCount: number
}

export type MetaLeadFormRegisteredStat = {
  readonly id: string
  readonly formId: string
  readonly formName: string
  readonly leadCount: number
}

export type MetaLeadFormStatsResponse = {
  readonly registered: readonly MetaLeadFormRegisteredStat[]
  readonly unregisteredForms: readonly MetaLeadFormCampaignGroup[]
}

export type CreateMetaLeadFormBody = {
  readonly formId: string
  readonly formName: string
  readonly flowStrategy: MetaLeadFormFlowStrategy
  readonly enabled?: boolean
  readonly notes?: string
}

export type UpdateMetaLeadFormBody = {
  readonly formId?: string
  readonly formName?: string
  readonly flowStrategy?: MetaLeadFormFlowStrategy
  readonly enabled?: boolean
  readonly notes?: string
}
