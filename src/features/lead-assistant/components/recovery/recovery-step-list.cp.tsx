import EditOutlined from "@mui/icons-material/EditOutlined"
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined"
import { Box, Chip, IconButton, List, ListItem, Stack, Switch, Typography } from "@mui/material"
import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { evaluateTemplateRefIssues } from "../../business-logic/render-template-preview"
import { formatOffsetHours, sortByOffset } from "../../business-logic/recovery-axis-layout"
import {
  openEditStepAct,
  toggleStepEnabledAct,
} from "../../slice/lead-assistant-recovery.slice"

/** Accessible ordered list of the steps (order always comes from the offset). */
export default function RecoveryStepListCP() {
  const dispatch = useAppDispatch()
  const steps = useAppSelector((state) => state.leadAssistant.recovery.steps)
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const ordered = useMemo(() => sortByOffset(steps), [steps])
  return (
    <List component="ol" disablePadding aria-label={s.recoveryListAria} sx={{ listStyle: "none" }}>
      {ordered.map((step) => {
        const issues = evaluateTemplateRefIssues(step.template, templates?.templates ?? null)
        const warnings: string[] = []
        if (issues.isMissing) {
          warnings.push(s.recoveryWarnNoTemplate)
        }
        if (issues.isUnapproved) {
          warnings.push(s.recoveryWarnUnapproved)
        }
        if (issues.unmappedVariables.length > 0) {
          warnings.push(s.recoveryWarnUnmapped(issues.unmappedVariables.length))
        }
        const hasCounts = step.sentCount > 0 || step.repliedCount > 0
        return (
          <ListItem
            key={step.key}
            divider
            sx={{ alignItems: "flex-start", gap: 1.5, px: 0 }}
            secondaryAction={undefined}
          >
            <Chip label={formatOffsetHours(step.offsetHours)} size="small" sx={{ mt: 0.25, minWidth: 64 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight={600}>
                {step.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {step.template != null
                  ? `${step.template.name} · ${step.template.language}`
                  : s.recoveryNoTemplateLabel}
              </Typography>
              {hasCounts ? (
                <Typography variant="caption" sx={{ display: "block", mt: 0.25 }}>
                  {s.recoveryCounts(step.sentCount, step.repliedCount)}
                </Typography>
              ) : null}
              {warnings.map((warning) => (
                <Stack key={warning} direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5, color: "warning.dark" }}>
                  <WarningAmberOutlined sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={600}>
                    {warning}
                  </Typography>
                </Stack>
              ))}
            </Box>
            <Switch
              checked={step.enabled}
              onChange={() => dispatch(toggleStepEnabledAct(step.key))}
              inputProps={{ "aria-label": s.recoveryToggleAria(step.label) }}
            />
            <IconButton aria-label={s.recoveryEditAria(step.label)} onClick={() => dispatch(openEditStepAct(step.key))}>
              <EditOutlined />
            </IconButton>
          </ListItem>
        )
      })}
    </List>
  )
}
