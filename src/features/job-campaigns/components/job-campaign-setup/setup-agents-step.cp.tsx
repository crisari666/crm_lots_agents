import { Stack, TextField } from "@mui/material"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import { DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE } from "../../utils/job-campaign-defaults"
import type { JobCampaignSetupStepProps } from "./job-campaign-setup.types"

export function SetupAgentsStepCp(props: JobCampaignSetupStepProps) {
  return (
    <Stack spacing={2.5}>
      <TextField
        label={s.fieldVoicePrompt}
        value={props.form.voiceAgentPrompt}
        onChange={(e) => props.onChange({ voiceAgentPrompt: e.target.value })}
        fullWidth
        multiline
        minRows={4}
        maxRows={10}
      />
      <TextField
        label={s.fieldWhatsappPrompt}
        value={props.form.whatsappAgentPrompt}
        onChange={(e) => props.onChange({ whatsappAgentPrompt: e.target.value })}
        fullWidth
        multiline
        minRows={6}
        maxRows={14}
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label={s.fieldWhatsappTemplateName}
          value={props.form.whatsappTemplateName}
          onChange={(e) => props.onChange({ whatsappTemplateName: e.target.value })}
          helperText={s.whatsappTemplateHint}
          sx={{ flex: 2 }}
        />
        <TextField
          label={s.fieldWhatsappTemplateLanguage}
          value={props.form.whatsappTemplateLanguage}
          onChange={(e) =>
            props.onChange({ whatsappTemplateLanguage: e.target.value })
          }
          placeholder={DEFAULT_WHATSAPP_OPENING_TEMPLATE_LANGUAGE}
          sx={{ flex: 1 }}
        />
      </Stack>
    </Stack>
  )
}
