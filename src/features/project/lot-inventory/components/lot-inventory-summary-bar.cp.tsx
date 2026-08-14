import React, { useMemo } from "react"
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import { setKindFilterAct } from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { LotStatusSummary, ProjectLotKind } from "../types/lot-inventory.types"

function KpiCard({
  label,
  value,
  color
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <Card variant="outlined" sx={{ flex: 1, minWidth: 120, borderColor: color }}>
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function LotInventorySummaryBarCP() {
  const dispatch = useAppDispatch()
  const { summary, kindFilter } = useAppSelector(
    (state: RootState) => state.lotInventory
  )
  const active: LotStatusSummary = summary[kindFilter]
  const pctSold = useMemo(() => {
    if (!active.total) return 0
    return Math.round((active.sold / active.total) * 100)
  }, [active])

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 5,
        bgcolor: "background.paper",
        py: 1.5,
        mb: 2,
        borderBottom: 1,
        borderColor: "divider"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={kindFilter}
          onChange={(_e, value: ProjectLotKind | null) => {
            if (value) dispatch(setKindFilterAct(value))
          }}
        >
          <ToggleButton value="lot">{s.kindLots}</ToggleButton>
          <ToggleButton value="commercial">{s.kindCommercial}</ToggleButton>
        </ToggleButtonGroup>
        <Typography variant="body2" color="text.secondary">
          {s.pctSold}: <strong>{pctSold}%</strong> ({active.sold}/{active.total})
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <KpiCard label={s.statusAvailable} value={active.available} color="#059669" />
        <KpiCard label={s.statusHold} value={active.hold} color="#D97706" />
        <KpiCard label={s.statusLocked} value={active.locked} color="#475569" />
        <KpiCard label={s.statusSold} value={active.sold} color="#E11D48" />
      </Box>
    </Box>
  )
}
