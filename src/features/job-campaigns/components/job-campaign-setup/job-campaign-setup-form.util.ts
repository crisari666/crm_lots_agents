import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignAdminItem } from "../../types/job-campaign.types"
import {
  DEFAULT_CV_REQUEST_MESSAGE,
  DEFAULT_JOB_CAMPAIGN_CAPTURE_FIELDS,
  DEFAULT_JOB_CAMPAIGN_REQUIREMENTS,
  DEFAULT_MEET_DURATION_MINUTES,
  DEFAULT_MEET_TEMPLATE_LANGUAGE,
  DEFAULT_VIDEO_RECEIVED_MESSAGE,
  DEFAULT_VIDEO_REQUEST_MESSAGE,
  DEFAULT_VOICE_RECRUITING_AGENT_PROMPT,
  DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
  DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
  DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT,
  MIN_MEET_DURATION_MINUTES,
} from "../../utils/job-campaign-defaults"
import type {
  JobCampaignSetupErrors,
  JobCampaignSetupForm,
  JobCampaignSetupStepId,
  SetupSubmitPayload,
} from "./job-campaign-setup.types"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const JOB_CAMPAIGN_SETUP_STEPS: ReadonlyArray<{
  readonly id: JobCampaignSetupStepId
  readonly label: string
  readonly hint: string
  readonly fields: ReadonlyArray<keyof JobCampaignSetupForm>
}> = [
  { id: "general", label: s.stepGeneral, hint: s.stepGeneralHint, fields: ["name"] },
  { id: "agents", label: s.stepAgents, hint: s.stepAgentsHint, fields: [] },
  { id: "screening", label: s.stepScreening, hint: s.stepScreeningHint, fields: [] },
  {
    id: "captureFields",
    label: s.stepCaptureFields,
    hint: s.stepCaptureFieldsHint,
    fields: ["captureFields"],
  },
  {
    id: "meet",
    label: s.stepMeet,
    hint: s.stepMeetHint,
    fields: [
      "meetScheduledAt",
      "meetDurationMinutes",
      "meetTemplateName",
      "salesDirectorEmail",
    ],
  },
]

const pickText = (value: string | undefined, fallback: string): string =>
  value != null && value.trim().length > 0 ? value : fallback

/** Initial form: the campaign in edit mode, defaults seeded from the newest campaign on create. */
export function buildInitialSetupForm(input: {
  readonly mode: "create" | "edit"
  readonly campaign: JobCampaignAdminItem | null
  readonly lastCampaign: JobCampaignAdminItem | null
}): JobCampaignSetupForm {
  const isEdit = input.mode === "edit" && input.campaign != null
  const source = isEdit ? input.campaign : input.lastCampaign
  return {
    name: isEdit ? source?.name ?? "" : "",
    description: isEdit ? source?.description ?? "" : "",
    activate: false,
    voiceAgentPrompt: isEdit
      ? pickText(source?.voiceAgentPrompt, DEFAULT_VOICE_RECRUITING_AGENT_PROMPT)
      : DEFAULT_VOICE_RECRUITING_AGENT_PROMPT,
    whatsappAgentPrompt: isEdit
      ? pickText(source?.whatsappAgentPrompt, DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT)
      : DEFAULT_WHATSAPP_RECRUITING_AGENT_PROMPT,
    whatsappTemplateName: pickText(
      source?.whatsappTemplateName,
      DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
    ),
    whatsappTemplateLanguage: pickText(
      source?.whatsappTemplateLanguage,
      DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
    ),
    requirements: pickText(
      source?.requirements,
      isEdit ? "" : DEFAULT_JOB_CAMPAIGN_REQUIREMENTS,
    ),
    cvRequestMessage: pickText(source?.cvRequestMessage, DEFAULT_CV_REQUEST_MESSAGE),
    videoRequestMessage: pickText(
      source?.videoRequestMessage,
      DEFAULT_VIDEO_REQUEST_MESSAGE,
    ),
    videoReceivedMessage: pickText(
      source?.videoReceivedMessage,
      DEFAULT_VIDEO_RECEIVED_MESSAGE,
    ),
    captureFields: isEdit
      ? [...(source?.captureFields ?? [])]
      : [...DEFAULT_JOB_CAMPAIGN_CAPTURE_FIELDS],
    meetScheduledAt: isEdit ? source?.meetScheduledAt ?? null : null,
    meetDurationMinutes: source?.meetDurationMinutes ?? DEFAULT_MEET_DURATION_MINUTES,
    meetTemplateName: source?.meetTemplateName ?? "",
    meetTemplateLanguage: pickText(
      source?.meetTemplateLanguage,
      DEFAULT_MEET_TEMPLATE_LANGUAGE,
    ),
    salesDirectorEmail: source?.salesDirectorEmail ?? "",
  }
}

