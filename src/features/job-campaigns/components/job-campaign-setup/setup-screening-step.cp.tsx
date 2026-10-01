import { Stack, TextField } from "@mui/material"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import type {
  JobCampaignSetupForm,
  JobCampaignSetupStepProps,
} from "./job-campaign-setup.types"

type ScreeningMessageKey = keyof Pick<
  JobCampaignSetupForm,
  "cvRequestMessage" | "videoRequestMessage" | "videoReceivedMessage"
>

const SCREENING_MESSAGES: ReadonlyArray<{
  readonly key: ScreeningMessageKey
  readonly label: string
}> = [
  { key: "cvRequestMessage", label: s.fieldCvRequestMessage },
  { key: "videoRequestMessage", label: s.fieldVideoRequestMessage },
  { key: "videoReceivedMessage", label: s.fieldVideoReceivedMessage },
]

export function SetupScreeningStepCp(props: JobCampaignSetupStepProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label={s.fieldRequirements}
        value={props.form.requirements}
        onChange={(e) => props.onChange({ requirements: e.target.value })}
        helperText={s.requirementsHint}
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
      />
      {SCREENING_MESSAGES.map((message) => (
        <TextField
          key={message.key}
          label={message.label}
          value={props.form[message.key]}
          onChange={(e) => props.onChange({ [message.key]: e.target.value })}
          fullWidth
          multiline
          minRows={2}
        />
      ))}
    </Stack>
  )
}
