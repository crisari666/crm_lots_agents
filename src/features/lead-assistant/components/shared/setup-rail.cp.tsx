import { Box, ButtonBase, Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { LEAD_ASSISTANT_STEP_KEYS } from "../../business-logic/lead-assistant-steps"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { useStepDirtyMap } from "../../hooks/use-step-dirty"
import type { LeadAssistantStepKey } from "../../types/lead-assistant.types"
import StepStatusIconCP from "./step-status-icon.cp"

type ItemProps = {
  readonly stepKey: LeadAssistantStepKey
  readonly index: number
}

function RailItem(props: ItemProps) {
  const { step, setStep } = useLeadAssistantStep()
  const dirtyMap = useStepDirtyMap()
  const item = useAppSelector((state) =>
    state.leadAssistant.setup.readiness?.items.find((row) => row.key === props.stepKey),
  )
  const isActive = step === props.stepKey
  const detail = item == null ? s.statusPending : item.status === "ready" ? s.statusReady : item.detail
  return (
    <ButtonBase
      component="button"
      onClick={() => setStep(props.stepKey)}
      aria-current={isActive ? "step" : undefined}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        textAlign: "left",
        alignItems: "flex-start",
        gap: 1.25,
        px: 1.5,
        py: 1.25,
        borderRadius: 1,
        borderLeft: "3px solid",
        borderColor: isActive ? "primary.main" : "transparent",
        bgcolor: isActive ? "action.selected" : "transparent",
        transition: "background-color 150ms ease",
        "&:hover": { bgcolor: "action.hover" },
        "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
      }}
    >
      <Box sx={{ pt: 0.25 }}>
        <StepStatusIconCP status={item?.status} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" fontWeight={isActive ? 700 : 500}>
          {props.index + 1}. {s.stepTitles[props.stepKey]}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {detail}
        </Typography>
        {dirtyMap[props.stepKey] ? (
          <Typography variant="caption" color="warning.main" fontWeight={600} sx={{ display: "block" }}>
            {s.unsavedShort}
          </Typography>
        ) : null}
      </Box>
    </ButtonBase>
  )
}

/** Vertical step rail (lg and up): readiness icon plus text per step. */
export default function SetupRailCP() {
  return (
    <Box component="nav" aria-label={s.railAriaLabel}>
      <Stack component="ol" spacing={0.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
        {LEAD_ASSISTANT_STEP_KEYS.map((key, index) => (
          <li key={key}>
            <RailItem stepKey={key} index={index} />
          </li>
        ))}
      </Stack>
    </Box>
  )
}
