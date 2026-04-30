import React from "react"
import { Autocomplete, Box, Button, Paper, Stack, TextField } from "@mui/material"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import type { OfficeInterface } from "../../../app/models/office.inteface"

export type StaffPerformanceReportFiltersChangeRangeParams = {
  readonly dateStart: Date
  readonly dateEnd: Date
}

export type StaffPerformanceReportFiltersProps = {
  readonly offices: OfficeInterface[]
  readonly officeId: string
  readonly onOfficeIdChange: (officeId: string) => void
  readonly dateStart: Date
  readonly dateEnd: Date
  readonly onDateRangeChange: (params: StaffPerformanceReportFiltersChangeRangeParams) => void
  readonly onRunReport: () => void
  readonly isRunDisabled: boolean
  readonly runButtonLabel: string
  readonly trailingActions?: React.ReactNode
}

/**
 * Office, date range, and primary action for the staff performance report.
 */
export default function StaffPerformanceReportFiltersCP(
  props: StaffPerformanceReportFiltersProps
): React.ReactElement {
  const {
    offices,
    officeId,
    onOfficeIdChange,
    dateStart,
    dateEnd,
    onDateRangeChange,
    onRunReport,
    isRunDisabled,
    runButtonLabel,
    trailingActions,
  } = props
  const selectedOffice = offices.find((o) => o._id === officeId) ?? null
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <Autocomplete
          sx={{ minWidth: 260 }}
          options={offices}
          getOptionLabel={(o) => o.name ?? o._id}
          value={selectedOffice}
          onChange={(_e, v) => {
            onOfficeIdChange(v?._id ?? "")
          }}
          renderInput={(params) => <TextField {...params} label="Oficina" required />}
        />
        <Box sx={{ minWidth: 260, cursor: "pointer" }}>
          <AppDateRangeSelector
            id="staff-performance-report-date-range"
            dateStart={dateStart}
            dateEnd={dateEnd}
            onChange={({ dateStart: nextStart, dateEnd: nextEnd }) =>
              onDateRangeChange({ dateStart: nextStart, dateEnd: nextEnd })
            }
          />
        </Box>
        <Button variant="contained" onClick={onRunReport} disabled={isRunDisabled} sx={{ cursor: "pointer" }}>
          {runButtonLabel}
        </Button>
        {trailingActions ?? null}
      </Stack>
    </Paper>
  )
}
