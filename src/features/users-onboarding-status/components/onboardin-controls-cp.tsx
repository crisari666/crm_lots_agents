import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import { useCallback, useEffect, useState } from "react"
import type { OnboardingStatusType } from "../types/onboarding-state.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  deleteOnboardingFlowsBySelectedIdsThunk,
  fetchUsersOnboardingStatusThunk,
  selectSelectedOrphanOnboardingRowIds,
  selectUsersOnboardingStatusState,
  setOnboardingSearchTermAct,
  setOnboardingStatusFilterAct
} from "../slice/users-onboarding-status.slice"
import { usersOnboardingStatusStrings as s } from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingDeleteFlowsConfirmDialogCP from "./users-onboarding-delete-flows-confirm-dialog.cp"

const statuses: Array<OnboardingStatusType | "all"> = [
  "all",
  "Needs_human_whatsapp",
  "Imported",
  "WS_video_sent",
  "WS_sent",
  "Interested",
  "Call_programmed",
  "Call_done_success",
  "Call_failed",
  "WS_training_sent",
  "Confirmed_training_request"
]

const isValidStatusFilter = (v: string): v is OnboardingStatusType | "all" =>
  (statuses as readonly string[]).includes(v)

export default function OnboardinControlsCP() {
  const dispatch = useAppDispatch()
  const { statusFilter, searchTerm, isLoading, bulkDeleteFlowsLoading } =
    useAppSelector(selectUsersOnboardingStatusState)
  const selectedOrphanRowIds = useAppSelector(selectSelectedOrphanOnboardingRowIds)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null)

  useEffect(() => {
    if (!deleteDialogOpen) setDeleteDialogError(null)
  }, [deleteDialogOpen])

  const resolvedFilter: OnboardingStatusType | "all" = isValidStatusFilter(statusFilter)
    ? statusFilter
    : "all"

  useEffect(() => {
    if (!isValidStatusFilter(statusFilter)) {
      dispatch(setOnboardingStatusFilterAct("all"))
      return
    }
    const status = statusFilter === "all" ? undefined : statusFilter
    dispatch(fetchUsersOnboardingStatusThunk({ status }))
  }, [dispatch, statusFilter])

  const onChangeStatus = (e: SelectChangeEvent) => {
    const next = e.target.value as OnboardingStatusType | "all"
    dispatch(setOnboardingStatusFilterAct(next))
  }

  const onRefresh = () => {
    const status = resolvedFilter === "all" ? undefined : resolvedFilter
    dispatch(fetchUsersOnboardingStatusThunk({ status }))
  }

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogError(null)
    setDeleteDialogOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    if (!bulkDeleteFlowsLoading) setDeleteDialogOpen(false)
  }, [bulkDeleteFlowsLoading])

  const confirmDeleteFlows = useCallback(async () => {
    setDeleteDialogError(null)
    const result = await dispatch(deleteOnboardingFlowsBySelectedIdsThunk(selectedOrphanRowIds))
    if (deleteOnboardingFlowsBySelectedIdsThunk.fulfilled.match(result)) {
      setDeleteDialogOpen(false)
      return
    }
    const payload = result.payload as string | undefined
    if (payload === "noSelection") {
      setDeleteDialogError(s.deleteFlowsNoSelection)
      return
    }
    setDeleteDialogError(
      payload != null && payload !== "deleteFailed" ? payload : s.deleteFlowsGenericError
    )
  }, [dispatch, selectedOrphanRowIds])

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="onboarding-status-filter-label">Status</InputLabel>
        <Select
          labelId="onboarding-status-filter-label"
          label="Status"
          value={resolvedFilter}
          onChange={onChangeStatus}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {s === "all" ? "All" : s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        size="small"
        label="Search user"
        value={searchTerm}
        onChange={(e) => dispatch(setOnboardingSearchTermAct(e.target.value))}
        sx={{ flex: 1, minWidth: 260 }}
      />

      <Button variant="contained" onClick={onRefresh} disabled={isLoading}>
        Refresh
      </Button>

      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteOutline />}
        disabled={selectedOrphanRowIds.length === 0 || isLoading || bulkDeleteFlowsLoading}
        onClick={openDeleteDialog}
      >
        {s.deleteOrphanFlows}
      </Button>

      <UsersOnboardingDeleteFlowsConfirmDialogCP
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedCount={selectedOrphanRowIds.length}
        isDeleting={bulkDeleteFlowsLoading}
        errorText={deleteDialogError}
        onConfirm={confirmDeleteFlows}
      />
    </Stack>
  )
}

