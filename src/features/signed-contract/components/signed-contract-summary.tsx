import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import type { SignedContractSignStatusFilter } from "../types/signed-contract.types"
import { buildSignedContractDisplayRows } from "../utils/build-signed-contract-display-rows"

function filterLabel(filter: SignedContractSignStatusFilter): string {
  if (filter === "signed") {
    return "Firmados"
  }
  if (filter === "unsigned") {
    return "Sin firmar"
  }
  return "Todos"
}

function StatItem({
  label,
  value,
}: {
  readonly label: string
  readonly value: number
}) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        display="block"
        lineHeight={1.2}
      >
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} lineHeight={1.3}>
        {value}
      </Typography>
    </Box>
  )
}

export default function SignedContractSummary() {
  const { items, groupRepeatedByEmail, signStatusFilter } = useAppSelector(
    (state: RootState) => state.signedContract,
  )
  const stats = useMemo(() => {
    const displayRows = buildSignedContractDisplayRows({
      items,
      signStatusFilter,
      groupRepeatedByEmail,
    })
    const signedCount = displayRows.filter((row) => row.signed).length
    const pendingCount = displayRows.length - signedCount
    if (groupRepeatedByEmail) {
      const totalSends = displayRows.reduce(
        (sum, row) => sum + (row.sendCount ?? 1),
        0,
      )
      return {
        displayRows,
        signedCount,
        pendingCount,
        uniqueEmails: displayRows.length,
        totalSends,
        isGrouped: true as const,
      }
    }
    return {
      displayRows,
      signedCount,
      pendingCount,
      rowCount: displayRows.length,
      isGrouped: false as const,
    }
  }, [items, groupRepeatedByEmail, signStatusFilter])
  if (stats.displayRows.length === 0) {
    return null
  }
  return (
    <Paper
      variant="outlined"
      sx={{
        px: 1.25,
        py: 0.75,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.25,
          rowGap: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.25 }}>
          Resumen · {filterLabel(signStatusFilter)}
        </Typography>
        <Divider orientation="vertical" flexItem sx={{ my: 0.25 }} />
        {stats.isGrouped ? (
          <>
            <StatItem label="Emails" value={stats.uniqueEmails} />
            <StatItem label="Envíos" value={stats.totalSends} />
          </>
        ) : (
          <StatItem label="Filas" value={stats.rowCount} />
        )}
        <StatItem label="Firmados" value={stats.signedCount} />
        <StatItem label="Pendientes" value={stats.pendingCount} />
      </Box>
    </Paper>
  )
}
