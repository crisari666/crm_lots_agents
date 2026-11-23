import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import type UserInterface from "../../../app/models/user-interface"
import type { ProjectType } from "../../project/types/project.types"
import { salesDownPaymentsReportStrings as s } from "../../../i18n/locales/sales-down-payments-report.strings"

export type SalesReportStatusFilter = "pending" | "completed" | ""

export type SalesReportFiltersProps = {
  readonly dateStart: Date
  readonly dateEnd: Date
  readonly onDateRangeChange: (params: { dateStart: Date; dateEnd: Date }) => void
  readonly agents: UserInterface[]
  readonly selectedAgent: UserInterface | null
  readonly onAgentChange: (agent: UserInterface | null) => void
  readonly projects: ProjectType[]
  readonly selectedProject: ProjectType | null
  readonly onProjectChange: (project: ProjectType | null) => void
  readonly statusFilter: SalesReportStatusFilter
  readonly onStatusChange: (status: SalesReportStatusFilter) => void
  readonly onSearch: () => void
  readonly isLoading: boolean
}

/**
 * Sticky-style filter bar for sales report (date, agent, project, status).
 */
export default function SalesReportFiltersCP(props: SalesReportFiltersProps) {
  const {
    dateStart,
    dateEnd,
    onDateRangeChange,
    agents,
    selectedAgent,
    onAgentChange,
    projects,
    selectedProject,
    onProjectChange,
    statusFilter,
    onStatusChange,
    onSearch,
    isLoading,
  } = props
  const statusOptions = [
    { id: "" as const, label: s.statusAll },
    { id: "pending" as const, label: s.statusPending },
    { id: "completed" as const, label: s.statusCompleted },
  ]
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        position: { md: "sticky" },
        top: { md: 8 },
        zIndex: 2,
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            {s.filtersTitle}
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            flexWrap="wrap"
          >
            <Box sx={{ minWidth: 280, flex: "0 0 auto" }}>
              <AppDateRangeSelector
                id="sales-report-date-range"
                dateStart={dateStart}
                dateEnd={dateEnd}
                onChange={({ dateStart: ds, dateEnd: de }) =>
                  onDateRangeChange({ dateStart: ds, dateEnd: de })
                }
              />
            </Box>
            <Autocomplete
              size="small"
              sx={{ minWidth: 200, flex: 1 }}
              options={agents}
              value={selectedAgent}
              onChange={(_, option) => onAgentChange(option)}
              getOptionLabel={(option) =>
                `${option.name ?? ""} ${option.lastName ?? ""}`.trim()
              }
              isOptionEqualToValue={(a, b) => a._id === b._id}
              renderInput={(params) => <TextField {...params} label={s.agentLabel} />}
            />
            <Autocomplete
              size="small"
              sx={{ minWidth: 200, flex: 1 }}
              options={projects}
              value={selectedProject}
              onChange={(_, option) => onProjectChange(option)}
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(a, b) => a._id === b._id}
              renderInput={(params) => <TextField {...params} label={s.projectLabel} />}
            />
            <Autocomplete
              size="small"
              sx={{ minWidth: 160 }}
              options={statusOptions}
              value={statusOptions.find((o) => o.id === statusFilter) ?? statusOptions[0]}
              onChange={(_, option) =>
                onStatusChange((option?.id as SalesReportStatusFilter) ?? "")
              }
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              renderInput={(params) => <TextField {...params} label={s.statusLabel} />}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={onSearch}
              disabled={isLoading}
              sx={{ cursor: "pointer", minWidth: 130, height: 40, flexShrink: 0 }}
            >
              {s.searchButton}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
