import { useEffect, useMemo, useState } from "react"
import { Alert, Box, CircularProgress, Dialog, DialogContent, DialogTitle, Paper, Typography } from "@mui/material"
import { BarChart } from "@mui/x-charts/BarChart"
import { getOnboardingStatsByLogStatusReq } from "../services/onboarding-state.service"
import { onboardingStatusFilterI18n, usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import type { OnboardingStatusType } from "../types/onboarding-state.types"

type UsersOnboardingStatusLogStatsDialogCPProps = {
  open: boolean
  onClose: () => void
  statuses: OnboardingStatusType[]
  lastUpdateFrom: string
  lastUpdateTo: string
}

type StatRowType = {
  status: string | null
  count: number
}

const normalizeStatusLabel = (status: string | null) => {
  const trimmed = status?.trim() ?? ""
  if (trimmed === "") return s.statusWithoutLogs
  const localized = onboardingStatusFilterI18n[trimmed as OnboardingStatusType]
  return localized?.title ?? trimmed
}

export default function UsersOnboardingStatusLogStatsDialogCP({
  open,
  onClose,
  statuses,
  lastUpdateFrom,
  lastUpdateTo
}: UsersOnboardingStatusLogStatsDialogCPProps) {
  const [rows, setRows] = useState<StatRowType[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    let mounted = true
    setIsLoading(true)
    setError(null)
    getOnboardingStatsByLogStatusReq({ statuses, lastUpdateFrom, lastUpdateTo })
      .then((result) => {
        if (!mounted) return
        setRows(result.statusStats)
        setTotalRecords(result.totalRecords)
      })
      .catch((e: unknown) => {
        if (!mounted) return
        setError(e instanceof Error ? e.message : s.errorGeneric)
      })
      .finally(() => {
        if (!mounted) return
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [open, statuses, lastUpdateFrom, lastUpdateTo])

  const sortedRows = useMemo(() => [...rows].sort((a, b) => b.count - a.count), [rows])
  const xLabels = useMemo(() => sortedRows.map((x) => normalizeStatusLabel(x.status)), [sortedRows])
  const yValues = useMemo(() => sortedRows.map((x) => x.count), [sortedRows])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{s.logStatusStatsChartDialogTitle}</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress size={28} />
          </Box>
        ) : null}
        {!isLoading && error != null ? <Alert severity="error">{error}</Alert> : null}
        {!isLoading && error == null ? (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              {s.logStatusStatsTotalRecords(totalRecords)}
            </Typography>
            {sortedRows.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {s.statusChartNoData}
              </Typography>
            ) : (
              <Box sx={{ width: "100%", height: 420 }}>
                <BarChart
                  xAxis={[
                    {
                      id: "statuses",
                      scaleType: "band",
                      data: xLabels
                    }
                  ]}
                  series={[
                    {
                      data: yValues,
                      label: s.logStatusStatsBarLabel
                    }
                  ]}
                  margin={{ top: 20, right: 20, bottom: 120, left: 60 }}
                />
              </Box>
            )}
          </Paper>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
