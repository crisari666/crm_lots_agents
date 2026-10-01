import { Box, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import { formatMeetDate, formatMeetTime } from "../../utils/meet-schedule-format.util"

type Props = {
  readonly scheduledAt: string | null
}

/** WhatsApp-like rendering of the Meet template with sample name and the chosen date/time. */
export function MeetTemplatePreviewCp(props: Props) {
  const date = props.scheduledAt != null ? formatMeetDate(props.scheduledAt) : "—"
  const time = props.scheduledAt != null ? formatMeetTime(props.scheduledAt) : "—"
  return (
    <Box component="figure" sx={{ m: 0 }} aria-label={s.meetPreviewTitle}>
      <Typography
        component="figcaption"
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", mb: 1, letterSpacing: 1 }}
      >
        {s.meetPreviewTitle}
      </Typography>
      <Box
        sx={(theme) => ({
          p: 2,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.06),
          border: "1px solid",
          borderColor: alpha(theme.palette.success.main, 0.2),
        })}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "4px 12px 12px 12px",
            boxShadow: 1,
            maxWidth: 360,
            overflow: "hidden",
          }}
        >
          <Stack spacing={1} sx={{ p: 1.5 }}>
            <Typography variant="body2">
              {s.meetPreviewGreeting} <strong>{s.meetPreviewSampleName}</strong> 👋
            </Typography>
            {s.meetPreviewLines.map((line) => (
              <Typography key={line} variant="body2">
                {line}
              </Typography>
            ))}
            <Box>
              <Typography variant="body2" fontWeight={600}>
                📅 {date}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                🕐 {time}
              </Typography>
            </Box>
            <Typography variant="body2">{s.meetPreviewClosing}</Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={0.75}
            justifyContent="center"
            alignItems="center"
            sx={{
              py: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              color: "info.main",
            }}
          >
            <OpenInNewIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={600}>
              {s.meetPreviewButton}
            </Typography>
          </Stack>
        </Box>
        {props.scheduledAt == null ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
            {s.meetPreviewNoDate}
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}
