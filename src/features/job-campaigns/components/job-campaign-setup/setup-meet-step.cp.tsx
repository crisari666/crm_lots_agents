import { Alert, Box, Stack, TextField, Typography } from "@mui/material"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment, { type Moment } from "moment"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import {
  DEFAULT_MEET_TEMPLATE_LANGUAGE,
  MIN_MEET_DURATION_MINUTES,
} from "../../utils/job-campaign-defaults"
import type { JobCampaignSetupStepProps } from "./job-campaign-setup.types"
import { MeetLinkFieldCp } from "./meet-link-field.cp"
import { MeetTemplatePreviewCp } from "./meet-template-preview.cp"

type Props = JobCampaignSetupStepProps & {
  /** Saved Meet link of the campaign (empty until the calendar event exists). */
  readonly googleMeetUrl: string
  /** The campaign already has a Meet date stored (a missing link then means creation failed). */
  readonly hasSavedMeetDate: boolean
}

const toPickerValue = (iso: string | null): Moment | null =>
  iso != null ? moment(iso) : null

export function SetupMeetStepCp(props: Props) {
  const { form, errors } = props
  const handleDateChange = (value: Moment | null): void => {
    props.onChange({
      meetScheduledAt: value != null && value.isValid() ? value.toISOString() : null,
    })
  }
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={4} alignItems="flex-start">
      <Stack spacing={2.5} sx={{ flex: 1, width: "100%" }}>
        <Typography variant="caption" color="text.secondary">
          {s.meetHint}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <DateTimePicker
            label={s.fieldMeetScheduledAt}
            value={toPickerValue(form.meetScheduledAt)}
            onChange={handleDateChange}
            disablePast
            sx={{ flex: 2 }}
            slotProps={{
              textField: {
                error: errors.meetScheduledAt != null,
                helperText: errors.meetScheduledAt ?? s.meetTimezoneHint,
              },
              actionBar: { actions: ["clear", "accept"] },
            }}
          />
          <TextField
            label={s.fieldMeetDuration}
            type="number"
            value={form.meetDurationMinutes}
            onChange={(e) =>
              props.onChange({ meetDurationMinutes: Number(e.target.value) || 0 })
            }
            error={errors.meetDurationMinutes != null}
            helperText={errors.meetDurationMinutes}
            inputProps={{ min: MIN_MEET_DURATION_MINUTES, step: MIN_MEET_DURATION_MINUTES }}
            sx={{ flex: 1 }}
          />
        </Stack>
        <TextField
          label={s.fieldSalesDirectorEmail}
          type="email"
          value={form.salesDirectorEmail}
          onChange={(e) => props.onChange({ salesDirectorEmail: e.target.value })}
          error={errors.salesDirectorEmail != null}
          helperText={errors.salesDirectorEmail ?? s.salesDirectorHint}
          fullWidth
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label={s.fieldMeetTemplateName}
            value={form.meetTemplateName}
            onChange={(e) => props.onChange({ meetTemplateName: e.target.value })}
            error={errors.meetTemplateName != null}
            helperText={errors.meetTemplateName}
            sx={{ flex: 2 }}
          />
          <TextField
            label={s.fieldMeetTemplateLanguage}
            value={form.meetTemplateLanguage}
            onChange={(e) => props.onChange({ meetTemplateLanguage: e.target.value })}
            placeholder={DEFAULT_MEET_TEMPLATE_LANGUAGE}
            sx={{ flex: 1 }}
          />
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {s.meetTemplateHint}
        </Typography>
        {props.googleMeetUrl.length > 0 ? (
          <MeetLinkFieldCp url={props.googleMeetUrl} />
        ) : props.hasSavedMeetDate ? (
          <Alert severity="warning" variant="outlined">
            {s.meetLinkFailed}
          </Alert>
        ) : form.meetScheduledAt != null ? (
          <Alert severity="info" variant="outlined">
            {s.meetLinkPending}
          </Alert>
        ) : null}
      </Stack>
      <Box sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0 }}>
        <MeetTemplatePreviewCp scheduledAt={form.meetScheduledAt} />
      </Box>
    </Stack>
  )
}
