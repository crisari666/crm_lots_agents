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
import DeleteOutline from "@mui/icons-material/DeleteOutline"
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined"
import { useState } from "react"
import type { UserImportFirstStepType } from "../../../app/services/users.service"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { useAppSelector } from "../../../app/hooks"
import {
  onboardingStatusFilterI18n,
  usersOnboardingStatusStrings as s
} from "../../../i18n/locales/users-onboarding-status.strings"
import UsersOnboardingDeleteFlowsConfirmDialogCP from "./users-onboarding-delete-flows-confirm-dialog.cp"
import UsersOnboardingStatusChartDialogCP from "./users-onboarding-status-chart-dialog.cp"
import {
  onboardingStatuses,
  useUsersOnboardingStatusControlsContext
} from "../contexts/users-onboarding-status-controls.context"
import { selectUsersOnboardingStatusFilteredItems } from "../slice/users-onboarding-status.slice"

export default function OnboardinControlsCP() {
  const [chartDialogOpen, setChartDialogOpen] = useState(false)
  const filteredItems = useAppSelector(selectUsersOnboardingStatusFilteredItems)
  const {
    statusFilter,
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

  const fromDateInput = lastUpdateFrom ? new Date(lastUpdateFrom) : new Date()
  const toDateInput = lastUpdateTo ? new Date(lastUpdateTo) : new Date()

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="flex-end">
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

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <FormControl size="small" sx={{ minWidth: 300, maxWidth: 420 }}>
          <InputLabel id="onboarding-status-filter-label">{s.statusFilterLabel}</InputLabel>
          <Select
            labelId="onboarding-status-filter-label"
            label={s.statusFilterLabel}
            value={statusFilter}
            onChange={(e) =>
              onChangeStatusFilter(e.target.value as (typeof onboardingStatuses)[number])
            }
            renderValue={(value) =>
              onboardingStatusFilterI18n[value as keyof typeof onboardingStatusFilterI18n].title
            }
          >
            {onboardingStatuses.map((statusKey) => {
              const copy = onboardingStatusFilterI18n[statusKey]
              return (
                <MenuItem key={statusKey} value={statusKey}>
                  <ListItemText primary={copy.title} secondary={copy.description} />
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <Stack spacing={0.5} sx={{ minWidth: 280 }}>
          <Typography variant="caption" color="text.secondary">
            {`${s.lastUpdateFromLabel} - ${s.lastUpdateToLabel}`}
          </Typography>
          <AppDateRangeSelector
            id="onboarding-last-update-range"
            dateStart={fromDateInput}
            dateEnd={toDateInput}
            onChange={({ dateStart, dateEnd }) =>
              onChangeDateRange({
                lastUpdateFrom: dateStart.toISOString().slice(0, 10),
                lastUpdateTo: dateEnd.toISOString().slice(0, 10)
              })
            }
          />
        </Stack>

        <Button variant="contained" onClick={onRefresh} disabled={isLoading}>
          {s.refresh}
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <FormControl size="small" sx={{ minWidth: 280 }}>
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
            selectedRescheduleUserIdsCount === 0 ||
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
            selectedOrphanRowIdsCount === 0 ||
            isLoading ||
            bulkDeleteFlowsLoading ||
            bulkRecreateSchedulesLoading
          }
          onClick={openDeleteDialog}
        >
          {s.deleteOrphanFlows}
        </Button>
      </Stack>

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
    </Stack>
  )
}

