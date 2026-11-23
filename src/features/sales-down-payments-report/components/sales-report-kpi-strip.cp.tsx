import { Box, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material"
import type { SalesReportSummary } from "../../customer-v2/services/customer-payments-ms.types"
import { salesDownPaymentsReportStrings as s } from "../../../i18n/locales/sales-down-payments-report.strings"

export type SalesReportKpiStripProps = {
  readonly summary: SalesReportSummary | null
  readonly isLoading: boolean
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  })
}

type KpiItem = {
  readonly label: string
  readonly value: string
  readonly emphasize?: boolean
}

/**
 * KPI strip for sales report summary metrics.
 */
export default function SalesReportKpiStripCP(props: SalesReportKpiStripProps) {
  const { summary, isLoading } = props
  const items: KpiItem[] = summary
    ? [
        { label: s.kpiSales, value: String(summary.salesCount), emphasize: true },
        { label: s.kpiCompleted, value: String(summary.completedCount) },
        { label: s.kpiExpected, value: formatCurrency(summary.totalExpected) },
        { label: s.kpiPaid, value: formatCurrency(summary.totalPaid), emphasize: true },
        { label: s.kpiRemaining, value: formatCurrency(summary.totalRemaining) },
        {
          label: s.kpiCompletion,
          value: `${summary.completionRate.toLocaleString("es-CO", {
            maximumFractionDigits: 1,
          })}%`,
        },
      ]
    : []
  if (isLoading && !summary) {
    return (
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} variant="outlined" sx={{ borderRadius: 2, minWidth: 140, flex: 1 }}>
            <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
              <Skeleton width="60%" height={16} />
              <Skeleton width="80%" height={28} sx={{ mt: 0.5 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    )
  }
  if (!summary) {
    return null
  }
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" useFlexGap>
      {items.map((item) => (
        <Card
          key={item.label}
          variant="outlined"
          sx={{
            borderRadius: 2,
            minWidth: 140,
            flex: 1,
            transition: "border-color 180ms ease, box-shadow 180ms ease",
            "&:hover": {
              borderColor: "primary.light",
              boxShadow: "0 1px 6px rgba(15, 23, 42, 0.06)",
            },
          }}
        >
          <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              {item.label}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Typography
                variant="h6"
                fontWeight={item.emphasize ? 700 : 600}
                sx={{ letterSpacing: -0.3, lineHeight: 1.2 }}
              >
                {item.value}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}
