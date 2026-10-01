import type { JobCampaignCaptureField } from "../../types/job-campaign.types"

export type JobCampaignSetupForm = {
  readonly name: string
  readonly description: string
  readonly activate: boolean
  readonly voiceAgentPrompt: string
  readonly whatsappAgentPrompt: string
  readonly whatsappTemplateName: string
  readonly whatsappTemplateLanguage: string
  readonly requirements: string
  readonly cvRequestMessage: string
  readonly videoRequestMessage: string
  readonly videoReceivedMessage: string
  readonly captureFields: readonly JobCampaignCaptureField[]
  /** ISO date-time, or null when the group Meet is not scheduled. */
  readonly meetScheduledAt: string | null
  readonly meetDurationMinutes: number
  readonly meetTemplateName: string
  readonly meetTemplateLanguage: string
  readonly salesDirectorEmail: string
}

export type JobCampaignSetupFormPatch = Partial<JobCampaignSetupForm>

export type JobCampaignSetupStepId =
  | "general"
  | "agents"
  | "screening"
  | "captureFields"
  | "meet"

export type JobCampaignSetupErrors = Partial<
  Record<keyof JobCampaignSetupForm, string>
>

/** Payload emitted on submit; `meetScheduledAt: ""` clears the Meet date. */
export type SetupSubmitPayload = Omit<
  JobCampaignSetupForm,
  "activate" | "meetScheduledAt"
> & {
  readonly meetScheduledAt: string
}

export type JobCampaignSetupStepProps = {
  readonly form: JobCampaignSetupForm
  readonly errors: JobCampaignSetupErrors
  readonly onChange: (patch: JobCampaignSetupFormPatch) => void
}
