import { Box, Button, Divider, Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import { buildRecruitingMediaUrl } from "../services/job-campaign-admin.service"
import {
  fetchJobCampaignCandidateThunk,
  rescoreJobCampaignCandidateThunk,
  selectJobCampaignState,
} from "../slice/job-campaign.slice"
import type { JobCampaignCandidateItem } from "../types/job-campaign.types"
import { JobCandidateCvAnalysisCp } from "./job-candidate-cv-analysis.cp"
import { JobCandidateVideoCp } from "./job-candidate-video.cp"

type Props = {
  readonly candidate: JobCampaignCandidateItem
}

const PENDING_REFRESH_INTERVAL_MS = 10000
const PENDING_MEDIA_STATUSES = new Set([
  "whatsapp_capturing",
  "data_complete",
  "interview_accepted",
  "awaiting_cv",
  "awaiting_video",
])

const isWaitingForScreeningData = (candidate: JobCampaignCandidateItem): boolean =>
  PENDING_MEDIA_STATUSES.has(candidate.status) ||
  (candidate.cvFile != null && candidate.cvAnalysis == null && candidate.hasCvText)

function CvEmptyState() {
  return (
    <Box sx={{ py: 3, px: 2, border: "1px dashed", borderColor: "divider", borderRadius: 1 }}>
      <Typography fontWeight={600}>{s.cvEmptyTitle}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
        {s.cvEmptyBody}
      </Typography>
    </Box>
  )
}

function CvAnalysisFallback(props: { readonly hasCvText: boolean }) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.hasCvText ? s.cvAnalysisPending : s.cvNoTextHint}
    </Typography>
  )
}

/** Reviewer view of a candidate: AI CV verdict, CV link, re-analyze and presentation video. */
export function JobCampaignCandidateProfileCp(props: Props) {
  const dispatch = useAppDispatch()
  const { rescoreStatus } = useAppSelector(selectJobCampaignState)
  const { candidate } = props
  const cvFile = candidate.cvFile
  const isRescoring = rescoreStatus === "loading"
  const shouldPoll = isWaitingForScreeningData(candidate)

  useEffect(() => {
    if (!shouldPoll) return
    const timer = window.setInterval(() => {
      void dispatch(
        fetchJobCampaignCandidateThunk({
          campaignId: candidate.campaignId,
          candidateId: candidate.id,
        }),
      )
    }, PENDING_REFRESH_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [dispatch, shouldPoll, candidate.campaignId, candidate.id])

  const handleRescore = (): void => {
    void dispatch(
      rescoreJobCampaignCandidateThunk({
        campaignId: candidate.campaignId,
        candidateId: candidate.id,
      }),
    )
  }

  return (
    <Box component="section" aria-label={s.profileTitle} sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          {s.profileTitle}
        </Typography>
        {cvFile != null ? (
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              href={buildRecruitingMediaUrl(cvFile.whatsappMessageId)}
              target="_blank"
              rel="noreferrer"
            >
              {s.viewCv}
            </Button>
            <Button
              size="small"
              onClick={handleRescore}
              disabled={isRescoring || !candidate.hasCvText}
            >
              {s.rescoreCv}
            </Button>
          </Stack>
        ) : null}
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {cvFile == null ? <CvEmptyState /> : null}
          {cvFile != null && candidate.cvAnalysis != null ? (
            <JobCandidateCvAnalysisCp analysis={candidate.cvAnalysis} />
          ) : null}
          {cvFile != null && candidate.cvAnalysis == null ? (
            <CvAnalysisFallback hasCvText={candidate.hasCvText} />
          ) : null}
        </Box>
        <JobCandidateVideoCp videoFile={candidate.videoFile} />
      </Stack>
    </Box>
  )
}
