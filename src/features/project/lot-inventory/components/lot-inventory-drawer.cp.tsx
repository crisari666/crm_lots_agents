import React, { useEffect, useMemo, useState } from "react"
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
  fetchLotsMapThunk,
  fetchProjectLotsThunk,
  setDrawerLotIdAct,
  updateProjectLotThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotStatus } from "../types/lot-inventory.types"
import { getStatusLabel } from "./lot-status-chip.cp"

const STATUSES: ProjectLotStatus[] = ["available", "hold", "locked", "sold"]

function toDatetimeLocalValue(isoOrDate: string | Date): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function defaultHoldUntilLocal(): string {
  return toDatetimeLocalValue(new Date(Date.now() + 24 * 60 * 60 * 1000))
}

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
  const [holdUntilLocal, setHoldUntilLocal] = useState("")

  useEffect(() => {
    if (!lot) return
    setArea(String(lot.area))
    setPrice(String(lot.price))
    setVentorName(lot.ventorName ?? "")
    setSoldBy(lot.soldBy ?? "")
    setStatus(lot.status)
    if (lot.status === "hold" && lot.holdUntil) {
      setHoldUntilLocal(toDatetimeLocalValue(lot.holdUntil))
    } else if (lot.status === "hold") {
      setHoldUntilLocal(defaultHoldUntilLocal())
    } else {
      setHoldUntilLocal("")
    }
  }, [lot])

  const holdUntilError = useMemo(() => {
    if (status !== "hold") return null
    if (!holdUntilLocal.trim()) return s.holdUntilRequired
    const parsed = new Date(holdUntilLocal)
    if (Number.isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
      return s.holdUntilPast
    }
    return null
  }, [status, holdUntilLocal])

  const close = () => dispatch(setDrawerLotIdAct(null))

  const handleStatusChange = (_e: React.MouseEvent, value: ProjectLotStatus | null) => {
    if (!value) return
    setStatus(value)
    if (value === "hold") {
      setHoldUntilLocal((current) => current || defaultHoldUntilLocal())
    }
  }

  const save = async () => {
    if (!lot || !projectId) return
    if (status === "hold" && holdUntilError) return
    const data: {
      area: number
      price: number
      ventorName: string
      soldBy: string
      status: ProjectLotStatus
      holdUntil?: string | null
    } = {
      area: Number(area),
      price: Number(price),
      ventorName,
      soldBy,
      status
    }
    if (status === "hold") {
      data.holdUntil = new Date(holdUntilLocal).toISOString()
    } else {
      data.holdUntil = null
    }
    await dispatch(
      updateProjectLotThunk({
        projectId,
        lotId: lot._id,
        data
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
    void dispatch(fetchLotsMapThunk(projectId))
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
            <Typography variant="body2" color="text.secondary">
              {s.fieldStage}:{" "}
              {lot.stageName ||
                (lot.stageKey === "default" || !lot.stageKey
                  ? s.stageGeneral
                  : lot.stageKey)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.fieldStageReadOnly}
            </Typography>
            <Divider />
            <Typography variant="subtitle2">{s.colStatus}</Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={status}
              onChange={handleStatusChange}
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              {STATUSES.map((st) => (
                <ToggleButton key={st} value={st} sx={{ textTransform: "none" }}>
                  {getStatusLabel(st)}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {status === "hold" ? (
              <TextField
                label={s.fieldHoldUntil}
                type="datetime-local"
                size="small"
                value={holdUntilLocal}
                onChange={(e) => setHoldUntilLocal(e.target.value)}
                fullWidth
                required
                error={Boolean(holdUntilError)}
                helperText={holdUntilError ?? s.fieldHoldUntilHelper}
                InputLabelProps={{ shrink: true }}
              />
            ) : null}
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
              disabled={actionLoading || Boolean(holdUntilError)}
            >
              {s.drawerSave}
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  )
}
