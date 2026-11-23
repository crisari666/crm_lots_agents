import { useMemo } from "react"
import {
  Card,
  CardContent,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type {
  SalesReportByAgentItem,
  SalesReportByDayItem,
  SalesReportByProjectItem,
} from "../../customer-v2/services/customer-payments-ms.types"
import { salesDownPaymentsReportStrings as s } from "../../../i18n/locales/sales-down-payments-report.strings"

export type SalesReportChartsProps = {
  readonly byAgent: SalesReportByAgentItem[]
  readonly byDay: SalesReportByDayItem[]
  readonly byProject: SalesReportByProjectItem[]
  readonly resolveAgentName: (userId: string) => string
  readonly resolveProjectName: (projectId: string, fallback?: string) => string
}

function formatCurrencyShort(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    notation: "compact",
    maximumFractionDigits: 1,
  })
}

/**
 * Agent ranking, daily trend, and project comparison charts.
 */
export default function SalesReportChartsCP(props: SalesReportChartsProps) {
  const { byAgent, byDay, byProject, resolveAgentName, resolveProjectName } = props
  const theme = useTheme()
  const isNarrow = useMediaQuery(theme.breakpoints.down("md"))
  const agentData = useMemo(
    () =>
      byAgent.slice(0, 12).map((row) => ({
        name: resolveAgentName(row.recordedBy),
        salesCount: row.salesCount,
        totalPaid: row.totalPaid,
      })),
    [byAgent, resolveAgentName],
  )
  const dayData = useMemo(
    () =>
      byDay.map((row) => ({
        date: row.date,
        salesCount: row.salesCount,
        totalPaid: row.totalPaid,
        totalExpected: row.totalExpected,
      })),
    [byDay],
  )
  const projectData = useMemo(
    () =>
      byProject.slice(0, 10).map((row) => ({
        name: resolveProjectName(row.projectId, row.projectName),
        salesCount: row.salesCount,
        totalPaid: row.totalPaid,
      })),
    [byProject, resolveProjectName],
  )
  if (agentData.length === 0 && dayData.length === 0 && projectData.length === 0) {
    return null
  }
  const chartHeight = isNarrow ? 220 : 280
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        {agentData.length > 0 && (
          <Card variant="outlined" sx={{ borderRadius: 2, flex: 1, minWidth: 0 }}>
            <CardContent sx={{ pt: 2, pb: 1, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {s.chartByAgent}
              </Typography>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  layout="vertical"
                  data={agentData}
                  margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={isNarrow ? 88 : 120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) =>
                      name === "totalPaid"
                        ? [formatCurrencyShort(value), s.chartPaid]
                        : [value, s.chartSalesCount]
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="salesCount"
                    name={s.chartSalesCount}
                    fill={theme.palette.primary.main}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
        {dayData.length > 0 && (
          <Card variant="outlined" sx={{ borderRadius: 2, flex: 1, minWidth: 0 }}>
            <CardContent sx={{ pt: 2, pb: 1, "&:last-child": { pb: 1.5 } }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {s.chartByDay}
              </Typography>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={dayData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" allowDecimals={false} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrencyShort} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "totalPaid" || name === "totalExpected") {
                        return [
                          formatCurrencyShort(value),
                          name === "totalPaid" ? s.chartPaid : s.chartExpected,
                        ]
                      }
                      return [value, s.chartSalesCount]
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="salesCount"
                    name={s.chartSalesCount}
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="totalPaid"
                    name={s.chartPaid}
                    stroke={theme.palette.success.main}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Stack>
      {projectData.length > 0 && (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ pt: 2, pb: 1, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              {s.chartByProject}
            </Typography>
            <ResponsiveContainer width="100%" height={isNarrow ? 200 : 240}>
              <BarChart data={projectData} margin={{ top: 8, right: 16, left: 8, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={isNarrow ? -25 : 0}
                  textAnchor={isNarrow ? "end" : "middle"}
                  height={isNarrow ? 60 : 40}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number, name: string) =>
                    name === "totalPaid"
                      ? [formatCurrencyShort(value), s.chartPaid]
                      : [value, s.chartSalesCount]
                  }
                />
                <Legend />
                <Bar
                  dataKey="salesCount"
                  name={s.chartSalesCount}
                  fill={theme.palette.info.main}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
