import { Box, Paper, Typography } from "@mui/material"
import { PieChart } from "@mui/x-charts/PieChart"
import { onboardingStatusFilterI18n, usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import type { OnboardingStateType, OnboardingStatusType } from "../types/onboarding-state.types"

type UsersOnboardingStatusPieChartCPProps = {
  items: OnboardingStateType[]
}

type PieSliceType = {
  id: string
  value: number
  label: string
}

function buildStatusCounts(items: OnboardingStateType[]): PieSliceType[] {
  const counts = new Map<string, number>()

  items.forEach((item) => {
    const current = counts.get(item.status) ?? 0
    counts.set(item.status, current + 1)
  })

  return Array.from(counts.entries())
    .map(([status, value]) => {
      const localized = onboardingStatusFilterI18n[status as OnboardingStatusType]
      return {
        id: status,
        value,
        label: localized?.title ?? status
      }
    })
    .sort((a, b) => b.value - a.value)
}

export default function UsersOnboardingStatusPieChartCP({
  items
}: UsersOnboardingStatusPieChartCPProps) {
  const data = buildStatusCounts(items)

  if (data.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">{s.statusChartTitle}</Typography>
        <Typography variant="body2" color="text.secondary">
          {s.statusChartNoData}
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {s.statusChartTitle}
      </Typography>
      <Box sx={{ width: "100%", height: 300 }}>
        <PieChart
          series={[
            {
              data,
              highlightScope: { faded: "global", highlighted: "item" },
              faded: { innerRadius: 25, additionalRadius: -10, color: "gray" },
              innerRadius: 40,
              outerRadius: 100,
              paddingAngle: 1
            }
          ]}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" }
            }
          }}
        />
      </Box>
    </Paper>
  )
}
