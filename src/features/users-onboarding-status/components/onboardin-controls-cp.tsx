import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material/Select"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import { useState } from "react"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import { useAppSelector } from "../../../app/hooks"
import {
  onboardingStatusFilterI18n,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingDeleteFlowsConfirmDialogCP from "./users-onboarding-delete-flows-confirm-dialog.cp"
import UsersOnboardingStatusChartDialogCP from "./users-onboarding-status-chart-dialog.cp"
import UsersOnboardingStatusLogStatsDialogCP from "./users-onboarding-status-log-stats-dialog.cp"
import {
  onboardingStatuses,
  useUsersOnboardingStatusControlsContext
} from "../contexts/users-onboarding-status-controls.context"
import { selectUsersOnboardingStatusFilteredItems } from "../slice/users-onboarding-status.slice"
import OnboardingDateTimeRangePickerCP from "./onboarding-date-time-range-picker.cp"

export default function OnboardinControlsCP() {
  const [chartDialogOpen, setChartDialogOpen] = useState(false)
  const [logStatsDialogOpen, setLogStatsDialogOpen] = useState(false)
  const filteredItems = useAppSelector(selectUsersOnboardingStatusFilteredItems)
  const {
    statusFilter,
    includeSpecificUpdate,
    containsStatusInLogs,
    searchTerm,
    lastUpdateFrom,
    lastUpdateTo,
    totalRowCount,
    visibleRowCount,
    isLoading,
    bulkDeleteFlowsLoading,
    bulkRecreateSchedulesLoading,
    selectedOrphanRowIdsCount,
    selectedRescheduleUserIdsCount,
    rescheduleFirstStep,
    recreateError,
    rescheduleSelectedError,
    deleteDialogOpen,
    deleteDialogError,
    setRescheduleFirstStep,
    onChangeStatusFilter,
    onChangeIncludeSpecificUpdate,
    onChangeContainsStatusInLogs,
    onChangeSearchTerm,
    onChangeDateRange,
    onRefresh,
    onExportVisibleRows,
    onRecreateSchedules,
    onRescheduleSelected,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDeleteFlows
  } = useUsersOnboardingStatusControlsContext()

  const fromDateInput = lastUpdateFrom ? new Date(lastUpdateFrom) : null
  const toDateInput = lastUpdateTo ? new Date(lastUpdateTo) : null

  const handleStatusFilterChange = (event: SelectChangeEvent<typeof statusFilter>) => {
    const value = event.target.value
    const nextStatuses = typeof value === "string" ? value.split(",") : value
    onChangeStatusFilter(nextStatuses.filter((item): item is (typeof onboardingStatuses)[number] =>
      onboardingStatuses.includes(item as (typeof onboardingStatuses)[number])
    ))
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={<QueryStatsOutlinedIcon />}
          onClick={() => setLogStatsDialogOpen(true)}
          disabled={isLoading}
          sx={{ mr: 1 }}
        >
          {s.logStatusStatsChartOpen}
        </Button>
        <Button
          variant="outlined"
          startIcon={<QueryStatsOutlinedIcon />}
          onClick={() => setChartDialogOpen(true)}
          disabled={isLoading && filteredItems.length === 0}
          sx={{ mr: 1 }}
        >
          {s.statusChartOpen}
        </Button>
        <Button
          variant="outlined"
          onClick={onExportVisibleRows}
          disabled={isLoading || visibleRowCount === 0}
        >
          {s.exportVisibleRows}
        </Button>
      </Stack>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl size="small" fullWidth>
          <InputLabel id="onboarding-status-filter-label">{s.statusFilterLabel}</InputLabel>
          <Select
            multiple
            labelId="onboarding-status-filter-label"
            label={s.statusFilterLabel}
            value={statusFilter}
            onChange={handleStatusFilterChange}
            renderValue={(value) =>
              Array.isArray(value) && value.length > 0
                ? value
                    .map((statusKey) => onboardingStatusFilterI18n[statusKey].title)
                    .join(", ")
                : onboardingStatusFilterI18n.all.title
            }
          >
            <MenuItem value="" disabled>
              <ListItemText
                primary={onboardingStatusFilterI18n.all.title}
                secondary={onboardingStatusFilterI18n.all.description}
              />
            </MenuItem>
            {onboardingStatuses.map((statusKey) => {
              const copy = onboardingStatusFilterI18n[statusKey]
              return (
                <MenuItem key={statusKey} value={statusKey}>
                  <Checkbox checked={statusFilter.includes(statusKey)} />
                  <ListItemText primary={copy.title} secondary={copy.description} />
                </MenuItem>
              )
            })}
          </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeSpecificUpdate}
                onChange={(e) => onChangeIncludeSpecificUpdate(e.target.checked)}
              />
            }
            label={s.includeSpecificUpdateLabel}
          />
        </Grid>
        {includeSpecificUpdate ? (
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={containsStatusInLogs}
                  onChange={(e) => onChangeContainsStatusInLogs(e.target.checked)}
                />
              }
              label={s.containsStatusInLogsLabel}
            />
          </Grid>
        ) : null}

        <Grid item xs={12} md={includeSpecificUpdate ? 10 : 7}>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {s.lastUpdateRangeLabel}
            </Typography>
            <OnboardingDateTimeRangePickerCP
              id="onboarding-last-update-range"
              value={[fromDateInput, toDateInput]}
              disabled={isLoading}
              helperText={`${s.lastUpdateFromLabel} / ${s.lastUpdateToLabel}`}
              onChange={([dateStart, dateEnd]) =>
                onChangeDateRange({
                  lastUpdateFrom: dateStart?.toISOString() ?? "",
                  lastUpdateTo: dateEnd?.toISOString() ?? ""
                })
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12} md="auto">
          <Button variant="contained" onClick={onRefresh} disabled={isLoading}>
            {s.refresh}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl size="small" fullWidth>
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
        </Grid>

        <Grid item xs={12} sm={6} md="auto">
          <Button
            variant="contained"
            color="secondary"
            disabled={
              selectedRescheduleUserIdsCount === 0 ||
              rescheduleFirstStep === "" ||
              isLoading ||
              bulkRecreateSchedulesLoading
            }
            onClick={onRescheduleSelected}
          >
            {s.rescheduleSelectedUsers}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md="auto">
          <Button
            variant="outlined"
            disabled={isLoading || bulkRecreateSchedulesLoading}
            onClick={onRecreateSchedules}
          >
            {s.recreateSchedulesNeedsHumanWhatsapp}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6} md="auto">
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutline />}
            disabled={
              selectedOrphanRowIdsCount === 0 ||
              isLoading ||
              bulkDeleteFlowsLoading ||
              bulkRecreateSchedulesLoading
            }
            onClick={openDeleteDialog}
          >
            {s.deleteOrphanFlows}
          </Button>
        </Grid>
      </Grid>

      <Stack spacing={0.5} sx={{ minWidth: 260 }}>
        <TextField
          size="small"
          label={s.searchUserLabel}
          value={searchTerm}
          onChange={(e) => onChangeSearchTerm(e.target.value)}
          fullWidth
        />
        <Typography variant="body2" color="text.secondary" component="p">
          {s.listRowsShown(visibleRowCount, totalRowCount)}
        </Typography>
      </Stack>

      {recreateError != null ? <Alert severity="error">{recreateError}</Alert> : null}
      {rescheduleSelectedError != null ? (
        <Alert severity="error">{rescheduleSelectedError}</Alert>
      ) : null}

      <UsersOnboardingDeleteFlowsConfirmDialogCP
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        selectedCount={selectedOrphanRowIdsCount}
        isDeleting={bulkDeleteFlowsLoading}
        errorText={deleteDialogError}
        onConfirm={confirmDeleteFlows}
      />

      <UsersOnboardingStatusChartDialogCP
        open={chartDialogOpen}
        onClose={() => setChartDialogOpen(false)}
        items={filteredItems}
      />
      <UsersOnboardingStatusLogStatsDialogCP
        open={logStatsDialogOpen}
        onClose={() => setLogStatsDialogOpen(false)}
        statuses={statusFilter}
        lastUpdateFrom={lastUpdateFrom}
        lastUpdateTo={lastUpdateTo}
      />
    </Stack>
  )
}

