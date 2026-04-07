import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import { useCallback, useEffect, useState } from "react"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import type { OnboardingStatusType } from "../types/onboarding-state.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  deleteOnboardingFlowsBySelectedIdsThunk,
  fetchUsersOnboardingStatusThunk,
  recreateImportSchedulesForNeedsHumanWhatsappThunk,
  recreateImportSchedulesForSelectedUserIdsThunk,
  selectSelectedOrphanOnboardingRowIds,
  selectSelectedRescheduleUserIds,
  selectUsersOnboardingStatusFilteredItems,
  selectUsersOnboardingStatusState,
  setOnboardingSearchTermAct,
  setOnboardingStatusFilterAct
} from "../slice/users-onboarding-status.slice"
import {
  onboardingStatusFilterI18n,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingDeleteFlowsConfirmDialogCP from "./users-onboarding-delete-flows-confirm-dialog.cp"

const statuses: Array<OnboardingStatusType | "all"> = [
  "all",
  "Imported",
  "Scheduled",
  "WS_sent",
  "WS_video_sent",
  "Needs_human_whatsapp",
  "Interested",
  "Call_programmed",
  "Call_done_success",
  "Call_failed",
  "WS_training_sent",
  "Confirmed_training_request",
  "Call_voicemail",
  "Reschedule_due_twilio_number_occupiedt"
]

const isValidStatusFilter = (v: string): v is OnboardingStatusType | "all" =>
  (statuses as readonly string[]).includes(v)

const sanitizeCsvCell = (value: string) => {
  const escaped = value.replaceAll(`"`, `""`)
  return `"${escaped}"`
}

export default function OnboardinControlsCP() {
  const dispatch = useAppDispatch()
  const {
    items,
    statusFilter,
    searchTerm,
    isLoading,
    bulkDeleteFlowsLoading,
    bulkRecreateSchedulesLoading
  } = useAppSelector(selectUsersOnboardingStatusState)
  const filteredOnboardingRows = useAppSelector(selectUsersOnboardingStatusFilteredItems)
  const selectedOrphanRowIds = useAppSelector(selectSelectedOrphanOnboardingRowIds)
  const selectedRescheduleUserIds = useAppSelector(selectSelectedRescheduleUserIds)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteDialogError, setDeleteDialogError] = useState<string | null>(null)
  const [recreateError, setRecreateError] = useState<string | null>(null)
  const [rescheduleSelectedError, setRescheduleSelectedError] = useState<string | null>(null)
  const [rescheduleFirstStep, setRescheduleFirstStep] = useState<UserImportFirstStepType | "">("")

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

  const onExportVisibleRows = useCallback(() => {
    const rows = filteredOnboardingRows.map((x) => ({
      user: x.userId ? `${x.userId.name} ${x.userId.lastName}`.trim() : "",
      phone: x.userId?.phone ?? "",
      email: x.userId?.email ?? "",
      status: x.status ?? ""
    }))
    const headers = [s.listColUser, s.listColPhone, s.listColEmail, s.listColStatus]
    const csvRows = [
      headers.map(sanitizeCsvCell).join(","),
      ...rows.map((row) =>
        [row.user, row.phone, row.email, row.status].map(sanitizeCsvCell).join(",")
      )
    ]
    const csvContent = `\uFEFF${csvRows.join("\n")}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    const now = new Date()
    const y = now.getFullYear()
    const m = `${now.getMonth() + 1}`.padStart(2, "0")
    const d = `${now.getDate()}`.padStart(2, "0")
    link.href = url
    link.download = `onboarding-users-${y}${m}${d}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [filteredOnboardingRows])

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

  const onRecreateSchedules = useCallback(async () => {
    setRecreateError(null)
    const result = await dispatch(recreateImportSchedulesForNeedsHumanWhatsappThunk())
    if (recreateImportSchedulesForNeedsHumanWhatsappThunk.fulfilled.match(result)) {
      return
    }
    const payload = result.payload as string | undefined
    if (payload === "noNeedsHumanWhatsappUsers") {
      setRecreateError(s.recreateSchedulesNoUsers)
      return
    }
    setRecreateError(
      payload != null && payload !== "recreateSchedulesFailed" ? payload : s.recreateSchedulesError
    )
  }, [dispatch])

  const onRescheduleSelected = useCallback(async () => {
    setRescheduleSelectedError(null)
    if (rescheduleFirstStep === "" || selectedRescheduleUserIds.length === 0) {
      setRescheduleSelectedError(s.rescheduleNoSelection)
      return
    }
    const result = await dispatch(
      recreateImportSchedulesForSelectedUserIdsThunk({
        importFirstStep: rescheduleFirstStep
      })
    )
    if (recreateImportSchedulesForSelectedUserIdsThunk.fulfilled.match(result)) {
      return
    }
    const payload = result.payload as string | undefined
    if (payload === "noRescheduleSelection") {
      setRescheduleSelectedError(s.rescheduleNoSelection)
      return
    }
    setRescheduleSelectedError(
      payload != null && payload !== "recreateSchedulesFailed" ? payload : s.recreateSchedulesError
    )
  }, [dispatch, rescheduleFirstStep, selectedRescheduleUserIds.length])

  const totalRowCount = items.length
  const visibleRowCount = filteredOnboardingRows.length

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={onExportVisibleRows}
          disabled={isLoading || filteredOnboardingRows.length === 0}
        >
          {s.exportVisibleRows}
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        flexWrap="wrap"
      >
      <FormControl size="small" sx={{ minWidth: 300, maxWidth: 420 }}>
        <InputLabel id="onboarding-status-filter-label">{s.statusFilterLabel}</InputLabel>
        <Select
          labelId="onboarding-status-filter-label"
          label={s.statusFilterLabel}
          value={resolvedFilter}
          onChange={onChangeStatus}
          renderValue={(value) =>
            onboardingStatusFilterI18n[value as keyof typeof onboardingStatusFilterI18n].title
          }
        >
          {statuses.map((statusKey) => {
            const copy = onboardingStatusFilterI18n[statusKey]
            return (
              <MenuItem key={statusKey} value={statusKey}>
                <ListItemText primary={copy.title} secondary={copy.description} />
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 260 }}>
        <TextField
          size="small"
          label="Search user"
          value={searchTerm}
          onChange={(e) => dispatch(setOnboardingSearchTermAct(e.target.value))}
          fullWidth
        />
        <Typography variant="body2" color="text.secondary" component="p">
          {s.listRowsShown(visibleRowCount, totalRowCount)}
        </Typography>
      </Stack>

      <Button variant="contained" onClick={onRefresh} disabled={isLoading}>
        Refresh
      </Button>

      <FormControl size="small" sx={{ minWidth: 260 }}>
        <InputLabel id="reschedule-first-step-label">{s.rescheduleFirstStepLabel}</InputLabel>
        <Select
          labelId="reschedule-first-step-label"
          label={s.rescheduleFirstStepLabel}
          value={rescheduleFirstStep}
          onChange={(e) =>
            setRescheduleFirstStep(e.target.value as UserImportFirstStepType | "")
          }
        >
          <MenuItem value="">
            <em>{s.rescheduleFirstStepPlaceholder}</em>
          </MenuItem>
          <MenuItem value="scheduled_whatsapp_import_greeting">
            {s.rescheduleFirstStepScheduledWhatsapp}
          </MenuItem>
          <MenuItem value="immediate_whatsapp_import_sequence">
            {s.rescheduleFirstStepImmediateWhatsapp}
          </MenuItem>
          <MenuItem value="voice_call">{s.rescheduleFirstStepVoice}</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="secondary"
        disabled={
          selectedRescheduleUserIds.length === 0 ||
          rescheduleFirstStep === "" ||
          isLoading ||
          bulkRecreateSchedulesLoading
        }
        onClick={onRescheduleSelected}
      >
        {s.rescheduleSelectedUsers}
      </Button>

      <Button
        variant="outlined"
        disabled={isLoading || bulkRecreateSchedulesLoading}
        onClick={onRecreateSchedules}
      >
        {s.recreateSchedulesNeedsHumanWhatsapp}
      </Button>

      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteOutline />}
        disabled={
          selectedOrphanRowIds.length === 0 ||
          isLoading ||
          bulkDeleteFlowsLoading ||
          bulkRecreateSchedulesLoading
        }
        onClick={openDeleteDialog}
      >
        {s.deleteOrphanFlows}
      </Button>

      {recreateError != null ? <Alert severity="error">{recreateError}</Alert> : null}
      {rescheduleSelectedError != null ? (
        <Alert severity="error">{rescheduleSelectedError}</Alert>
      ) : null}

      <UsersOnboardingDeleteFlowsConfirmDialogCP
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedCount={selectedOrphanRowIds.length}
        isDeleting={bulkDeleteFlowsLoading}
        errorText={deleteDialogError}
        onConfirm={confirmDeleteFlows}
      />
      </Stack>
    </Stack>
  )
}

