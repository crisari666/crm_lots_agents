import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import BarChartIcon from "@mui/icons-material/BarChart"
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

type LabeledCount = {
  key: string
  label: string
  count: number
}

function resolveStepLabel(key: string): string {
  return s.step[key as LeadConversationStep] ?? s.stepUnknown
}

function resolveTemperatureLabel(key: string): string {
  if (key === "unset") return s.temperatureUnset
  if (key === "hot" || key === "warm" || key === "cold") return s.temperature[key]
  return key
}

function buildStepCounts(buckets: readonly LeadConversationStatsBucket[]): LabeledCount[] {
  return buckets.map((bucket) => ({
    key: bucket.key,
    label: resolveStepLabel(bucket.key),
    count: bucket.count,
  }))
}

function buildTemperatureCounts(buckets: readonly LeadConversationStatsBucket[]): LabeledCount[] {
  return buckets
    .filter((bucket) => bucket.count > 0)
    .map((bucket) => ({
      key: bucket.key,
      label: resolveTemperatureLabel(bucket.key),
      count: bucket.count,
    }))
}

function buildPieSlices(rows: readonly LabeledCount[]): PieSlice[] {
  return rows.map((row) => ({
    id: row.key,
    value: row.count,
    label: s.statsBucketCount(row.label, row.count),
  }))
}

function StatsResumeList({ rows }: { rows: readonly LabeledCount[] }) {
  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {s.statsResumeTitle}
      </Typography>
      <List dense disablePadding>
        {rows.map((row) => (
          <ListItem key={row.key} disableGutters sx={{ py: 0 }}>
            <ListItemText
              primary={s.statsBucketCount(row.label, row.count)}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default function LeadConversationsStatsCP() {
  const dispatch = useAppDispatch()
  const [isOpen, setIsOpen] = useState(false)
  const { statsDateFrom, statsDateTo, stats, statsLoading, statsError } = useAppSelector(
    (state) => state.leadConversations
  )

  useEffect(() => {
    if (!isOpen) return
    void dispatch(fetchLeadConversationStatsThunk())
  }, [dispatch, isOpen, statsDateFrom, statsDateTo])

  const stepCounts = buildStepCounts(stats?.byStep ?? [])
  const temperatureCounts = buildTemperatureCounts(stats?.byTemperature ?? [])
  const stepLabels = stepCounts.map((row) => row.label)
  const stepValues = stepCounts.map((row) => row.count)
  const temperatureSlices = buildPieSlices(temperatureCounts)
  const barHeight = Math.min(420, Math.max(220, 48 + stepLabels.length * 36))
  const hasData = (stats?.total ?? 0) > 0

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<BarChartIcon />}
        onClick={() => setIsOpen(true)}
        sx={{ mb: 2 }}
      >
        {s.statsOpenButton}
      </Button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{s.statsDialogTitle}</DialogTitle>
        <DialogContent dividers>
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
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => void dispatch(fetchLeadConversationStatsThunk())}
                >
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
                    series={[
                      {
                        data: stepValues,
                        label: s.colStep,
                        valueFormatter: (value) => (value == null ? "" : String(value)),
                      },
                    ]}
                    margin={{ top: 10, right: 40, bottom: 24, left: 140 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
                <StatsResumeList rows={stepCounts} />
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
                  <>
                    <Box sx={{ width: "100%", height: 300 }}>
                      <PieChart
                        series={[
                          {
                            data: temperatureSlices,
                            arcLabel: "value",
                            arcLabelMinAngle: 12,
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
                    <StatsResumeList rows={temperatureCounts} />
                  </>
                )}
              </Paper>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
