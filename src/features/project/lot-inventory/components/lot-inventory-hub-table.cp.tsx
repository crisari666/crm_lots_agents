import React, { useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material"
import { OpenInNew as OpenIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchLotInventoryHubThunk,
  setHubSearchAct
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { LotStatusSummary } from "../types/lot-inventory.types"
import ProjectStockPublicLinkCP from "../../components/project-stock-public-link.cp"

function SummaryChips({ summary }: { summary: LotStatusSummary }) {
  return (
    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
      <Chip size="small" color="success" label={`${s.statusAvailable}: ${summary.available}`} />
      <Chip size="small" color="warning" label={`${s.statusHold}: ${summary.hold}`} />
      <Chip size="small" variant="outlined" label={`${s.statusLocked}: ${summary.locked}`} />
      <Chip size="small" color="error" label={`${s.statusSold}: ${summary.sold}`} />
    </Box>
  )
}

export default function LotInventoryHubTableCP() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { hubRows, hubLoading, hubError, hubSearch } = useAppSelector(
    (state: RootState) => state.lotInventory
  )

  useEffect(() => {
    void dispatch(fetchLotInventoryHubThunk())
  }, [dispatch])

  const filtered = useMemo(() => {
    const q = hubSearch.trim().toLowerCase()
    if (!q) return hubRows
    return hubRows.filter((row) => row.title.toLowerCase().includes(q))
  }, [hubRows, hubSearch])

  if (hubError) {
    return <Alert severity="error">{hubError}</Alert>
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Typography variant="h4" component="h1">
          {s.hubTitle}
        </Typography>
        <TextField
          size="small"
          placeholder={s.hubSearchPlaceholder}
          value={hubSearch}
          onChange={(e) => dispatch(setHubSearchAct(e.target.value))}
          sx={{ minWidth: 240 }}
        />
      </Box>
      {hubLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{s.hubColProject}</TableCell>
                <TableCell>{s.hubPublicStock}</TableCell>
                <TableCell>{s.hubColLotsAvailable}</TableCell>
                <TableCell>{s.hubColCommercialAvailable}</TableCell>
                <TableCell>{s.hubColSummary}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography color="text.secondary">{s.hubEmpty}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow
                    key={row.projectId}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(`/dashboard/lot-inventory/${row.projectId}`)
                    }
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{row.title}</Typography>
                      {!row.enabled && (
                        <Chip size="small" label="Disabled" sx={{ mt: 0.5 }} />
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <ProjectStockPublicLinkCP projectId={row.projectId} />
                    </TableCell>
                    <TableCell>
                      {row.summary.lot.available} / {row.summary.lot.total || row.nLots}
                    </TableCell>
                    <TableCell>
                      {row.summary.commercial.available} /{" "}
                      {row.summary.commercial.total || row.nCommercialSpaces}
                    </TableCell>
                    <TableCell>
                      <SummaryChips summary={row.summary.lot} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label={s.hubOpen}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/dashboard/lot-inventory/${row.projectId}`)
                        }}
                      >
                        <OpenIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
