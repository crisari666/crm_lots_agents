import React, { useMemo, useState } from "react"
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchProjectLotsThunk,
  setDrawerLotIdAct,
  updateProjectLotThunk
} from "../slice/lot-inventory.slice"
import { LotStatusChip } from "./lot-status-chip.cp"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotType } from "../types/lot-inventory.types"

function formatMoneyCop(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(n)
}

function formatHoldUntil(iso?: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short"
  })
}

function stageLabel(lot: ProjectLotType): string {
  return lot.stageName || (lot.stageKey === "default" || !lot.stageKey ? s.stageGeneral : lot.stageKey)
}

export default function LotInventoryTableCP() {
  const dispatch = useAppDispatch()
  const {
    lots,
    kindFilter,
    statusFilter,
    stageFilter,
    searchNumber,
    projectId,
    actionLoading
  } = useAppSelector((state: RootState) => state.lotInventory)
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null)
  const [areaDraft, setAreaDraft] = useState("")

  const visible = useMemo(() => {
    const q = searchNumber.trim().toLowerCase()
    return lots
      .filter((lot) => {
        if (lot.kind !== kindFilter) return false
        if (statusFilter !== "all" && lot.status !== statusFilter) return false
        if (stageFilter !== "all" && (lot.stageKey || "default") !== stageFilter) {
          return false
        }
        if (q && !lot.number.toLowerCase().includes(q)) return false
        return true
      })
      .slice()
      .sort((a, b) => {
        const orderDiff = (a.stageOrder ?? 0) - (b.stageOrder ?? 0)
        if (orderDiff !== 0) return orderDiff
        return parseInt(a.number, 10) - parseInt(b.number, 10)
      })
  }, [lots, kindFilter, statusFilter, stageFilter, searchNumber])

  const commitArea = async (lot: ProjectLotType) => {
    if (!projectId || editingAreaId !== lot._id) return
    const next = Number(areaDraft)
    setEditingAreaId(null)
    if (!Number.isFinite(next) || next < 0 || next === lot.area) return
    await dispatch(
      updateProjectLotThunk({
        projectId,
        lotId: lot._id,
        data: { area: next }
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
  }

  if (visible.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        {s.noLots}
      </Typography>
    )
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{s.colNumber}</TableCell>
            <TableCell>{s.colStage}</TableCell>
            <TableCell>{s.colArea}</TableCell>
            <TableCell>{s.colPrice}</TableCell>
            <TableCell>{s.colStatus}</TableCell>
            <TableCell>{s.colVentor}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visible.map((lot) => (
            <TableRow
              key={lot._id}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => dispatch(setDrawerLotIdAct(lot._id))}
            >
              <TableCell>
                <Typography fontWeight={600}>{lot.number}</Typography>
              </TableCell>
              <TableCell>{stageLabel(lot)}</TableCell>
              <TableCell
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingAreaId(lot._id)
                  setAreaDraft(String(lot.area))
                }}
              >
                {editingAreaId === lot._id ? (
                  <TextField
                    size="small"
                    type="number"
                    value={areaDraft}
                    autoFocus
                    disabled={actionLoading}
                    onChange={(e) => setAreaDraft(e.target.value)}
                    onBlur={() => void commitArea(lot)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") void commitArea(lot)
                    }}
                    sx={{ width: 100 }}
                  />
                ) : (
                  lot.area
                )}
              </TableCell>
              <TableCell>{formatMoneyCop(lot.price)}</TableCell>
              <TableCell>
                <Stack spacing={0.25}>
                  <LotStatusChip status={lot.status} />
                  {lot.status === "hold" && lot.holdUntil ? (
                    <Typography variant="caption" color="text.secondary">
                      {s.colHoldUntil}: {formatHoldUntil(lot.holdUntil)}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell>{lot.ventorName || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
