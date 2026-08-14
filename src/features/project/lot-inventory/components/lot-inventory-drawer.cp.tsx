import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  fetchProjectLotsThunk,
  setDrawerLotIdAct,
  updateProjectLotThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotStatus } from "../types/lot-inventory.types"
import { getStatusLabel } from "./lot-status-chip.cp"

const STATUSES: ProjectLotStatus[] = ["available", "hold", "locked", "sold"]

export default function LotInventoryDrawerCP() {
  const dispatch = useAppDispatch()
  const { lots, drawerLotId, projectId, actionLoading } = useAppSelector(
    (state: RootState) => state.lotInventory
  )
  const lot = lots.find((l) => l._id === drawerLotId) ?? null
  const [area, setArea] = useState("")
  const [price, setPrice] = useState("")
  const [ventorName, setVentorName] = useState("")
  const [soldBy, setSoldBy] = useState("")
  const [status, setStatus] = useState<ProjectLotStatus>("available")

  useEffect(() => {
    if (!lot) return
    setArea(String(lot.area))
    setPrice(String(lot.price))
    setVentorName(lot.ventorName ?? "")
    setSoldBy(lot.soldBy ?? "")
    setStatus(lot.status)
  }, [lot])

  const close = () => dispatch(setDrawerLotIdAct(null))

  const save = async () => {
    if (!lot || !projectId) return
    await dispatch(
      updateProjectLotThunk({
        projectId,
        lotId: lot._id,
        data: {
          area: Number(area),
          price: Number(price),
          ventorName,
          soldBy,
          status
        }
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
    close()
  }

  return (
    <Drawer anchor="right" open={Boolean(lot)} onClose={close}>
      <Box sx={{ width: { xs: 320, sm: 380 }, p: 2.5 }} role="presentation">
        {lot && (
          <Stack spacing={2}>
            <Typography variant="h6">
              {s.drawerTitle} {lot.number}
            </Typography>
            <Divider />
            <Typography variant="subtitle2">{s.colStatus}</Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={status}
              onChange={(_e, value: ProjectLotStatus | null) => {
                if (value) setStatus(value)
              }}
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              {STATUSES.map((st) => (
                <ToggleButton key={st} value={st} sx={{ textTransform: "none" }}>
                  {getStatusLabel(st)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <TextField
              label={s.fieldArea}
              type="number"
              size="small"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              fullWidth
            />
            <TextField
              label={s.fieldPrice}
              type="number"
              size="small"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
            <TextField
              label={s.fieldVentor}
              size="small"
              value={ventorName}
              onChange={(e) => setVentorName(e.target.value)}
              fullWidth
            />
            <TextField
              label={s.fieldSoldBy}
              size="small"
              value={soldBy}
              onChange={(e) => setSoldBy(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => void save()}
              disabled={actionLoading}
            >
              {s.drawerSave}
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  )
}
