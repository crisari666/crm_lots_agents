export type JobCampaignCaptureField = {
  readonly key: string
  readonly label: string
  readonly required: boolean
  readonly order: number
}

export type JobCampaignAdminItem = {
  id: string
  name: string
  description: string
  enabled: boolean
  isActive: boolean
  voiceAgentPrompt: string
  whatsappAgentPrompt: string
  captureFields: JobCampaignCaptureField[]
  whatsappTemplateName: string
  whatsappTemplateLanguage: string
  requirements: string
  cvRequestMessage: string
  videoRequestMessage: string
  videoReceivedMessage: string
  meetScheduledAt: string | null
  meetDurationMinutes: number
  meetTemplateName: string
  meetTemplateLanguage: string
  salesDirectorEmail: string
  googleMeetUrl: string
  candidateCount: number
  availableInterviewCount: number
  createdAt: string
  updatedAt: string
}

export type JobCampaignCandidateMediaFile = {
  whatsappMessageId: string
  mimeType: string
  filename: string
  receivedAt: string
}

export type JobCampaignCandidateCvAnalysis = {
  score: number
  summary: string
  strengths: string[]
  gaps: string[]
  yearsExperience: number | null
  analyzedAt: string
}

export type JobCampaignCandidateFormAnswer = {
  fieldName: string
  question: string
  answer: string
}

export type JobCampaignCandidateContactChannel = "call" | "whatsapp" | "email" | ""

export type JobCampaignCandidateFacebookLead = {
  leadgenId: string
  pageId: string
  formId: string
  formName: string
  adId: string
  campaignName: string
  platform: string
  leadCreatedAt: string
  answers: JobCampaignCandidateFormAnswer[]
  receivedAt: string
}

export type JobCampaignCandidateSort = "recent" | "score"

export type JobCampaignCandidateRemoval = {
  removed: true
  candidateId: string
}

export type JobCampaignCandidateItem = {
  id: string
  campaignId: string
  name: string
  lastName: string
  email: string
  phone: string
  status: string
  capturedData: Record<string, string>
  conversationLog: Array<{
    role: string
    text: string
    at: string
  }>
  voiceFlowId: string | null
  interviewId: string | null
  googleMeetUrl: string | null
  promotedUserId: string | null
  sourceExternalId: string | null
  cvFile: JobCampaignCandidateMediaFile | null
  hasCvText: boolean
  cvAnalysis: JobCampaignCandidateCvAnalysis | null
  videoFile: JobCampaignCandidateMediaFile | null
  facebookLead: JobCampaignCandidateFacebookLead | null
  preferredContactChannel: JobCampaignCandidateContactChannel
  createdAt: string
  updatedAt: string
}

export type JobCampaignInterviewItem = {
  id: string
  campaignId: string
  scheduledAt: string
  googleMeetUrl: string
  googleCalendarEventId: string
  status: string
  assignedCandidateId: string | null
  title: string
  isNext: boolean
  createdAt: string
}

export type CreateJobCampaignBody = {
  readonly name: string
  readonly description?: string
  readonly voiceAgentPrompt?: string
  readonly whatsappAgentPrompt?: string
  readonly captureFields?: readonly JobCampaignCaptureField[]
  readonly whatsappTemplateName?: string
  readonly whatsappTemplateLanguage?: string
  readonly requirements?: string
  readonly cvRequestMessage?: string
  readonly videoRequestMessage?: string
  readonly videoReceivedMessage?: string
  readonly activate?: boolean
} & JobCampaignMeetBody

/** Group Meet settings; `meetScheduledAt: ""` clears the date. */
export type JobCampaignMeetBody = {
  readonly meetScheduledAt?: string
  readonly meetDurationMinutes?: number
  readonly meetTemplateName?: string
  readonly meetTemplateLanguage?: string
  readonly salesDirectorEmail?: string
}

export type UpdateJobCampaignBody = {
  readonly name?: string
  readonly description?: string
  readonly enabled?: boolean
  readonly voiceAgentPrompt?: string
  readonly whatsappAgentPrompt?: string
  readonly captureFields?: readonly JobCampaignCaptureField[]
  readonly whatsappTemplateName?: string
  readonly whatsappTemplateLanguage?: string
  readonly requirements?: string
  readonly cvRequestMessage?: string
  readonly videoRequestMessage?: string
  readonly videoReceivedMessage?: string
} & JobCampaignMeetBody

export type CreateJobCampaignInterviewBody = {
  readonly scheduledAt: string
  readonly title?: string
  readonly durationMinutes?: number
}

export type CreateJobCampaignCandidateBody = {
  readonly name: string
  readonly phone: string
  readonly email?: string
  readonly startVoice?: boolean
}

export type UpdateJobCampaignCandidateBody = {
  readonly name?: string
  readonly phone?: string
  readonly email?: string
}
