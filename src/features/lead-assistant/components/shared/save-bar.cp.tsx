import { Alert, AlertTitle, Box, Button, CircularProgress, Fade, Stack, Typography } from "@mui/material"
import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { useFadeDuration } from "../../hooks/use-prefers-reduced-motion"
import { useLeadAssistantStep } from "../../hooks/use-lead-assistant-step"
import { useStepDirtyMap } from "../../hooks/use-step-dirty"
import { discardChangesAct, saveRecoveryThunk } from "../../slice/lead-assistant-recovery.slice"
import { discardScopeAct, saveSettingsThunk } from "../../slice/lead-assistant-settings.slice"

type SaveBarConfig = {
  readonly isSaving: boolean
  readonly summary: readonly string[]
  readonly failedToken: number
  readonly onSave: () => void
  readonly onDiscard: () => void
}

function useSaveBarConfig(): SaveBarConfig | null {
  const dispatch = useAppDispatch()
  const { step } = useLeadAssistantStep()
  const settings = useAppSelector((state) => state.leadAssistant.settings)
  const recovery = useAppSelector((state) => state.leadAssistant.recovery)
  if (step === "identity" || step === "activation") {
    return {
      isSaving: settings.saving,
      summary: settings.saveErrorSummary,
      failedToken: settings.saveFailedToken,
      onSave: () => void dispatch(saveSettingsThunk(step)),
      onDiscard: () => dispatch(discardScopeAct(step)),
    }
  }
  if (step === "recovery") {
    return {
      isSaving: recovery.saving,
      summary: recovery.saveErrorSummary,
      failedToken: recovery.saveFailedToken,
      onSave: () => void dispatch(saveRecoveryThunk()),
      onDiscard: () => dispatch(discardChangesAct()),
    }
  }
  return null
}

/** Sticky save bar of the active step; a failed save moves focus to the error summary. */
export default function SaveBarCP() {
  const { step } = useLeadAssistantStep()
  const dirtyMap = useStepDirtyMap()
  const config = useSaveBarConfig()
  const fadeDuration = useFadeDuration()
  const summaryRef = useRef<HTMLDivElement>(null)
  const failedToken = config?.failedToken ?? 0
  useEffect(() => {
    if (failedToken > 0) {
      summaryRef.current?.focus()
    }
  }, [failedToken])
  if (config == null) {
    return null
  }
  const isDirty = dirtyMap[step]
  const hasSummary = config.summary.length > 0
  const isVisible = isDirty || hasSummary
  return (
    <Fade in={isVisible} timeout={fadeDuration} unmountOnExit>
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 2,
          mt: 3,
          py: 1.5,
          px: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        {hasSummary ? (
          <Alert
            severity="error"
            role="alert"
            tabIndex={-1}
            ref={summaryRef}
            sx={{ mb: 1.5, "&:focus-visible": { outline: "2px solid", outlineColor: "error.main" } }}
          >
            <AlertTitle>{s.saveSummaryTitle}</AlertTitle>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {config.summary.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </Box>
          </Alert>
        ) : null}
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="body2" fontWeight={600}>
            {isDirty ? s.unsavedChanges : ""}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={config.onDiscard} disabled={config.isSaving || !isDirty}>
              {s.discard}
            </Button>
            <Button
              variant="contained"
              onClick={config.onSave}
              disabled={config.isSaving || !isDirty}
              startIcon={config.isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
            >
              {s.save}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Fade>
  )
}
