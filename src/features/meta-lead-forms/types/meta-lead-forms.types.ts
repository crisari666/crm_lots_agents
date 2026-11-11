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

export type MetaLeadAdCampaignNestedAd = {
  readonly adId: string
  readonly adName: string
  readonly leadCount: number
}

export type MetaLeadAdCampaignItem = {
  readonly id: string
  readonly campaignId: string
  readonly campaignName: string
  readonly projectId: string
  readonly projectTitle: string
  readonly adId?: string
  readonly adName?: string
  readonly enabled: boolean
  readonly notes: string
  readonly createdByOfficeUserId?: string
  readonly createdAt?: string
  readonly updatedAt?: string
}

export type MetaLeadAdCampaignGroup = {
  readonly campaignId: string
  readonly campaignName: string
  readonly leadCount: number
  readonly ads: MetaLeadAdCampaignNestedAd[]
}

export type MetaLeadAdCampaignRegisteredStat = {
  readonly id: string
  readonly campaignId: string
  readonly campaignName: string
  readonly projectId: string
  readonly projectTitle: string
  readonly leadCount: number
  readonly ads: MetaLeadAdCampaignNestedAd[]
}

export type MetaLeadFormStatsResponse = {
  readonly registered: readonly MetaLeadFormRegisteredStat[]
  readonly unregisteredForms: readonly MetaLeadFormCampaignGroup[]
  readonly registeredCampaigns: readonly MetaLeadAdCampaignRegisteredStat[]
  readonly unregisteredCampaigns: readonly MetaLeadAdCampaignGroup[]
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

export type CreateMetaLeadAdCampaignBody = {
  readonly campaignId: string
  readonly campaignName: string
  readonly projectId: string
  readonly projectTitle?: string
  readonly adId?: string
  readonly adName?: string
  readonly enabled?: boolean
  readonly notes?: string
}

export type UpdateMetaLeadAdCampaignBody = {
  readonly campaignId?: string
  readonly campaignName?: string
  readonly projectId?: string
  readonly projectTitle?: string
  readonly adId?: string
  readonly adName?: string
  readonly enabled?: boolean
  readonly notes?: string
}
