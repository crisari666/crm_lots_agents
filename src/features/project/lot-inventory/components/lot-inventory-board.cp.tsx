import React, { useMemo } from "react"
import { Box, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  setDrawerLotIdAct,
  toggleLotSelectedAct
} from "../slice/lot-inventory.slice"
import { getBoardTileSx } from "./lot-status-chip.cp"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotType } from "../types/lot-inventory.types"

function filterLots(
  lots: ProjectLotType[],
  kindFilter: string,
  statusFilter: string,
  searchNumber: string
): ProjectLotType[] {
  const q = searchNumber.trim().toLowerCase()
  return lots.filter((lot) => {
    if (lot.kind !== kindFilter) return false
    if (statusFilter !== "all" && lot.status !== statusFilter) return false
    if (q && !lot.number.toLowerCase().includes(q)) return false
    return true
  })
}

export default function LotInventoryBoardCP() {
  const dispatch = useAppDispatch()
  const { lots, kindFilter, statusFilter, searchNumber, selectedLotIds } =
    useAppSelector((state: RootState) => state.lotInventory)

  const visible = useMemo(
    () => filterLots(lots, kindFilter, statusFilter, searchNumber),
    [lots, kindFilter, statusFilter, searchNumber]
  )

  if (visible.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        {s.noLots}
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
        gap: 1
      }}
    >
      {visible.map((lot) => {
        const selected = selectedLotIds.includes(lot._id)
        return (
          <Box
            key={lot._id}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || selectedLotIds.length > 0) {
                dispatch(toggleLotSelectedAct(lot._id))
                return
              }
              dispatch(setDrawerLotIdAct(lot._id))
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                dispatch(setDrawerLotIdAct(lot._id))
              }
            }}
            sx={{
              ...getBoardTileSx(lot.status),
              borderRadius: 1.5,
              minHeight: 56,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              outline: selected ? "3px solid #2563EB" : "none",
              outlineOffset: 1
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} lineHeight={1.1}>
              {lot.number}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {Math.round(lot.area)}m²
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}
