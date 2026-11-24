import LockClockOutlined from "@mui/icons-material/LockClockOutlined"
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined"
import { Box, ButtonBase, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { evaluateTemplateRefIssues } from "../../business-logic/render-template-preview"
import {
  formatOffsetHours,
  layoutRecoveryAxis,
  RECOVERY_WINDOW_CLOSE_HOURS,
} from "../../business-logic/recovery-axis-layout"
import { openEditStepAct } from "../../slice/lead-assistant-recovery.slice"

const AXIS_MIN_WIDTH = 620
const AXIS_HEIGHT = 144
const TRACK_TOP = 66
const NODE_SIZE = 20

/** Horizontal day axis with one node per step and the 24h window-close marker. */
export default function RecoveryAxisCP() {
  const dispatch = useAppDispatch()
  const steps = useAppSelector((state) => state.leadAssistant.recovery.steps)
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const layout = useMemo(
    () => layoutRecoveryAxis(steps.map((step) => ({ key: step.key, offsetHours: step.offsetHours }))),
    [steps],
  )
  return (
    <Box sx={{ overflowX: "auto", pb: 1 }}>
      <Box
        role="group"
        aria-label={s.recoveryAxisAria}
        sx={{ position: "relative", minWidth: AXIS_MIN_WIDTH, height: AXIS_HEIGHT, mx: 2 }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: TRACK_TOP,
            height: 2,
            bgcolor: "divider",
          }}
        />
        {layout.ticks.map((tick) => (
          <Box
            key={tick.hours}
            aria-hidden
            sx={{ position: "absolute", left: `${tick.leftPercent}%`, top: TRACK_TOP + 14, transform: "translateX(-50%)" }}
          >
            <Typography variant="caption" color="text.secondary">
              {tick.hours === 0 ? s.recoveryAxisStart : formatOffsetHours(tick.hours)}
            </Typography>
          </Box>
        ))}
        <Box
          sx={{
            position: "absolute",
            left: `${layout.windowCloseLeftPercent}%`,
            top: 0,
            bottom: 0,
            borderLeft: "2px dashed",
            borderColor: "warning.main",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 6,
              top: 0,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "warning.dark",
              whiteSpace: "nowrap",
            }}
          >
            <LockClockOutlined sx={{ fontSize: 16 }} />
            <Typography variant="caption" fontWeight={600}>
              {s.recoveryWindowClose(RECOVERY_WINDOW_CLOSE_HOURS)}
            </Typography>
          </Box>
        </Box>
        {layout.nodes.map((node) => {
          const step = steps.find((row) => row.key === node.key)
          if (step == null) {
            return null
          }
          const issues = evaluateTemplateRefIssues(step.template, templates?.templates ?? null)
          const hasWarning =
            issues.isMissing || issues.isUnapproved || issues.unmappedVariables.length > 0
          return (
            <Box
              key={node.key}
              sx={{
                position: "absolute",
                left: `${node.leftPercent}%`,
                top: TRACK_TOP - NODE_SIZE / 2 + 1,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ButtonBase
                onClick={() => dispatch(openEditStepAct(node.key))}
                aria-label={s.recoveryNodeAria(step.label, formatOffsetHours(step.offsetHours))}
                sx={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: hasWarning ? "warning.main" : "primary.main",
                  bgcolor: step.enabled ? "primary.main" : "background.paper",
                  color: step.enabled ? "primary.contrastText" : "text.secondary",
                  transition: "transform 150ms ease",
                  "&:hover": { transform: "scale(1.15)" },
                  "&.Mui-focusVisible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 },
                }}
              >
                {hasWarning ? <WarningAmberOutlined sx={{ fontSize: 12 }} color="warning" /> : null}
              </ButtonBase>
              <Box
                sx={{
                  position: "absolute",
                  top: node.row === 0 ? -31 : NODE_SIZE + 34,
                  width: 112,
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <Typography variant="caption" fontWeight={700} sx={{ display: "block", lineHeight: 1.2 }}>
                  {formatOffsetHours(step.offsetHours)}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                  {step.enabled ? step.label : s.recoveryStepInactive(step.label)}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
