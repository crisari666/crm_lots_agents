import { Box, Button, CircularProgress, Stack, Tooltip, Typography } from "@mui/material"
import EventAvailableIcon from "@mui/icons-material/EventAvailable"
import { useAppSelector } from "../../../app/hooks"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import { selectJobCampaignState } from "../slice/job-campaign.slice"
import type { JobCampaignAdminItem } from "../types/job-campaign.types"
import { formatMeetDate, formatMeetTime } from "../utils/meet-schedule-format.util"

type Props = {
  readonly campaign: JobCampaignAdminItem
  readonly onAssign: () => void
}

const hasGroupMeet = (campaign: JobCampaignAdminItem): boolean =>
  campaign.meetScheduledAt != null &&
  campaign.googleMeetUrl.length > 0 &&
  campaign.meetTemplateName.trim().length > 0

/**
 * "Assign Meet" action: invites the selected candidate to the campaign group Meet (or the next
 * interview slot) and reports the result inline.
 */
export function JobCampaignAssignMeetCp(props: Props) {
  const status = useAppSelector((state) => selectJobCampaignState(state).assignInterviewStatus)
  const isGroupMeet = hasGroupMeet(props.campaign)
  const canAssign = isGroupMeet || props.campaign.availableInterviewCount > 0
  const isLoading = status === "loading"
  const meetIso = props.campaign.meetScheduledAt
  return (
    <Stack spacing={0.5} sx={{ width: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
        <Tooltip title={canAssign ? "" : s.assignMeetDisabledHint}>
          <Box component="span">
            <Button
              variant="contained"
              color="secondary"
              startIcon={
                isLoading ? <CircularProgress size={16} color="inherit" /> : <EventAvailableIcon />
              }
              disabled={!canAssign || isLoading}
              onClick={props.onAssign}
            >
              {s.assignInterview}
            </Button>
          </Box>
        </Tooltip>
        {isGroupMeet && meetIso != null ? (
          <Typography variant="body2" color="text.secondary">
            {s.campaignMeetLabel}: <strong>{formatMeetDate(meetIso)}</strong> ·{" "}
            {formatMeetTime(meetIso)}
          </Typography>
        ) : null}
      </Stack>
      <Box aria-live="polite">
        {status === "succeeded" ? (
          <Typography variant="caption" color="success.main">
            {s.assignInterviewSent}
          </Typography>
        ) : null}
        {status === "failed" ? (
          <Typography variant="caption" color="error">
            {s.assignInterviewError}
          </Typography>
        ) : null}
      </Box>
    </Stack>
  )
}
