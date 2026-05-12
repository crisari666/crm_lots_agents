export type CeoOperationsSummaryResult = {
  range: { fromIso: string; toIso: string }
  metaLeadsTotal: number
  metaLeadsDistinctUserTotal: number
  usersCreatedInRangeTotal: number
  activeVentorsTotal: number
  contractsSentTotal: number
  contractsSignedTotal: number
  trainingAttendeesTotal: number
}

export type CeoLeadResumeByFormItem = {
  formName: string
  totalLeads: number
}

export type CeoLeadResumeByDayItem = {
  day: string
  totalLeads: number
  answeredCallsTotal: number
  voicemailTotal: number
  acceptedTrainingTotal: number
}

export type CeoLeadResumeDetailItem = {
  leadCandidateId: string
  leadName: string
  phone: string
  email: string
  day: string
  answeredCall: boolean
  voicemail: boolean
  acceptedTraining: boolean
}

export type CeoLeadResumeTotals = {
  totalLeads: number
  answeredCallsTotal: number
  voicemailTotal: number
  acceptedTrainingTotal: number
}

export type CeoLeadResumeResult = {
  range: { fromIso: string; toIso: string }
  includeDetails: boolean
  totals: CeoLeadResumeTotals
  byFormName: CeoLeadResumeByFormItem[]
  byDay: CeoLeadResumeByDayItem[]
  details: CeoLeadResumeDetailItem[]
}
