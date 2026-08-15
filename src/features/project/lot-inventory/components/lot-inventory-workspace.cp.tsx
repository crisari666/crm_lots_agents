import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material"
import {
  ArrowBack as BackIcon,
  GridView as BoardIcon,
  TableRows as TableIcon,
  Map as MapIcon,
  Add as AddIcon
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  bulkUpdateLotStatusThunk,
  clearLotSelectionAct,
  fetchLotInventoryHubThunk,
  fetchLotsMapThunk,
  fetchProjectLotsThunk,
  resetWorkspaceAct,
  setSearchNumberAct,
  setStatusFilterAct,
  setStageFilterAct,
  setViewModeAct
} from "../slice/lot-inventory.slice"
import LotInventorySummaryBarCP from "./lot-inventory-summary-bar.cp"
import LotInventoryBoardCP from "./lot-inventory-board.cp"
import LotInventoryTableCP from "./lot-inventory-table.cp"
import LotInventoryDrawerCP from "./lot-inventory-drawer.cp"
import LotInventoryExcelImportCP from "./lot-inventory-excel-import.cp"
import LotInventoryGenerateDialogCP from "./lot-inventory-generate-dialog.cp"
import LotInventoryMapCP from "./lot-inventory-map.cp"
import LotInventoryMapUploadCP from "./lot-inventory-map-upload.cp"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotStatus } from "../types/lot-inventory.types"
import { getStatusLabel } from "./lot-status-chip.cp"

const STATUS_FILTERS: Array<ProjectLotStatus | "all"> = [
  "all",
  "available",
  "hold",
  "locked",
  "sold"
]

type Props = {
  projectId: string
}

