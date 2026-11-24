import { Box, Skeleton, Stack, TextField, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { validateIdentityDraft } from "../../business-logic/lead-assistant-validation"
import { patchDraftAct, touchFieldAct } from "../../slice/lead-assistant-settings.slice"
import GreetingEditorCP from "./greeting-editor.cp"
import PricePolicyCardsCP from "./price-policy-cards.cp"
import WelcomeTemplateFieldCP from "./welcome-template-field.cp"

/** Step 2: assistant identity (names, greeting, price policy, welcome template). */
export default function IdentityStepCP() {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.leadAssistant.settings.draft)
  const touched = useAppSelector((state) => state.leadAssistant.settings.touched)
  if (draft == null) {
    return (
      <Stack spacing={2} aria-busy="true">
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={56} />
        <Skeleton variant="rounded" height={96} />
      </Stack>
    )
  }
  const errors = validateIdentityDraft(draft, s.identityValidation)
  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h5" component="h2" fontWeight={700}>
          {s.stepTitles.identity}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
          {s.identityIntro}
        </Typography>
      </Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          id="lead-assistant-name"
          label={s.identityAssistantName}
          value={draft.assistantName}
          onChange={(event) => dispatch(patchDraftAct({ assistantName: event.target.value }))}
          onBlur={() => dispatch(touchFieldAct("assistantName"))}
          error={touched.assistantName === true && errors.assistantName != null}
          helperText={touched.assistantName === true ? errors.assistantName : undefined}
          fullWidth
          required
        />
        <TextField
          id="lead-assistant-business"
          label={s.identityBusinessName}
          value={draft.businessName}
          onChange={(event) => dispatch(patchDraftAct({ businessName: event.target.value }))}
          onBlur={() => dispatch(touchFieldAct("businessName"))}
          error={touched.businessName === true && errors.businessName != null}
          helperText={touched.businessName === true ? errors.businessName : undefined}
          fullWidth
          required
        />
      </Stack>
      <GreetingEditorCP />
      <PricePolicyCardsCP />
      <WelcomeTemplateFieldCP />
    </Stack>
  )
}
