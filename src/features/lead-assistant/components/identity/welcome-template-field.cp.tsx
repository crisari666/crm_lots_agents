import { Box, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { renderTemplatePreview } from "../../business-logic/render-template-preview"
import { usePreviewContext } from "../../hooks/use-preview-context"
import { patchDraftAct } from "../../slice/lead-assistant-settings.slice"
import TemplatePickerCP from "../shared/template-picker.cp"
import TemplateVariableMappingCP from "../shared/template-variable-mapping.cp"

/** Welcome template chosen from the approved list, with its variable mapping. */
export default function WelcomeTemplateFieldCP() {
  const dispatch = useAppDispatch()
  const template = useAppSelector((state) => state.leadAssistant.settings.draft?.welcomeTemplate ?? null)
  const context = usePreviewContext()
  return (
    <Stack spacing={1.5}>
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {s.welcomeTemplateTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {s.welcomeTemplateHelper}
        </Typography>
      </Box>
      <TemplatePickerCP
        id="lead-assistant-welcome-template"
        label={s.welcomeTemplateLabel}
        value={template}
        onChange={(next) => dispatch(patchDraftAct({ welcomeTemplate: next }))}
      />
      {template != null ? (
        <>
          <TemplateVariableMappingCP
            idPrefix="lead-assistant-welcome"
            value={template}
            onChange={(next) => dispatch(patchDraftAct({ welcomeTemplate: next }))}
          />
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {s.templateRenderedLabel}: {renderTemplatePreview(template, context)}
          </Typography>
        </>
      ) : null}
    </Stack>
  )
}
