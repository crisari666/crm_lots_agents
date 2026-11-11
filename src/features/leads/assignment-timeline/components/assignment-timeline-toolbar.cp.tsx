import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { leadsStrings as s } from "../../../../i18n/locales/leads.strings"
import {
  fetchAssignmentTimelineThunk,
  setAssignmentTimelineClockModeAct,
  setAssignmentTimelineFiltersAct,
} from "../slice/assignment-timeline.slice"
import type {
  AssignmentTimelineClockMode,
  AssignmentTimelineFlowStrategy,
} from "../types/assignment-timeline.types"

function toLocalInputValue(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromLocalInputValue(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

/**
 * Date range, flow strategy, and clock-mode controls for the assignment timeline.
 */
export default function AssignmentTimelineToolbarCP() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.assignmentTimeline.filters)
  const clockMode = useAppSelector((state) => state.assignmentTimeline.clockMode)
  const loading = useAppSelector((state) => state.assignmentTimeline.loading)

  const applyFilters = (): void => {
    void dispatch(fetchAssignmentTimelineThunk())
  }

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1.5}
      alignItems={{ md: "center" }}
      flexWrap="wrap"
      useFlexGap
      sx={{ mb: 2 }}
    >
      <TextField
        label={s.timelineDateFrom}
        type="datetime-local"
        size="small"
        value={toLocalInputValue(filters.dateFrom)}
        onChange={(event) => {
          dispatch(
            setAssignmentTimelineFiltersAct({
              dateFrom: fromLocalInputValue(event.target.value),
            })
          )
        }}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />
      <TextField
        label={s.timelineDateTo}
        type="datetime-local"
        size="small"
        value={toLocalInputValue(filters.dateTo)}
        onChange={(event) => {
          dispatch(
            setAssignmentTimelineFiltersAct({
              dateTo: fromLocalInputValue(event.target.value),
            })
          )
        }}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="assignment-timeline-flow-label">{s.timelineFlowLabel}</InputLabel>
        <Select
          labelId="assignment-timeline-flow-label"
          label={s.timelineFlowLabel}
          value={filters.flowStrategy}
          onChange={(event) => {
            dispatch(
              setAssignmentTimelineFiltersAct({
                flowStrategy: event.target.value as AssignmentTimelineFlowStrategy | "",
              })
            )
          }}
          disabled={loading}
        >
          <MenuItem value="">{s.timelineFlowAll}</MenuItem>
          <MenuItem value="immediate_assign">{s.timelineFlowImmediate}</MenuItem>
          <MenuItem value="lead_conversation">{s.timelineFlowConversation}</MenuItem>
        </Select>
      </FormControl>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={clockMode}
        onChange={(_event, value: AssignmentTimelineClockMode | null) => {
          if (value != null) {
            dispatch(setAssignmentTimelineClockModeAct(value))
          }
        }}
      >
        <ToggleButton value="assignedAt" sx={{ textTransform: "none" }}>
          {s.timelineClockAssigned}
        </ToggleButton>
        <ToggleButton value="arrivedAt" sx={{ textTransform: "none" }}>
          {s.timelineClockArrived}
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButton
        value="apply"
        selected={false}
        onClick={applyFilters}
        disabled={loading}
        sx={{ textTransform: "none", cursor: "pointer" }}
      >
        {s.timelineApply}
      </ToggleButton>
    </Stack>
  )
}
