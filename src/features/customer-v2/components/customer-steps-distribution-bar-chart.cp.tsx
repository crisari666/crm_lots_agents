import React, { useMemo } from "react"
import { useTheme } from "@mui/material/styles"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { CustomerStepDistributionItem } from "../services/customers-ms.service"

export type CustomerStepsDistributionBarChartCPProps = {
  rows: CustomerStepDistributionItem[]
}

const MAX_LABEL_CHARS = 34

function truncateLabel(name: string): string {
  const t = name.trim()
  if (t.length <= MAX_LABEL_CHARS) {
    return t
  }
  return `${t.slice(0, MAX_LABEL_CHARS - 1)}…`
}

export default function CustomerStepsDistributionBarChartCP({
  rows,
}: CustomerStepsDistributionBarChartCPProps) {
  const theme = useTheme()
  const fallbackFill = theme.palette.primary.main

  const data = useMemo(
    () =>
      [...rows]
        .sort((a, b) => b.count - a.count)
        .map((r) => ({
          key: r.customerStepId ?? "__none__",
          name: truncateLabel(r.name),
          fullName: r.name,
          count: r.count,
          fill: r.color?.trim() ? r.color.trim() : fallbackFill,
        })),
    [rows, fallbackFill]
  )

  const chartHeight = Math.min(720, Math.max(280, 48 + data.length * 44))

  if (data.length === 0) {
    return null
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const xDomainMax = Math.ceil(maxCount * 1.12)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 12, right: 56, left: 8, bottom: 12 }}
        barCategoryGap="18%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal />
        <XAxis
          type="number"
          domain={[0, xDomainMax]}
          tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={200}
          tick={{ fontSize: 12, fill: theme.palette.text.primary }}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: theme.palette.action.hover }}
          formatter={(value: number) => [`${value}`, "Clientes"]}
          labelFormatter={(_, payload) => {
            const row = payload?.[0]?.payload as { fullName?: string } | undefined
            return row?.fullName ?? ""
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} isAnimationActive={false} maxBarSize={32}>
          <LabelList
            dataKey="count"
            position="right"
            style={{
              fill: theme.palette.text.primary,
              fontSize: 12,
              fontWeight: 600,
            }}
          />
          {data.map((d) => (
            <Cell key={d.key} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
