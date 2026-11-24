import AddCommentOutlined from "@mui/icons-material/AddCommentOutlined"
import { Box, Button, Chip, LinearProgress, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { buildProfileRows } from "../../business-logic/build-profile-rows"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { openFromQuestionAct } from "../../slice/lead-assistant-faq.slice"
import { closeSimulatorAct } from "../../slice/lead-assistant-simulator.slice"
import type { LeadProfile } from "../../types/lead-assistant.types"

type SectionProps = {
  readonly title: string
  readonly children: ReactNode
}

function Section(props: SectionProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
        {props.title}
      </Typography>
      {props.children}
    </Box>
  )
}

/** Side panel: stage, profile, score, temperature, FAQs used and the unanswered shortcut. */
export default function SimulatorInsightsCP() {
  const dispatch = useAppDispatch()
  const { setStep } = useLeadAssistantStep()
  const insights = useAppSelector((state) => state.leadAssistant.simulator.insights)
  if (insights == null) {
    return (
      <Typography variant="body2" color="text.secondary" component="aside" aria-label={s.insightsTitle}>
        {s.insightsEmpty}
      </Typography>
    )
  }
  const profileRows = buildProfileRows(insights.profile)
  const scorePercent = insights.maxScore === 0 ? 0 : (insights.score / insights.maxScore) * 100
  const handleAddQuestion = () => {
    if (insights.unansweredQuestion == null) {
      return
    }
    dispatch(openFromQuestionAct({ question: insights.unansweredQuestion }))
    dispatch(closeSimulatorAct())
    setStep("knowledge")
  }
  return (
    <Stack spacing={2} component="aside" aria-label={s.insightsTitle} sx={{ minWidth: 0 }}>
      <Section title={s.insightsStage}>
        <Box>
          <Chip label={s.stageLabels[insights.stage]} size="small" />
        </Box>
      </Section>
      <Section title={s.insightsScore}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LinearProgress
            variant="determinate"
            value={scorePercent}
            aria-label={s.insightsScoreAria(insights.score, insights.maxScore)}
            sx={{ flex: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" fontWeight={700}>
            {insights.score}/{insights.maxScore}
          </Typography>
        </Stack>
        <Box sx={{ mt: 1 }}>
          <Chip
            size="small"
            variant="outlined"
            label={s.insightsTemperature(s.temperatureLabels[insights.temperature])}
          />
        </Box>
      </Section>
      <Section title={s.insightsProfile}>
        {profileRows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {s.insightsProfileEmpty}
          </Typography>
        ) : (
          <Box component="dl" sx={{ m: 0 }}>
            {profileRows.map((row) => (
              <Stack key={row.label} direction="row" spacing={1} sx={{ py: 0.25 }}>
                <Typography component="dt" variant="caption" color="text.secondary" sx={{ minWidth: 96 }}>
                  {row.label}
                </Typography>
                <Typography component="dd" variant="body2" sx={{ m: 0 }}>
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Box>
        )}
      </Section>
      <Section title={s.insightsFaqs}>
        {insights.usedFaqs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {s.insightsFaqsEmpty}
          </Typography>
        ) : (
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {insights.usedFaqs.map((faq) => (
              <li key={faq.id}>
                <Typography variant="body2">{faq.question}</Typography>
              </li>
            ))}
          </Box>
        )}
      </Section>
      {insights.unansweredQuestion != null ? (
        <Section title={s.insightsUnanswered}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {insights.unansweredQuestion}
          </Typography>
          <Button size="small" variant="outlined" startIcon={<AddCommentOutlined />} onClick={handleAddQuestion}>
            {s.insightsUnansweredAction}
          </Button>
        </Section>
      ) : null}
    </Stack>
  )
}
