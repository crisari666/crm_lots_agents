import CampaignOutlined from "@mui/icons-material/CampaignOutlined"
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined"
import GroupsOutlined from "@mui/icons-material/GroupsOutlined"
import PersonAddAltOutlined from "@mui/icons-material/PersonAddAltOutlined"
import SchoolOutlined from "@mui/icons-material/SchoolOutlined"
import VerifiedOutlined from "@mui/icons-material/VerifiedOutlined"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { Moment } from "moment"
import moment from "moment"
import { useCallback, useEffect, useState, type ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  clearCeoOperationsSummaryCrmErrorAct,
  clearCeoOperationsSummaryErrorAct,
  fetchCeoOperationsSummaryThunk,
} from "../slice/ceo-operations-summary.slice"

function KpiCard(props: {
  title: string
  value: string | number
  subtitle?: string
  icon: ReactNode
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.25,
        height: "100%",
        minHeight: 118,
        cursor: "default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between" sx={{ flex: 1 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}>
            {props.title}
          </Typography>
          <Typography variant="h5" component="p" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.25 }}>
            {props.value}
          </Typography>
          {props.subtitle !== undefined && props.subtitle !== "" && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.25 }}>
              {props.subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ color: "primary.main", opacity: 0.85 }}>{props.icon}</Box>
      </Stack>
    </Paper>
  )
}

export default function CeoOperationsSummaryCP() {
  const dispatch = useAppDispatch()
  const { summary, crmV2Total, crmV2Skipped, isLoading, error, crmError } = useAppSelector(
    (state: RootState) => state.ceoOperationsSummary
  )
  const [from, setFrom] = useState<Moment>(() => moment().subtract(29, "days").startOf("day"))
  const [to, setTo] = useState<Moment>(() => moment().endOf("day"))

  const dispatchFetch = useCallback(() => {
    const fromIso = from.clone().startOf("day").toISOString()
    const toDayStart = to.clone().startOf("day").toISOString()
    const crmToIso = to.clone().endOf("day").toISOString()
    void dispatch(fetchCeoOperationsSummaryThunk({ fromIso, toMonolithIso: toDayStart, crmToIso }))
  }, [dispatch, from, to])

  useEffect(() => {
    dispatchFetch()
    // Initial load only; range changes apply on "Actualizar".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyPreset = (preset: "7d" | "30d" | "mtd") => {
    const end = moment().endOf("day")
    if (preset === "7d") {
      setFrom(moment().subtract(6, "days").startOf("day"))
      setTo(end)
    } else if (preset === "30d") {
      setFrom(moment().subtract(29, "days").startOf("day"))
      setTo(end)
    } else {
      setFrom(moment().startOf("month"))
      setTo(end)
    }
  }

  const contractRate =
    summary !== null && summary.contractsSentTotal > 0
      ? Math.round((summary.contractsSignedTotal / summary.contractsSentTotal) * 1000) / 10
      : null

  const crmV2Display = crmV2Total !== null ? crmV2Total : crmV2Skipped ? "N/A" : "—"

  return (
    <Stack spacing={1.5} sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap spacing={1}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          Resumen operativo
        </Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center">
          <Chip size="small" label="7 días" onClick={() => applyPreset("7d")} sx={{ cursor: "pointer" }} />
          <Chip size="small" label="30 días" onClick={() => applyPreset("30d")} sx={{ cursor: "pointer" }} />
          <Chip size="small" label="Mes" onClick={() => applyPreset("mtd")} sx={{ cursor: "pointer" }} />
        </Stack>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ xs: "stretch", sm: "center" }}>
        <DatePicker
          label="Desde"
          value={from}
          onChange={(v) => v !== null && setFrom(v)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <DatePicker
          label="Hasta"
          value={to}
          onChange={(v) => v !== null && setTo(v)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => dispatchFetch()}
          disabled={isLoading}
          sx={{ cursor: "pointer", alignSelf: { xs: "stretch", sm: "center" } }}
        >
          {isLoading ? <CircularProgress size={20} color="inherit" /> : "Actualizar"}
        </Button>
      </Stack>
      {error !== null && (
        <Alert severity="error" onClose={() => dispatch(clearCeoOperationsSummaryErrorAct())}>
          {error}
        </Alert>
      )}
      {crmError !== null && (
        <Alert severity="warning" onClose={() => dispatch(clearCeoOperationsSummaryCrmErrorAct())}>
          {crmError}
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gap: 1.25,
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 160px), 1fr))",
        }}
      >
        <KpiCard
          title="Usuarios nuevos (rango)"
          value={summary?.usersCreatedInRangeTotal ?? "—"}
          subtitle="Altas en el rango (todos los niveles de cuenta)"
          icon={<PersonAddAltOutlined fontSize="small" />}
        />
        <KpiCard
          title="Ventores activos (nivel 4)"
          value={summary?.activeVentorsTotal ?? "—"}
          subtitle="Cuentas ventor habilitadas, sin fecha de salida (no depende del rango)"
          icon={<VerifiedOutlined fontSize="small" />}
        />
        <KpiCard title="Leads Meta" value={summary?.metaLeadsTotal ?? "—"} subtitle="Registros en rango" icon={<CampaignOutlined fontSize="small" />} />
        <KpiCard
          title="Usuarios únicos (leads)"
          value={summary?.metaLeadsDistinctUserTotal ?? "—"}
          subtitle="Distinct userId"
          icon={<GroupsOutlined fontSize="small" />}
        />
        <KpiCard
          title="Contratos enviados"
          value={summary?.contractsSentTotal ?? "—"}
          subtitle={
            summary !== null
              ? `Contratos firmados: ${summary.contractsSignedTotal}${contractRate !== null ? ` · ${contractRate}%` : ""}`
              : undefined
          }
          icon={<DescriptionOutlined fontSize="small" />}
        />
        <KpiCard title="Capacitaciones (asistentes)" value={summary?.trainingAttendeesTotal ?? "—"} subtitle="Filas en rango" icon={<SchoolOutlined fontSize="small" />} />
        <KpiCard title="Clientes CRM (V2)" value={crmV2Display} subtitle="Alta en customers-ms" icon={<GroupsOutlined fontSize="small" />} />
      </Box>
    </Stack>
  )
}
