import CloseOutlined from "@mui/icons-material/CloseOutlined"
import RestartAltOutlined from "@mui/icons-material/RestartAltOutlined"
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { useLeadAssistantProjects } from "../../hooks/use-lead-assistant-projects"
import {
  closeSimulatorAct,
  resetSimulatorAct,
  setSimulatorProjectAct,
} from "../../slice/lead-assistant-simulator.slice"
import SimulatorChatCP from "./simulator-chat.cp"
import SimulatorInsightsCP from "./simulator-insights.cp"

/** Dialog sandbox: chat against the V2 agent for a chosen project, with insights on the side. */
export default function SimulatorDialogCP() {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const isCompact = useMediaQuery(theme.breakpoints.down("md"))
  const isOpen = useAppSelector((state) => state.leadAssistant.simulator.open)
  const projectId = useAppSelector((state) => state.leadAssistant.simulator.projectId)
  const hasConversation = useAppSelector(
    (state) => state.leadAssistant.simulator.messages.length > 0,
  )
  const projects = useLeadAssistantProjects()
  return (
    <Dialog
      open={isOpen}
      onClose={() => dispatch(closeSimulatorAct())}
      fullScreen={isCompact}
      fullWidth
      maxWidth="lg"
      aria-labelledby="lead-assistant-simulator-title"
    >
      <DialogTitle id="lead-assistant-simulator-title" sx={{ pr: 7 }}>
        {s.simulatorTitle}
        <IconButton
          aria-label={s.close}
          onClick={() => dispatch(closeSimulatorAct())}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          {s.simulatorBanner}
        </Alert>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }} alignItems={{ sm: "center" }}>
          <TextField
            select
            size="small"
            id="lead-assistant-simulator-project"
            label={s.simulatorProject}
            value={projects.some((project) => project.id === projectId) ? projectId : ""}
            onChange={(event) => dispatch(setSimulatorProjectAct(event.target.value))}
            helperText={projects.length === 0 ? s.simulatorNoProjects : undefined}
            sx={{ minWidth: 260 }}
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
              </MenuItem>
            ))}
          </TextField>
          <Button
            startIcon={<RestartAltOutlined />}
            onClick={() => dispatch(resetSimulatorAct())}
            disabled={!hasConversation}
          >
            {s.simulatorReset}
          </Button>
        </Stack>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 320px" },
          }}
        >
          <SimulatorChatCP />
          <SimulatorInsightsCP />
        </Box>
      </DialogContent>
    </Dialog>
  )
}