const hasUniqueCaptureKeys = (form: JobCampaignSetupForm): boolean => {
  const keys = form.captureFields.map((field) => field.key.trim())
  return keys.every((key) => key.length > 0) && new Set(keys).size === keys.length
}

function validateMeet(form: JobCampaignSetupForm): JobCampaignSetupErrors {
  const email = form.salesDirectorEmail.trim()
  const hasTemplate = form.meetTemplateName.trim().length > 0
  return {
    ...(form.meetDurationMinutes < MIN_MEET_DURATION_MINUTES
      ? { meetDurationMinutes: s.errorMeetDuration }
      : {}),
    ...(email.length > 0 && !EMAIL_PATTERN.test(email)
      ? { salesDirectorEmail: s.errorEmailInvalid }
      : {}),
    ...(form.meetScheduledAt != null && !hasTemplate
      ? { meetTemplateName: s.errorMeetTemplateRequired }
      : {}),
    ...(form.meetScheduledAt == null && hasTemplate
      ? { meetScheduledAt: s.errorMeetDateRequired }
      : {}),
  }
}

export function validateSetupForm(form: JobCampaignSetupForm): JobCampaignSetupErrors {
  return {
    ...(form.name.trim().length === 0 ? { name: s.errorNameRequired } : {}),
    ...(hasUniqueCaptureKeys(form) ? {} : { captureFields: s.errorCaptureKeys }),
    ...validateMeet(form),
  }
}

export const isStepInvalid = (
  stepId: JobCampaignSetupStepId,
  errors: JobCampaignSetupErrors,
): boolean =>
  (JOB_CAMPAIGN_SETUP_STEPS.find((step) => step.id === stepId)?.fields ?? []).some(
    (field) => errors[field] != null,
  )

export function toSetupSubmitPayload(form: JobCampaignSetupForm): SetupSubmitPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    voiceAgentPrompt: form.voiceAgentPrompt,
    whatsappAgentPrompt: form.whatsappAgentPrompt,
    whatsappTemplateName: pickText(
      form.whatsappTemplateName.trim(),
      DEFAULT_WHATSAPP_OPENING_TEMPLATE_NAME,
    ),
    whatsappTemplateLanguage: pickText(
      form.whatsappTemplateLanguage.trim(),
      DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE,
    ),
    requirements: form.requirements.trim(),
    cvRequestMessage: form.cvRequestMessage.trim(),
    videoRequestMessage: form.videoRequestMessage.trim(),
    videoReceivedMessage: form.videoReceivedMessage.trim(),
    captureFields: form.captureFields.map((field, index) => ({
      ...field,
      key: field.key.trim(),
      label: field.label.trim(),
      order: index,
    })),
    meetScheduledAt: form.meetScheduledAt ?? "",
    meetDurationMinutes: form.meetDurationMinutes,
    meetTemplateName: form.meetTemplateName.trim(),
    meetTemplateLanguage: pickText(
      form.meetTemplateLanguage.trim(),
      DEFAULT_MEET_TEMPLATE_LANGUAGE,
    ),
    salesDirectorEmail: form.salesDirectorEmail.trim().toLowerCase(),
  }
}
