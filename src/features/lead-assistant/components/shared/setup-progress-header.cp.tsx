import { Box, ButtonBase, LinearProgress, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { LEAD_ASSISTANT_STEP_KEYS } from "../../business-logic/lead-assistant-steps"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { useStepDirtyMap } from "../../hooks/use-step-dirty"
import type { LeadAssistantStepKey } from "../../types/lead-assistant.types"
import StepStatusIconCP from "./step-status-icon.cp"

function StepPill(props: { readonly stepKey: LeadAssistantStepKey }) {
  const { step, setStep } = useLeadAssistantStep()
  const dirtyMap = useStepDirtyMap()
  const status = useAppSelector(
    (state) => state.leadAssistant.setup.readiness?.items.find((row) => row.key === props.stepKey)?.status,
  )
  const isActive = step === props.stepKey
  return (
    <ButtonBase
      onClick={() => setStep(props.stepKey)}
      aria-current={isActive ? "step" : undefined}
      sx={{
        flex: "0 0 auto",
        gap: 0.75,
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        border: "1px solid",
        borderColor: isActive ? "primary.main" : "divider",
        bgcolor: isActive ? "action.selected" : "transparent",
        transition: "background-color 150ms ease",
        "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      }}
    >
      <StepStatusIconCP status={status} />
      <Typography variant="body2" fontWeight={isActive ? 700 : 500} noWrap>
        {s.stepTitles[props.stepKey]}
        {dirtyMap[props.stepKey] ? ` · ${s.unsavedShort}` : ""}
      </Typography>
    </ButtonBase>
  )
}

/** "N de 5 listos" counter with progress; below lg it also hosts the horizontal step navigation. */
export default function SetupProgressHeaderCP() {
  const readiness = useAppSelector((state) => state.leadAssistant.setup.readiness)
  const readyCount = readiness?.readyCount ?? 0
  const total = readiness?.total ?? LEAD_ASSISTANT_STEP_KEYS.length
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 1 }}>
        <Typography variant="h5" component="p" fontWeight={700} aria-live="polite">
          {s.readyCountLabel(readyCount, total)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {s.readyCountHint}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={total === 0 ? 0 : (readyCount / total) * 100}
        aria-label={s.readyCountLabel(readyCount, total)}
        sx={{ height: 6, borderRadius: 3 }}
      />
      <Box
        component="nav"
        aria-label={s.railAriaLabel}
        sx={{ display: { xs: "block", lg: "none" }, mt: 2 }}
      >
        <Stack
          component="ol"
          direction="row"
          spacing={1}
          sx={{ listStyle: "none", m: 0, p: 0, overflowX: "auto", pb: 0.5 }}
        >
          {LEAD_ASSISTANT_STEP_KEYS.map((key) => (
            <li key={key}>
              <StepPill stepKey={key} />
            </li>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
