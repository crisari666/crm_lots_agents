import { Chip, type ChipProps } from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignCandidateItem } from "../types/job-campaign.types"

const EXCELLENT_SCORE = 80
const GOOD_SCORE = 60
const PARTIAL_SCORE = 40

export function resolveScoreColor(score: number): ChipProps["color"] {
  if (score >= EXCELLENT_SCORE) return "success"
  if (score >= GOOD_SCORE) return "info"
  if (score >= PARTIAL_SCORE) return "warning"
  return "error"
}

type Props = {
  readonly candidate: JobCampaignCandidateItem
}

/** Compact AI score badge; hidden until the candidate has sent a CV. */
export function JobCandidateScoreChipCp(props: Props) {
  const analysis = props.candidate.cvAnalysis
  if (analysis != null) {
    return (
      <Chip
        size="small"
        color={resolveScoreColor(analysis.score)}
        label={`${analysis.score}`}
        title={s.scoreLabel}
        sx={{ fontWeight: 700, minWidth: 44 }}
      />
    )
  }
  if (props.candidate.cvFile == null) return null
  return <Chip size="small" variant="outlined" label={s.scorePending} />
}
