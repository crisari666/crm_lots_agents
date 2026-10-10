import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignCandidateStatus } from "../types/job-campaign.types"

export type CandidateStep = {
  readonly status: JobCampaignCandidateStatus
  readonly label: string
}

/** Recruiting funnel steps in the order a candidate goes through them. */
export const CANDIDATE_STEPS: readonly CandidateStep[] = [
  { status: "arrived", label: s.stepArrived },
  { status: "voice_queued", label: s.stepVoiceQueued },
  { status: "voice_completed", label: s.stepVoiceCompleted },
  { status: "voice_declined", label: s.stepVoiceDeclined },
  { status: "whatsapp_capturing", label: s.stepWhatsappCapturing },
  { status: "data_complete", label: s.stepDataComplete },
  { status: "awaiting_cv", label: s.stepAwaitingCv },
  { status: "awaiting_video", label: s.stepAwaitingVideo },
  { status: "video_received", label: s.stepVideoReceived },
  { status: "interview_accepted", label: s.stepInterviewAccepted },
  { status: "interview_scheduled", label: s.stepInterviewScheduled },
  { status: "selected", label: s.stepSelected },
  { status: "rejected", label: s.stepRejected },
  { status: "discarded", label: s.stepDiscarded },
]

const STEP_LABELS: ReadonlyMap<string, string> = new Map(
  CANDIDATE_STEPS.map((step) => [step.status, step.label]),
)

/** Spanish label of a candidate status; unknown statuses are shown raw. */
export const getCandidateStepLabel = (status: string): string =>
  STEP_LABELS.get(status) ?? status
