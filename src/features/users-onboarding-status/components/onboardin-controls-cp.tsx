import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material"
import type { SelectChangeEvent } from "@mui/material/Select"
import { alpha } from "@mui/material/styles"
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined"
import FilterList from "@mui/icons-material/FilterList"
import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import Refresh from "@mui/icons-material/Refresh"
import Search from "@mui/icons-material/Search"
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

const sectionHeadingSx = {
  fontWeight: 600,
  typography: "caption",
  color: "text.secondary",
  letterSpacing: 0.06,
  textTransform: "uppercase" as const
}

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

  const statusChartDisabled = isLoading || filteredItems.length === 0
  const statusChartDisabledReason = isLoading
    ? s.controlsActionWaitLoading
    : s.controlsStatusChartDisabledNoRows

  const exportDisabled = isLoading || visibleRowCount === 0
  const exportDisabledReason = isLoading
    ? s.controlsActionWaitLoading
    : s.controlsExportDisabledNoRows

  const logStatsDisabled = isLoading
  const logStatsDisabledReason = s.controlsActionWaitLoading

  const rescheduleDisabled =
    selectedRescheduleUserIdsCount === 0 ||
    rescheduleFirstStep === "" ||
    isLoading ||
    bulkRecreateSchedulesLoading
  const rescheduleDisabledReason = isLoading
    ? s.controlsActionWaitLoading
    : bulkRecreateSchedulesLoading
      ? s.controlsActionWaitInFlight
      : s.rescheduleNoSelection

  const recreateDisabled = isLoading || bulkRecreateSchedulesLoading
  const recreateDisabledReason = isLoading
    ? s.controlsActionWaitLoading
    : s.controlsActionWaitInFlight

  const deleteDisabled =
    selectedOrphanRowIdsCount === 0 ||
    isLoading ||
    bulkDeleteFlowsLoading ||
    bulkRecreateSchedulesLoading
  const deleteDisabledReason = isLoading
    ? s.controlsActionWaitLoading
    : bulkDeleteFlowsLoading || bulkRecreateSchedulesLoading
      ? s.controlsActionWaitInFlight
      : s.deleteFlowsNoSelection

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <QueryStatsOutlinedIcon fontSize="small" color="action" aria-hidden />
          <Typography variant="subtitle2" sx={sectionHeadingSx} component="h2">
            {s.controlsReportsExportTitle}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-end" flexWrap="wrap" useFlexGap spacing={1}>
          <Tooltip title={logStatsDisabled ? logStatsDisabledReason : ""}>
            <span>
              <Button
                variant="outlined"
                startIcon={<QueryStatsOutlinedIcon />}
                onClick={() => setLogStatsDialogOpen(true)}
                disabled={logStatsDisabled}
              >
                {s.logStatusStatsChartOpen}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={statusChartDisabled ? statusChartDisabledReason : ""}>
            <span>
              <Button
                variant="outlined"
                startIcon={<InsertChartOutlined />}
                onClick={() => setChartDialogOpen(true)}
                disabled={statusChartDisabled}
              >
                {s.statusChartOpen}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title={exportDisabled ? exportDisabledReason : ""}>
            <span>
              <Button
                variant="outlined"
                startIcon={<FileDownloadOutlined />}
                onClick={onExportVisibleRows}
                disabled={exportDisabled}
              >
                {s.exportVisibleRows}
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          position: "relative",
          overflow: "hidden",
          p: 2,
          borderRadius: 1,
          transition: (theme) =>
            theme.transitions.create(["box-shadow", "border-color"], {
              duration: theme.transitions.duration.shorter
            }),
          "&:hover": {
            borderColor: "action.hover",
            boxShadow: 1
          },
          "@media (prefers-reduced-motion: reduce)": {
            transition: "none",
            "&:hover": {
              boxShadow: "none"
            }
          }
        }}
      >
        {isLoading ? (
          <Box
            role="progressbar"
            aria-label={s.controlsFiltersUpdatingLabel}
            aria-busy="true"
            sx={(theme) => ({
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alpha(theme.palette.background.paper, 0.72),
              backdropFilter: "blur(2px)",
              zIndex: 1
            })}
          >
            <CircularProgress size={36} />
          </Box>
        ) : null}

        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterList fontSize="small" color="action" aria-hidden />
            <Typography variant="subtitle2" sx={sectionHeadingSx} component="h2">
              {s.filtersSectionTitle}
            </Typography>
          </Stack>

          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <FormControl size="small" fullWidth disabled={isLoading}>
                <InputLabel id="onboarding-status-filter-label">{s.statusFilterLabel}</InputLabel>
                <Select
                  multiple
                  labelId="onboarding-status-filter-label"
                  label={s.statusFilterLabel}
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 360, mt: 0.5 }
                    }
                  }}
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

            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={{ xs: 0.5, sm: 2 }}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  flexWrap="wrap"
                  useFlexGap
                >
                  <FormControlLabel
                    sx={{ mr: 0 }}
                    control={
                      <Checkbox
                        checked={includeSpecificUpdate}
                        disabled={isLoading}
                        onChange={(e) => onChangeIncludeSpecificUpdate(e.target.checked)}
                        inputProps={{ "aria-label": s.includeSpecificUpdateA11y }}
                      />
                    }
                    label={s.includeSpecificUpdateLabel}
                  />
                  {includeSpecificUpdate ? (
                    <FormControlLabel
                      sx={{ mr: 0 }}
                      control={
                        <Checkbox
                          checked={containsStatusInLogs}
                          disabled={isLoading}
                          onChange={(e) => onChangeContainsStatusInLogs(e.target.checked)}
                          inputProps={{ "aria-label": s.containsStatusInLogsA11y }}
                        />
                      }
                      label={s.containsStatusInLogsLabel}
                    />
                  ) : null}
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "flex-end" }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
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
                  </Box>
                  <Button
                    variant="contained"
                    onClick={onRefresh}
                    disabled={isLoading}
                    startIcon={<Refresh />}
                    sx={{ alignSelf: { xs: "stretch", sm: "center" }, flexShrink: 0 }}
                  >
                    {s.refresh}
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md>
              <TextField
                size="small"
                label={s.searchUserLabel}
                value={searchTerm}
                onChange={(e) => onChangeSearchTerm(e.target.value)}
                disabled={isLoading}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" aria-hidden />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <Typography
                variant="body2"
                color="text.secondary"
                component="p"
                sx={{ textAlign: { xs: "left", md: "right" }, fontVariantNumeric: "tabular-nums" }}
              >
                {s.listRowsShown(visibleRowCount, totalRowCount)}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={sectionHeadingSx} component="h2">
            {s.controlsBulkActionsSectionTitle}
          </Typography>
        </Stack>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl size="small" fullWidth disabled={isLoading}>
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
            <Tooltip title={rescheduleDisabled ? rescheduleDisabledReason : ""}>
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={rescheduleDisabled}
                  onClick={onRescheduleSelected}
                >
                  {s.rescheduleSelectedUsers}
                </Button>
              </span>
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6} md="auto">
            <Tooltip title={recreateDisabled ? recreateDisabledReason : ""}>
              <span>
                <Button variant="outlined" disabled={recreateDisabled} onClick={onRecreateSchedules}>
                  {s.recreateSchedulesNeedsHumanWhatsapp}
                </Button>
              </span>
            </Tooltip>
          </Grid>

          <Grid item xs={12} sm={6} md="auto">
            <Tooltip title={deleteDisabled ? deleteDisabledReason : ""}>
              <span>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutline />}
                  disabled={deleteDisabled}
                  onClick={openDeleteDialog}
                >
                  {s.deleteOrphanFlows}
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {recreateError != null ? (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 1 }}>
          {recreateError}
        </Alert>
      ) : null}
      {rescheduleSelectedError != null ? (
        <Alert severity="error" variant="outlined" sx={{ borderRadius: 1 }}>
          {rescheduleSelectedError}
        </Alert>
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
