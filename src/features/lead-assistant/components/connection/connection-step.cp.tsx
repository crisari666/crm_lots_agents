import RefreshOutlined from "@mui/icons-material/RefreshOutlined"
import { Alert, Box, Button, CircularProgress, Skeleton, Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadAssistantStrings as s } from "../../../../i18n/locales/lead-assistant.strings"
import { fetchReadinessThunk, fetchTemplatesThunk } from "../../slice/lead-assistant-setup.slice"
import StepStatusIconCP from "../shared/step-status-icon.cp"

function formatSyncDate(iso: string | undefined): string {
  if (iso == null) {
    return s.connectionNeverSynced
  }
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })
}

type FactProps = {
  readonly label: string
  readonly value: string
}

function Fact(props: FactProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
        {props.label}
      </Typography>
      <Typography variant="h6" component="p">
        {props.value}
      </Typography>
    </Box>
  )
}

/** Read-only WhatsApp connection status: approved templates, last sync and reload. */
export default function ConnectionStepCP() {
  const dispatch = useAppDispatch()
  const templates = useAppSelector((state) => state.leadAssistant.setup.templates)
  const status = useAppSelector((state) => state.leadAssistant.setup.templatesStatus)
  const templatesError = useAppSelector((state) => state.leadAssistant.setup.templatesError)
  const item = useAppSelector((state) =>
    state.leadAssistant.setup.readiness?.items.find((row) => row.key === "connection"),
  )
  const isLoading = status === "loading"
  const approvedCount = templates?.templates.length ?? 0
  const hasProblem = item != null && item.status !== "ready"
  const handleReload = () => {
    void dispatch(fetchTemplatesThunk(true))
    void dispatch(fetchReadinessThunk())
  }
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" component="h2" fontWeight={700}>
          {s.stepTitles.connection}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 560 }}>
          {s.connectionIntro}
        </Typography>
      </Box>
      {hasProblem ? (
        <Alert severity={item.status === "missing" ? "error" : "warning"} role="alert">
          {item.detail}
        </Alert>
      ) : null}
      {templatesError != null && !hasProblem ? (
        <Alert severity="error" role="alert">
          {templatesError}
        </Alert>
      ) : null}
      {isLoading && templates == null ? (
        <Stack direction="row" spacing={4}>
          <Skeleton variant="rounded" width={160} height={56} />
          <Skeleton variant="rounded" width={220} height={56} />
        </Stack>
      ) : (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 6 }} alignItems={{ sm: "flex-end" }}>
          <Fact label={s.connectionTemplatesLabel} value={String(approvedCount)} />
          <Fact label={s.connectionLastSyncLabel} value={formatSyncDate(templates?.fetchedAt)} />
          {templates?.phoneNumberId != null ? (
            <Fact label={s.connectionPhoneLabel} value={templates.phoneNumberId} />
          ) : null}
        </Stack>
      )}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Button
          variant="outlined"
          onClick={handleReload}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshOutlined />}
        >
          {s.connectionReload}
        </Button>
        {item != null && !hasProblem ? (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <StepStatusIconCP status={item.status} />
            <Typography variant="body2">{item.detail}</Typography>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  )
}
