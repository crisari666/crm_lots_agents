import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { jobCampaignStrings as s } from "../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignCandidateCvAnalysis } from "../types/job-campaign.types"
import { resolveScoreColor } from "./job-candidate-score-chip.cp"

const SCORE_GAUGE_SIZE = 96

type Props = {
  readonly analysis: JobCampaignCandidateCvAnalysis
}

function ScoreGauge(props: { readonly score: number }) {
  const color = resolveScoreColor(props.score) ?? "primary"
  return (
    <Box sx={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={SCORE_GAUGE_SIZE}
        thickness={3}
        sx={{ color: "grey.200", position: "absolute" }}
      />
      <CircularProgress
        variant="determinate"
        value={props.score}
        size={SCORE_GAUGE_SIZE}
        thickness={3}
        color={color === "default" ? "primary" : color}
        aria-label={`${s.scoreLabel}: ${props.score}`}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} lineHeight={1}>
          {props.score}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          /100
        </Typography>
      </Box>
    </Box>
  )
}

function InsightList(props: {
  readonly title: string
  readonly items: readonly string[]
  readonly accent: string
}) {
  if (props.items.length === 0) return null
  return (
    <Box sx={{ flex: 1, minWidth: 200 }}>
      <Typography variant="overline" color="text.secondary">
        {props.title}
      </Typography>
      <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 0, listStyle: "none" }}>
        {props.items.map((item) => (
          <Typography
            key={item}
            component="li"
            variant="body2"
            sx={{ pl: 1.5, borderLeft: "2px solid", borderColor: props.accent }}
          >
            {item}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

/** AI verdict: score gauge, summary and strengths/gaps. */
export function JobCandidateCvAnalysisCp(props: Props) {
  const { analysis } = props
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2.5} alignItems="center">
        <ScoreGauge score={analysis.score} />
        <Box>
          <Typography variant="overline" color="text.secondary">
            {s.profileSummary}
          </Typography>
          <Typography variant="body2">{analysis.summary}</Typography>
          <Typography variant="caption" color="text.secondary">
            {analysis.yearsExperience != null
              ? `${analysis.yearsExperience} ${s.profileYearsExperience} · `
              : ""}
            {s.profileAnalyzedAt} {new Date(analysis.analyzedAt).toLocaleString()}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
        <InsightList
          title={s.profileStrengths}
          items={analysis.strengths}
          accent="success.main"
        />
        <InsightList
          title={s.profileGaps}
          items={analysis.gaps}
          accent="warning.main"
        />
      </Stack>
    </Stack>
  )
}
