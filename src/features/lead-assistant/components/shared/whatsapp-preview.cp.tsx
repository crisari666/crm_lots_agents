import FolderSpecialOutlined from "@mui/icons-material/FolderSpecialOutlined"
import { Box, Chip, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { useMemo } from "react"
import { useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { renderTemplatePreview } from "../../business-logic/render-template-preview"
import { formatOffsetHours, sortByOffset } from "../../business-logic/recovery-axis-layout"
import { interpolateGreeting } from "../../business-logic/interpolate-greeting"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { usePreviewContext } from "../../hooks/use-preview-context"
import type { LeadAssistantStepKey, LeadFaq } from "../../types/lead-assistant.types"
import WhatsAppBubbleCP from "./whatsapp-bubble.cp"

function resolveFaqAnswer(faq: LeadFaq, projectId: string | undefined): string {
  const own = faq.projectAnswers.find((entry) => entry.projectId === projectId)
  return own?.answer ?? faq.defaultAnswer ?? faq.projectAnswers[0]?.answer ?? ""
}

function IdentityPreview() {
  const context = usePreviewContext()
  const draft = useAppSelector((state) => state.leadAssistant.settings.draft)
  if (draft == null) {
    return null
  }
  const greeting = interpolateGreeting(draft.greeting, {
    customerName: context.firstName,
    businessName: context.businessName,
    assistantName: context.assistantName,
  })
  const welcome =
    draft.welcomeTemplate != null ? renderTemplatePreview(draft.welcomeTemplate, context) : null
  return (
    <>
      {welcome != null ? (
        <WhatsAppBubbleCP sender="assistant" caption={s.previewWelcomeCaption} text={welcome} />
      ) : null}
      <WhatsAppBubbleCP sender="assistant" caption={s.previewGreetingCaption} text={greeting} />
      <WhatsAppBubbleCP sender="lead" text={s.previewLeadPriceQuestion} />
      <WhatsAppBubbleCP sender="assistant" text={s.pricePolicies[draft.pricePolicy].sample} />
    </>
  )
}

function KnowledgePreview() {
  const faqs = useAppSelector((state) => state.leadAssistant.faq.items)
  const projects = useAppSelector((state) => state.projects.projects)
  const firstFaq = faqs.find((faq) => faq.enabled) ?? faqs[0]
  const firstProjectId = projects.find((project) => project.enabled !== false)?._id
  if (firstFaq == null) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.previewKnowledgeEmpty}
      </Typography>
    )
  }
  return (
    <>
      <WhatsAppBubbleCP sender="lead" text={firstFaq.question} />
      <WhatsAppBubbleCP sender="assistant" text={resolveFaqAnswer(firstFaq, firstProjectId)} />
    </>
  )
}

function RecoveryPreview() {
  const steps = useAppSelector((state) => state.leadAssistant.recovery.steps)
  const context = usePreviewContext()
  const ordered = useMemo(() => sortByOffset(steps).filter((step) => step.template != null), [steps])
  if (ordered.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.previewRecoveryEmpty}
      </Typography>
    )
  }
  return (
    <>
      {ordered.map((step) =>
        step.template != null ? (
          <WhatsAppBubbleCP
            key={step.key}
            sender="assistant"
            caption={s.previewRecoveryCaption(formatOffsetHours(step.offsetHours))}
            text={renderTemplatePreview(step.template, context)}
          />
        ) : null,
      )}
    </>
  )
}

function renderStepPreview(step: LeadAssistantStepKey) {
  if (step === "knowledge") {
    return <KnowledgePreview />
  }
  if (step === "recovery") {
    return <RecoveryPreview />
  }
  return <IdentityPreview />
}

/** WhatsApp-style preview of the active step with the sample lead and first enabled project. */
export default function WhatsAppPreviewCP() {
  const { step } = useLeadAssistantStep()
  const context = usePreviewContext()
  return (
    <Box component="figure" sx={{ m: 0 }} aria-label={s.previewTitle}>
      <Typography
        component="figcaption"
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", mb: 1, letterSpacing: 1 }}
      >
        {s.previewTitle}
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5, flexWrap: "wrap", rowGap: 0.5 }}>
        <Chip size="small" variant="outlined" label={s.previewLeadChip(context.firstName)} />
        {context.projectTitle.length > 0 ? (
          <Chip
            size="small"
            variant="outlined"
            icon={<FolderSpecialOutlined />}
            label={context.projectTitle}
          />
        ) : null}
      </Stack>
      <Stack
        spacing={1.25}
        sx={(theme) => ({
          p: 2,
          minHeight: 200,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.06),
          border: "1px solid",
          borderColor: alpha(theme.palette.success.main, 0.2),
        })}
      >
        {renderStepPreview(step)}
      </Stack>
    </Box>
  )
}
