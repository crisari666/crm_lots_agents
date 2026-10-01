import { Checkbox, FormControlLabel, Stack, TextField } from "@mui/material"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignSetupStepProps } from "./job-campaign-setup.types"

type Props = JobCampaignSetupStepProps & {
  readonly showActivate: boolean
}

export function SetupGeneralStepCp(props: Props) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label={s.fieldName}
        value={props.form.name}
        onChange={(e) => props.onChange({ name: e.target.value })}
        error={props.errors.name != null}
        helperText={props.errors.name}
        fullWidth
        required
        autoFocus
      />
      <TextField
        label={s.fieldDescription}
        value={props.form.description}
        onChange={(e) => props.onChange({ description: e.target.value })}
        fullWidth
        multiline
        minRows={3}
      />
      {props.showActivate ? (
        <FormControlLabel
          control={
            <Checkbox
              checked={props.form.activate}
              onChange={(e) => props.onChange({ activate: e.target.checked })}
            />
          }
          label={s.activateOnCreate}
        />
      ) : null}
    </Stack>
  )
}
