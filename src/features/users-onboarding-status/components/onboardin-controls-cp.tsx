import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material"
import type { SelectChangeEvent } from "@mui/material"
import type { OnboardingStatusType } from "../types/onboarding-state.types"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  fetchUsersOnboardingStatusThunk,
  selectUsersOnboardingStatusState,
  setOnboardingSearchTermAct,
  setOnboardingStatusFilterAct
} from "../slice/users-onboarding-status.slice"

const statuses: Array<OnboardingStatusType | "all"> = [
  "all",
  "Imported",
  "WS_sent",
  "Interested",
  "Call_programmed",
  "Call_done_success",
  "Call_failed",
  "WS_training_sent",
  "Confirmed_training_request"
]

export default function OnboardinControlsCP() {
  const dispatch = useAppDispatch()
  const { statusFilter, searchTerm, isLoading } = useAppSelector(selectUsersOnboardingStatusState)

  const onChangeStatus = (e: SelectChangeEvent) => {
    const next = e.target.value as OnboardingStatusType | "all"
    dispatch(setOnboardingStatusFilterAct(next))

    const status = next === "all" ? undefined : next
    dispatch(fetchUsersOnboardingStatusThunk({ status }))
  }

  const onRefresh = () => {
    const status = statusFilter === "all" ? undefined : statusFilter
    dispatch(fetchUsersOnboardingStatusThunk({ status }))
  }

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="onboarding-status-filter-label">Status</InputLabel>
        <Select
          labelId="onboarding-status-filter-label"
          label="Status"
          value={statusFilter}
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
    </Stack>
  )
}

