import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined"
import { Box, Button, Divider, Skeleton, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import { openSimulatorAct } from "../../slice/lead-assistant-simulator.slice"
import ActivationFormsListCP from "./activation-forms-list.cp"
import ActivationSwitchesCP from "./activation-switches.cp"

/** Step 5: kill switch, default inbound flow, forms on V2 and the simulator entry point. */
export default function ActivationStepCP() {
  const dispatch = useAppDispatch()
  const projects = useLeadAssistantProjects()
  const hasSettings = useAppSelector((state) => state.leadAssistant.settings.draft != null)
  if (!hasSettings) {
    return (
      <Stack spacing={2} aria-busy="true" aria-label={s.loading}>
        <Skeleton variant="rounded" height={88} />
        <Skeleton variant="rounded" height={120} />
      </Stack>
    )
  }
  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box>
          <Typography variant="h5" component="h2" fontWeight={700}>
            {s.stepTitles.activation}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
            {s.activationIntro}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SmartToyOutlined />}
          onClick={() => dispatch(openSimulatorAct(projects[0]?.id))}
          sx={{ flexShrink: 0 }}
        >
          {s.activationTest}
        </Button>
      </Stack>
      <ActivationSwitchesCP />
      <Divider />
      <Box>
        <Typography variant="h6" component="h3">
          {s.formsTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, maxWidth: 560 }}>
          {s.formsBody}
        </Typography>
        <ActivationFormsListCP />
      </Box>
    </Stack>
  )
}
