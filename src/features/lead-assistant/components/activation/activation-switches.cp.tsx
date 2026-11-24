import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined"
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import {
  patchDraftAct,
  setAssistantEnabledThunk,
} from "../../slice/lead-assistant-settings.slice"
import type { LeadFlowVersion } from "../../types/lead-assistant.types"
import ConfirmDialogCP from "../shared/confirm-dialog.cp"

/** Global kill switch (confirm before off) and the default flow for leads without a form. */
export default function ActivationSwitchesCP() {
  const dispatch = useAppDispatch()
  const [isConfirmingOff, setIsConfirmingOff] = useState(false)
  const isEnabled = useAppSelector((state) => state.leadAssistant.settings.server?.enabled ?? false)
  const isSaving = useAppSelector((state) => state.leadAssistant.settings.killSwitchSaving)
  const flow = useAppSelector((state) => state.leadAssistant.settings.draft?.defaultInboundFlow ?? "v1")
  const handleToggle = (next: boolean) => {
    if (next) {
      void dispatch(setAssistantEnabledThunk(true))
      return
    }
    setIsConfirmingOff(true)
  }
  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ p: 2, borderRadius: 1, border: "1px solid", borderColor: "divider" }}
      >
        <Stack direction="row" spacing={1.5}>
          <PowerSettingsNewOutlined color={isEnabled ? "success" : "disabled"} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} id="lead-assistant-kill-switch-label">
              {s.killSwitchTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480 }}>
              {isEnabled ? s.killSwitchOnBody : s.killSwitchOffBody}
            </Typography>
          </Box>
        </Stack>
        <FormControlLabel
          sx={{ mr: 0, flexShrink: 0 }}
          label={isEnabled ? s.killSwitchOn : s.killSwitchOff}
          control={
            <Switch
              checked={isEnabled}
              disabled={isSaving}
              onChange={(event) => handleToggle(event.target.checked)}
              inputProps={{ "aria-labelledby": "lead-assistant-kill-switch-label" }}
            />
          }
        />
      </Stack>
      <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
        <Typography component="legend" variant="subtitle1" fontWeight={600}>
          {s.defaultFlowTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {s.defaultFlowBody}
        </Typography>
        <RadioGroup
          value={flow}
          onChange={(event) =>
            dispatch(patchDraftAct({ defaultInboundFlow: event.target.value as LeadFlowVersion }))
          }
        >
          <FormControlLabel value="v2" control={<Radio size="small" />} label={s.defaultFlowV2} />
          <FormControlLabel value="v1" control={<Radio size="small" />} label={s.defaultFlowV1} />
        </RadioGroup>
      </Box>
      <ConfirmDialogCP
        open={isConfirmingOff}
        title={s.killSwitchConfirmTitle}
        body={s.killSwitchConfirmBody}
        confirmLabel={s.killSwitchConfirmAction}
        isDestructive
        isLoading={isSaving}
        onCancel={() => setIsConfirmingOff(false)}
        onConfirm={() => {
          setIsConfirmingOff(false)
          void dispatch(setAssistantEnabledThunk(false))
        }}
      />
    </Stack>
  )
}
