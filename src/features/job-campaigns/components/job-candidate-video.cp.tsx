import { Box, Typography } from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import { buildRecruitingMediaUrl } from "../services/job-campaign-admin.service"
import type { JobCampaignCandidateMediaFile } from "../types/job-campaign.types"

type Props = {
  readonly videoFile: JobCampaignCandidateMediaFile | null
}

/** Presentation video player (or waiting placeholder). */
export function JobCandidateVideoCp(props: Props) {
  return (
    <Box sx={{ width: { xs: "100%", md: 280 }, flexShrink: 0 }}>
      <Typography variant="overline" color="text.secondary">
        {s.videoTitle}
      </Typography>
      {props.videoFile != null ? (
        <Box
          component="video"
          controls
          preload="metadata"
          src={buildRecruitingMediaUrl(props.videoFile.whatsappMessageId)}
          sx={{
            display: "block",
            width: "100%",
            aspectRatio: "9 / 16",
            maxHeight: 420,
            bgcolor: "common.black",
            borderRadius: 1,
            objectFit: "contain",
          }}
        />
      ) : (
        <Box
          sx={{
            minHeight: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {s.videoPending}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
