import { Box, Stack, Typography } from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type {
  JobCampaignCandidateContactChannel,
  JobCampaignCandidateFacebookLead,
  JobCampaignCandidateFormAnswer,
} from "../types/job-campaign.types"

type Props = {
  readonly facebookLead: JobCampaignCandidateFacebookLead | null
  readonly preferredContactChannel: JobCampaignCandidateContactChannel
}

const CONTACT_CHANNEL_LABELS: Record<Exclude<JobCampaignCandidateContactChannel, "">, string> = {
  call: s.preferredContactCall,
  whatsapp: s.preferredContactWhatsapp,
  email: s.preferredContactEmail,
}

const CONTACT_FIELD_PATTERN = /email|correo|phone|tel[eé]fono|nombre/i

const isScreeningAnswer = (answer: JobCampaignCandidateFormAnswer): boolean =>
  !CONTACT_FIELD_PATTERN.test(answer.fieldName)

function resolvePlatformLabel(platform: string): string {
  const normalized = platform.trim().toLowerCase()
  if (normalized === "ig" || normalized === "instagram") return s.facebookLeadPlatformInstagram
  if (normalized === "fb" || normalized === "facebook") return s.facebookLeadPlatformFacebook
  return platform
}

function formatLeadDate(raw: string): string {
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString()
}

function buildMetaLine(lead: JobCampaignCandidateFacebookLead): string {
  return [
    resolvePlatformLabel(lead.platform),
    formatLeadDate(lead.leadCreatedAt || lead.receivedAt),
    lead.campaignName.length > 0 ? `${s.facebookLeadCampaign}: ${lead.campaignName}` : "",
  ]
    .filter((part) => part.length > 0)
    .join(" · ")
}

/** Screening answers the candidate submitted in the Meta Lead Ads form. */
export function JobCandidateFacebookLeadCp(props: Props) {
  const { facebookLead, preferredContactChannel } = props
  if (facebookLead == null) return null
  const answers = facebookLead.answers.filter(isScreeningAnswer)
  if (answers.length === 0) return null
  const channelLabel =
    preferredContactChannel !== "" ? CONTACT_CHANNEL_LABELS[preferredContactChannel] : null
  return (
    <Box component="section" aria-label={s.facebookLeadTitle} sx={{ mt: 3 }}>
      <Typography variant="subtitle2" fontWeight={700}>
        {s.facebookLeadTitle}
        {facebookLead.formName.length > 0 ? (
          <Typography component="span" variant="subtitle2" color="text.secondary" fontWeight={400}>
            {` · ${facebookLead.formName}`}
          </Typography>
        ) : null}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {buildMetaLine(facebookLead)}
      </Typography>
      {channelLabel != null ? (
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Typography component="span" variant="body2" color="text.secondary">
            {`${s.preferredContactLabel}: `}
          </Typography>
          <Typography component="span" variant="body2" fontWeight={600}>
            {channelLabel}
          </Typography>
        </Typography>
      ) : null}
      <Stack component="dl" spacing={1.5} sx={{ m: 0, mt: 1.5 }}>
        {answers.map((answer) => (
          <Box
            key={answer.fieldName}
            sx={{ pl: 1.5, borderLeft: "2px solid", borderColor: "divider" }}
          >
            <Typography component="dt" variant="body2" color="text.secondary">
              {answer.question}
            </Typography>
            <Typography component="dd" variant="body2" fontWeight={500} sx={{ m: 0 }}>
              {answer.answer}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
