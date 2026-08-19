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
  desistProjectLotThunk,
  fetchLotHistoryThunk,
  fetchLotsMapThunk,
  fetchProjectLotsThunk,
  setDrawerLotIdAct,
  updateProjectLotThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotStatus } from "../types/lot-inventory.types"
import { getStatusLabel } from "./lot-status-chip.cp"
import LotInventoryHistoryListCP from "./lot-inventory-history-list.cp"
import LotInventoryDesistDialogCP from "./lot-inventory-desist-dialog.cp"

const STATUSES: ProjectLotStatus[] = ["available", "hold", "locked", "sold"]
const DESIST_LEVELS = new Set([0, 1, 2, 9])
const PATCH_LEVELS = new Set([0, 1, 9])

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
  const {
    lots,
    drawerLotId,
    projectId,
    actionLoading,
    historyLogs,
    historyLoading
  } = useAppSelector((state: RootState) => state.lotInventory)
  const currentUser = useAppSelector(
    (state: RootState) => state.login.currentUser
  )
  const lot = lots.find((l) => l._id === drawerLotId) ?? null
  const userLevel = currentUser?.level ?? -1
  const canDesist =
    Boolean(lot && lot.status === "sold" && DESIST_LEVELS.has(userLevel))
  const canPatch = PATCH_LEVELS.has(userLevel)
  const [area, setArea] = useState("")
  const [price, setPrice] = useState("")
  const [ventorName, setVentorName] = useState("")
  const [soldBy, setSoldBy] = useState("")
  const [status, setStatus] = useState<ProjectLotStatus>("available")
  const [holdUntilLocal, setHoldUntilLocal] = useState("")
  const [desistOpen, setDesistOpen] = useState(false)

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

  useEffect(() => {
    if (!lot || !projectId) return
    void dispatch(fetchLotHistoryThunk({ projectId, lotId: lot._id }))
  }, [dispatch, lot, projectId])

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

  const handleStatusChange = (
    _e: React.MouseEvent,
    value: ProjectLotStatus | null
  ) => {
    if (!value) return
    if (lot?.status === "sold" && value === "available") return
    setStatus(value)
    if (value === "hold") {
      setHoldUntilLocal((current) => current || defaultHoldUntilLocal())
    }
  }

  const save = async () => {
    if (!lot || !projectId || !canPatch) return
    if (status === "hold" && holdUntilError) return
    if (lot.status === "sold" && status === "available") return
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

  const handleDesist = async (params: { files: File[]; note: string }) => {
    if (!lot || !projectId) return
    const result = await dispatch(
      desistProjectLotThunk({
        projectId,
        lotId: lot._id,
        files: params.files,
        note: params.note
      })
    )
    if (!desistProjectLotThunk.fulfilled.match(result)) return
    setDesistOpen(false)
    void dispatch(fetchProjectLotsThunk({ projectId }))
    void dispatch(fetchLotsMapThunk(projectId))
    void dispatch(fetchLotHistoryThunk({ projectId, lotId: lot._id }))
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
              {STATUSES.map((st) => {
                const isBlockedAvailable =
                  lot.status === "sold" && st === "available"
                return (
                  <ToggleButton
                    key={st}
                    value={st}
                    disabled={!canPatch || isBlockedAvailable}
                    sx={{ textTransform: "none" }}
                  >
                    {getStatusLabel(st)}
                  </ToggleButton>
                )
              })}
            </ToggleButtonGroup>
            {lot.status === "sold" ? (
              <Typography variant="caption" color="text.secondary">
                {s.statusSoldLocked}
              </Typography>
            ) : null}
            {canDesist ? (
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setDesistOpen(true)}
                disabled={actionLoading}
              >
                {s.desistButton}
              </Button>
            ) : null}
            {status === "hold" ? (
              <TextField
                label={s.fieldHoldUntil}
                type="datetime-local"
                size="small"
                value={holdUntilLocal}
                onChange={(e) => setHoldUntilLocal(e.target.value)}
                fullWidth
                required
                disabled={!canPatch}
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
              disabled={!canPatch}
            />
            <TextField
              label={s.fieldPrice}
              type="number"
              size="small"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              disabled={!canPatch}
            />
            <TextField
              label={s.fieldVentor}
              size="small"
              value={ventorName}
              onChange={(e) => setVentorName(e.target.value)}
              fullWidth
              disabled={!canPatch}
            />
            <TextField
              label={s.fieldSoldBy}
              size="small"
              value={soldBy}
              onChange={(e) => setSoldBy(e.target.value)}
              fullWidth
              disabled={!canPatch}
            />
            {canPatch ? (
              <Button
                variant="contained"
                onClick={() => void save()}
                disabled={actionLoading || Boolean(holdUntilError)}
              >
                {s.drawerSave}
              </Button>
            ) : null}
            <Divider />
            <Typography variant="subtitle2">{s.historyTitle}</Typography>
            <LotInventoryHistoryListCP
              logs={historyLogs}
              loading={historyLoading}
            />
          </Stack>
        )}
      </Box>
      <LotInventoryDesistDialogCP
        open={desistOpen}
        loading={actionLoading}
        onClose={() => setDesistOpen(false)}
        onConfirm={(params) => void handleDesist(params)}
      />
    </Drawer>
  )
}