export default function LotInventoryWorkspaceCP({ projectId }: Props) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)
  const {
    lots,
    lotsLoading,
    lotsError,
    viewMode,
    statusFilter,
    stageFilter,
    searchNumber,
    selectedLotIds,
    hubRows,
    actionLoading
  } = useAppSelector((state: RootState) => state.lotInventory)
  const currentUser = useAppSelector(
    (state: RootState) => state.login.currentUser
  )
  const isAdmin =
    currentUser?.level === 0 || currentUser?.level === 1
  const [generateOpen, setGenerateOpen] = useState(false)

  const projectMeta = useMemo(
    () => hubRows.find((r) => r.projectId === projectId),
    [hubRows, projectId]
  )

  const stageOptions = useMemo(() => {
    const byKey = new Map<string, { key: string; name: string; order: number }>()
    for (const lot of lots) {
      const key = lot.stageKey || "default"
      if (byKey.has(key)) continue
      byKey.set(key, {
        key,
        name: lot.stageName || (key === "default" ? s.stageGeneral : key),
        order: lot.stageOrder ?? 0
      })
    }
    return Array.from(byKey.values()).sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
  }, [lots])

  useEffect(() => {
    void dispatch(fetchLotInventoryHubThunk())
    void dispatch(fetchProjectLotsThunk({ projectId }))
    return () => {
      dispatch(resetWorkspaceAct())
    }
  }, [dispatch, projectId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      if (e.key === "/") {
        e.preventDefault()
        searchRef.current?.focus()
      }
      if (e.key === "1") dispatch(setStatusFilterAct("available"))
      if (e.key === "2") dispatch(setStatusFilterAct("hold"))
      if (e.key === "3") dispatch(setStatusFilterAct("locked"))
      if (e.key === "4") dispatch(setStatusFilterAct("sold"))
      if (e.key === "0") dispatch(setStatusFilterAct("all"))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [dispatch])

  const applyBulk = async (status: ProjectLotStatus) => {
    if (!selectedLotIds.length) return
    await dispatch(
      bulkUpdateLotStatusThunk({
        projectId,
        data: { lotIds: selectedLotIds, status }
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
    if (viewMode === "map") {
      void dispatch(fetchLotsMapThunk(projectId))
    }
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mb: 2 }}
        flexWrap="wrap"
        useFlexGap
      >
        <IconButton
          aria-label={s.workspaceBack}
          onClick={() => navigate("/dashboard/lot-inventory")}
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700} sx={{ flex: 1 }}>
          {projectMeta?.title ?? s.hubTitle}
        </Typography>
        {isAdmin && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setGenerateOpen(true)}
          >
            {s.generateButton}
          </Button>
        )}
      </Stack>

      <LotInventorySummaryBarCP />

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mb: 2 }}
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          inputRef={searchRef}
          size="small"
          placeholder={s.searchLotPlaceholder}
          value={searchNumber}
          onChange={(e) => dispatch(setSearchNumberAct(e.target.value))}
          sx={{ minWidth: 200 }}
        />
        <ToggleButtonGroup
          exclusive
          size="small"
          value={viewMode}
          onChange={(_e, value) => {
            if (value) dispatch(setViewModeAct(value))
          }}
        >
          <ToggleButton value="board">
            <BoardIcon fontSize="small" sx={{ mr: 0.5 }} />
            {s.viewBoard}
          </ToggleButton>
          <ToggleButton value="table">
            <TableIcon fontSize="small" sx={{ mr: 0.5 }} />
            {s.viewTable}
          </ToggleButton>
          <ToggleButton value="map">
            <MapIcon fontSize="small" sx={{ mr: 0.5 }} />
            {s.viewMap}
          </ToggleButton>
        </ToggleButtonGroup>
        {STATUS_FILTERS.map((st) => (
          <Chip
            key={st}
            clickable
            color={statusFilter === st ? "primary" : "default"}
            variant={statusFilter === st ? "filled" : "outlined"}
            label={st === "all" ? s.filterAll : getStatusLabel(st)}
            onClick={() => dispatch(setStatusFilterAct(st))}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>

      {stageOptions.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            clickable
            color={stageFilter === "all" ? "secondary" : "default"}
            variant={stageFilter === "all" ? "filled" : "outlined"}
            label={s.filterAllStages}
            onClick={() => dispatch(setStageFilterAct("all"))}
            sx={{ cursor: "pointer" }}
          />
          {stageOptions.map((st) => (
            <Chip
              key={st.key}
              clickable
              color={stageFilter === st.key ? "secondary" : "default"}
              variant={stageFilter === st.key ? "filled" : "outlined"}
              label={st.name}
              onClick={() => dispatch(setStageFilterAct(st.key))}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>
      )}

      {selectedLotIds.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
          flexWrap="wrap"
          useFlexGap
        >
          <Typography variant="body2">
            {selectedLotIds.length} {s.selectedCount}
          </Typography>
          {(["available", "hold", "locked", "sold"] as ProjectLotStatus[]).map(
            (st) => (
              <Button
                key={st}
                size="small"
                variant="outlined"
                disabled={actionLoading}
                onClick={() => void applyBulk(st)}
              >
                {s.applyStatus}: {getStatusLabel(st)}
              </Button>
            )
          )}
          <Button size="small" onClick={() => dispatch(clearLotSelectionAct())}>
            {s.clearSelection}
          </Button>
        </Stack>
      )}

      <LotInventoryExcelImportCP />
      {isAdmin && <LotInventoryMapUploadCP projectId={projectId} />}

      {lotsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {lotsError}
        </Alert>
      )}
      {lotsLoading && viewMode !== "map" ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : viewMode === "board" ? (
        <LotInventoryBoardCP />
      ) : viewMode === "table" ? (
        <LotInventoryTableCP />
      ) : (
        <LotInventoryMapCP projectId={projectId} />
      )}

      <LotInventoryDrawerCP />
      {isAdmin && (
        <LotInventoryGenerateDialogCP
          open={generateOpen}
          onClose={() => setGenerateOpen(false)}
          projectId={projectId}
          defaults={{
            nLots: projectMeta?.nLots,
            nCommercialSpaces: projectMeta?.nCommercialSpaces,
            baseLotArea: projectMeta?.baseLotArea,
            baseCommercialArea: projectMeta?.baseCommercialArea
          }}
        />
      )}
    </Box>
  )
}
