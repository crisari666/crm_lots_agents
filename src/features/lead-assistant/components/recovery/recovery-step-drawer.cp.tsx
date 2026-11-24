import CloseOutlined from "@mui/icons-material/CloseOutlined"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined"
import {
  Alert,
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { validateRecoveryStep } from "../../business-logic/lead-assistant-validation"
import { evaluateTemplateRefIssues, renderTemplatePreview } from "../../business-logic/render-template-preview"
import { HOURS_IN_DAY } from "../../business-logic/recovery-axis-layout"
import { usePreviewContext } from "../../hooks/use-preview-context"
import {
  applyStepDraftAct,
  closeStepDrawerAct,
  patchDraftAct,
  removeStepAct,
  touchFieldAct,
} from "../../slice/lead-assistant-recovery.slice"
import ConfirmDialogCP from "../shared/confirm-dialog.cp"
import TemplatePickerCP from "../shared/template-picker.cp"
import TemplateVariableMappingCP from "../shared/template-variable-mapping.cp"
import WhatsAppBubbleCP from "../shared/whatsapp-bubble.cp"

const DRAWER_WIDTH = 520

type OffsetUnit = "hours" | "days"

function toDisplayValue(offsetHours: number, unit: OffsetUnit): string {
  if (unit === "hours") {
    return String(offsetHours)
  }
  return String(Number((offsetHours / HOURS_IN_DAY).toFixed(2)))
}

function OffsetField() {
  const dispatch = useAppDispatch()
  const offsetHours = useAppSelector((state) => state.leadAssistant.recovery.stepDraft.offsetHours)
  const label = useAppSelector((state) => state.leadAssistant.recovery.stepDraft.label)
  const touched = useAppSelector((state) => state.leadAssistant.recovery.stepTouched.offset === true)
  const stepError = useAppSelector((state) => state.leadAssistant.recovery.stepError)
  const [unit, setUnit] = useState<OffsetUnit>(offsetHours % HOURS_IN_DAY === 0 ? "days" : "hours")
  const [raw, setRaw] = useState<string>(toDisplayValue(offsetHours, unit))
  const validation = validateRecoveryStep({ label, offsetHours }, s.recoveryValidation).offset
  const error = touched ? validation ?? stepError ?? undefined : stepError ?? undefined
  const handleRawChange = (value: string) => {
    setRaw(value)
    const parsed = Number(value.replace(",", "."))
    if (value.trim().length > 0 && Number.isFinite(parsed)) {
      dispatch(patchDraftAct({ offsetHours: Math.round(parsed * (unit === "days" ? HOURS_IN_DAY : 1)) }))
    }
  }
  const handleUnitChange = (next: OffsetUnit | null) => {
    if (next == null) {
      return
    }
    setUnit(next)
    setRaw(toDisplayValue(offsetHours, next))
  }
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <TextField
        id="lead-assistant-step-offset"
        label={s.recoveryOffsetLabel}
        value={raw}
        onChange={(event) => handleRawChange(event.target.value)}
        onBlur={() => dispatch(touchFieldAct("offset"))}
        error={error != null}
        helperText={error ?? s.recoveryOffsetHelper(offsetHours)}
        inputProps={{ inputMode: "decimal" }}
        sx={{ flex: 1 }}
        required
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={unit}
        onChange={(_, next: OffsetUnit | null) => handleUnitChange(next)}
        aria-label={s.recoveryUnitAria}
        sx={{ mt: 0.75 }}
      >
        <ToggleButton value="hours">{s.recoveryUnitHours}</ToggleButton>
        <ToggleButton value="days">{s.recoveryUnitDays}</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

function StepPreview() {
  const template = useAppSelector((state) => state.leadAssistant.recovery.stepDraft.template)
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const context = usePreviewContext()
  const issues = evaluateTemplateRefIssues(template, templates?.templates ?? null)
  if (template == null) {
    return null
  }
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{s.recoveryPreviewTitle}</Typography>
      {issues.isUnapproved ? (
        <Alert severity="warning" icon={<WarningAmberOutlined />} role="status">
          {s.recoveryWarnUnapproved}
        </Alert>
      ) : null}
      <Stack sx={{ p: 1.5, borderRadius: 1, bgcolor: "action.hover" }}>
        <WhatsAppBubbleCP sender="assistant" text={renderTemplatePreview(template, context)} />
      </Stack>
    </Stack>
  )
}

function StepForm() {
  const dispatch = useAppDispatch()
  const draft = useAppSelector((state) => state.leadAssistant.recovery.stepDraft)
  const touched = useAppSelector((state) => state.leadAssistant.recovery.stepTouched)
  const errors = validateRecoveryStep(draft, s.recoveryValidation)
  return (
    <Stack spacing={2.5}>
      <TextField
        id="lead-assistant-step-label"
        label={s.recoveryLabelLabel}
        value={draft.label}
        onChange={(event) => dispatch(patchDraftAct({ label: event.target.value }))}
        onBlur={() => dispatch(touchFieldAct("label"))}
        error={touched.label === true && errors.label != null}
        helperText={touched.label === true ? errors.label : undefined}
        fullWidth
        required
        autoFocus
      />
      <OffsetField />
      <FormControlLabel
        control={
          <Switch
            checked={draft.enabled}
            onChange={(event) => dispatch(patchDraftAct({ enabled: event.target.checked }))}
          />
        }
        label={s.recoveryEnabledLabel}
      />
      <TemplatePickerCP
        id="lead-assistant-step-template"
        label={s.recoveryTemplateLabel}
        value={draft.template}
        onChange={(next) => dispatch(patchDraftAct({ template: next }))}
      />
      {draft.template != null ? (
        <TemplateVariableMappingCP
          idPrefix="lead-assistant-step"
          value={draft.template}
          onChange={(next) => dispatch(patchDraftAct({ template: next }))}
        />
      ) : null}
      <StepPreview />
      {draft.sentCount > 0 || draft.repliedCount > 0 ? (
        <Typography variant="body2" color="text.secondary">
          {s.recoveryCounts(draft.sentCount, draft.repliedCount)}
        </Typography>
      ) : null}
    </Stack>
  )
}

/** Right drawer to edit one recovery step (offset, template, mapping, preview). */
export default function RecoveryStepDrawerCP() {
  const dispatch = useAppDispatch()
  const isOpen = useAppSelector((state) => state.leadAssistant.recovery.drawerOpen)
  const isNew = useAppSelector((state) => state.leadAssistant.recovery.isNewStep)
  const draft = useAppSelector((state) => state.leadAssistant.recovery.stepDraft)
  const [confirm, setConfirm] = useState<"delete" | "discard" | null>(null)
  const baselineRef = useRef<string>("")
  useEffect(() => {
    if (isOpen) {
      baselineRef.current = JSON.stringify(draft)
    }
    // Baseline is captured only when the drawer opens for a given step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, draft.key])
  const handleClose = () => {
    if (JSON.stringify(draft) !== baselineRef.current) {
      setConfirm("discard")
      return
    }
    dispatch(closeStepDrawerAct())
  }
  return (
    <>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={handleClose}
        PaperProps={{ sx: { width: { xs: "100%", sm: DRAWER_WIDTH } } }}
      >
        <Box
          component="form"
          noValidate
          role="dialog"
          aria-labelledby="lead-assistant-step-drawer-title"
          onSubmit={(event) => {
            event.preventDefault()
            dispatch(applyStepDraftAct())
          }}
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2 }}>
            <Typography id="lead-assistant-step-drawer-title" variant="h6" component="h2">
              {isNew ? s.recoveryDrawerCreate : s.recoveryDrawerEdit}
            </Typography>
            <IconButton aria-label={s.close} onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Stack>
          <Box sx={{ px: 3, pb: 2, flex: 1, overflowY: "auto" }}>
            {isOpen ? <StepForm key={draft.key} /> : null}
          </Box>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            {!isNew ? (
              <Button color="error" startIcon={<DeleteOutline />} onClick={() => setConfirm("delete")} sx={{ mr: "auto" }}>
                {s.delete}
              </Button>
            ) : (
              <Typography variant="caption" color="text.secondary" sx={{ mr: "auto" }}>
                {s.recoveryApplyHint}
              </Typography>
            )}
            <Button onClick={handleClose}>{s.cancel}</Button>
            <Button type="submit" variant="contained">
              {s.recoveryApply}
            </Button>
          </Stack>
        </Box>
      </Drawer>
      <ConfirmDialogCP
        open={confirm === "delete"}
        title={s.recoveryDeleteTitle}
        body={s.recoveryDeleteBody}
        confirmLabel={s.delete}
        isDestructive
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          dispatch(removeStepAct(draft.key))
        }}
      />
      <ConfirmDialogCP
        open={confirm === "discard"}
        title={s.discardTitle}
        body={s.discardBody}
        confirmLabel={s.discardConfirm}
        isDestructive
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null)
          dispatch(closeStepDrawerAct())
        }}
      />
    </>
  )
}
