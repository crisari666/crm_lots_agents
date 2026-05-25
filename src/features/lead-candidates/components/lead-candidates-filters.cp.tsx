import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import {
  fetchLeadCandidatesThunk,
  setLeadCandidatesFiltersAct,
} from "../slice/lead-candidates.slice"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

export default function LeadCandidatesFiltersCp() {
  const dispatch = useAppDispatch()
  const { filters, isLoadingRows } = useAppSelector((state) => state.leadCandidates)

  const runSearch = (): void => {
    void dispatch(fetchLeadCandidatesThunk())
  }

  return (
    <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <Stack spacing={0.5} sx={{ minWidth: 240 }}>
          <Box
            sx={{
              opacity: filters.excludeDate ? 0.5 : 1,
              pointerEvents: filters.excludeDate ? "none" : "auto",
            }}
          >
            <AppDateRangeSelector
              id="lead-candidates-date-range"
              dateStart={new Date(filters.dateFrom)}
              dateEnd={new Date(filters.dateTo)}
              onChange={({ dateStart, dateEnd }) =>
                dispatch(
                  setLeadCandidatesFiltersAct({
                    dateFrom: dateStart.toISOString(),
                    dateTo: dateEnd.toISOString(),
                    page: 0,
                  }),
                )
              }
            />
          </Box>
          <FormControlLabel
            sx={{ m: 0, cursor: "pointer" }}
            control={
              <Checkbox
                size="small"
                checked={filters.excludeDate}
                onChange={(_, checked) =>
                  dispatch(
                    setLeadCandidatesFiltersAct({ excludeDate: checked, page: 0 }),
                  )
                }
                sx={{ cursor: "pointer", py: 0.25 }}
              />
            }
            label={s.excludeDateLabel}
            slotProps={{ typography: { variant: "caption" } }}
          />
        </Stack>
        <TextField
          size="small"
          label={s.searchLabel}
          placeholder={s.searchPlaceholder}
          value={filters.search}
          onChange={(event) =>
            dispatch(
              setLeadCandidatesFiltersAct({ search: event.target.value, page: 0 }),
            )
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              runSearch()
            }
          }}
          sx={{ minWidth: 260, flex: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={isLoadingRows}
          sx={{ cursor: "pointer" }}
        >
          {s.searchAction}
        </Button>
      </Stack>
    </Box>
  )
}
