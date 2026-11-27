import { useEffect } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { leadConversationsStrings as s } from "../../../i18n/locales/lead-conversations.strings"
import {
  fetchLeadConversationStatsThunk,
  setLeadConversationStatsRangeAct,
} from "../slice/lead-conversations.slice"
import type {
  LeadConversationStatsBucket,
  LeadConversationStep,
} from "../types/lead-conversations.types"

type PieSlice = {
  id: string
  value: number
  label: string
}

function resolveStepLabel(key: string): string {
  return s.step[key as LeadConversationStep] ?? s.stepUnknown
}

function resolveTemperatureLabel(key: string): string {
  if (key === "unset") return s.temperatureUnset
  if (key === "hot" || key === "warm" || key === "cold") return s.temperature[key]
  return key
}

function buildPieSlices(buckets: readonly LeadConversationStatsBucket[]): PieSlice[] {
  return buckets
    .filter((bucket) => bucket.count > 0)
    .map((bucket) => ({
      id: bucket.key,
      value: bucket.count,
      label: resolveTemperatureLabel(bucket.key),
    }))
}

export default function LeadConversationsStatsCP() {
  const dispatch = useAppDispatch()
  const { statsDateFrom, statsDateTo, stats, statsLoading, statsError } = useAppSelector(
    (state) => state.leadConversations
  )

  useEffect(() => {
    void dispatch(fetchLeadConversationStatsThunk())
  }, [dispatch, statsDateFrom, statsDateTo])

  const stepLabels = (stats?.byStep ?? []).map((bucket) => resolveStepLabel(bucket.key))
  const stepValues = (stats?.byStep ?? []).map((bucket) => bucket.count)
  const temperatureSlices = buildPieSlices(stats?.byTemperature ?? [])
  const barHeight = Math.min(420, Math.max(220, 48 + stepLabels.length * 36))
  const hasData = (stats?.total ?? 0) > 0

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {s.statsDateLabel}
          </Typography>
          {stats && !statsLoading ? (
            <Typography variant="caption" color="text.secondary">
              {s.statsTotal(stats.total)}
            </Typography>
          ) : null}
        </Box>
        <Box sx={{ minWidth: { xs: "100%", sm: 280 }, maxWidth: 360 }}>
          <AppDateRangeSelector
            id="lead-conversations-stats-range"
            dateStart={new Date(statsDateFrom)}
            dateEnd={new Date(statsDateTo)}
            onChange={({ dateStart, dateEnd }) => {
              dispatch(
                setLeadConversationStatsRangeAct({
                  statsDateFrom: dateStart.toISOString(),
                  statsDateTo: dateEnd.toISOString(),
                })
              )
            }}
          />
        </Box>
      </Stack>

      {statsLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : null}

      {statsError && !statsLoading ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void dispatch(fetchLeadConversationStatsThunk())}>
              {s.retry}
            </Button>
          }
          sx={{ mb: 1 }}
        >
          {statsError}
        </Alert>
      ) : null}

      {!statsLoading && !statsError && !hasData ? (
        <Typography variant="body2" color="text.secondary">
          {s.statsEmpty}
        </Typography>
      ) : null}

      {!statsLoading && hasData ? (
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <Paper variant="outlined" sx={{ flex: 1, p: 2, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {s.statsStepTitle}
            </Typography>
            <Box sx={{ width: "100%", height: barHeight }}>
              <BarChart
                layout="horizontal"
                yAxis={[{ scaleType: "band", data: stepLabels }]}
                series={[{ data: stepValues, label: s.colStep }]}
                margin={{ top: 10, right: 24, bottom: 24, left: 140 }}
                slotProps={{ legend: { hidden: true } }}
              />
            </Box>
          </Paper>
          <Paper variant="outlined" sx={{ flex: 1, p: 2, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {s.statsTemperatureTitle}
            </Typography>
            {temperatureSlices.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {s.statsEmpty}
              </Typography>
            ) : (
              <Box sx={{ width: "100%", height: 300 }}>
                <PieChart
                  series={[
                    {
                      data: temperatureSlices,
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 25, additionalRadius: -10, color: "gray" },
                      innerRadius: 40,
                      outerRadius: 100,
                      paddingAngle: 1,
                    },
                  ]}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "bottom", horizontal: "middle" },
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Stack>
      ) : null}
    </Paper>
  )
}
