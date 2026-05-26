import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { Moment } from "moment"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchCallLogsAdminThunk } from "../../redux/customer-call-logs.slice"
import type { ListCallLogsAdminParams } from "../../services/customers-ms.service"

type OutcomeFilter = NonNullable<ListCallLogsAdminParams["outcome"]>

export default function CallLogsFiltersCP() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.customerCallLogs.loading)

  const [from, setFrom] = useState<Moment | null>(() => moment().subtract(7, "days").startOf("day"))
  const [to, setTo] = useState<Moment | null>(() => moment().endOf("day"))
  const [outcome, setOutcome] = useState<OutcomeFilter>("all")

  const params = useMemo((): ListCallLogsAdminParams => {
    const p: ListCallLogsAdminParams = {
      outcome,
      limit: 100,
      skip: 0,
    }
    if (from) {
      p.callFrom = from.clone().startOf("day").toISOString()
    }
    if (to) {
      p.callTo = to.clone().endOf("day").toISOString()
    }
    return p
  }, [from, to, outcome])

  const rangeOk = from !== null && to !== null

  const runSearch = useCallback(() => {
    if (!rangeOk) {
      return
    }
    void dispatch(fetchCallLogsAdminThunk(params))
  }, [dispatch, params, rangeOk])

  useEffect(() => {
    if (!rangeOk) {
      return
    }
    void dispatch(fetchCallLogsAdminThunk(params))
  }, [dispatch, params, rangeOk])

  const onOutcomeChange = (e: SelectChangeEvent<OutcomeFilter>) => {
    setOutcome(e.target.value as OutcomeFilter)
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
        flexWrap="wrap"
        useFlexGap
      >
        <DatePicker
          label="Desde"
          value={from}
          onChange={(v) => setFrom(v)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <DatePicker
          label="Hasta"
          value={to}
          onChange={(v) => setTo(v)}
          slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="call-log-outcome-filter">Estado</InputLabel>
          <Select
            labelId="call-log-outcome-filter"
            label="Estado"
            value={outcome}
            onChange={onOutcomeChange}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="answered">Contestada</MenuItem>
            <MenuItem value="busy">Ocupado</MenuItem>
            <MenuItem value="no_answer">Sin contestar / otros</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={loading || !rangeOk}
          sx={{ cursor: "pointer" }}
        >
          Actualizar
        </Button>
      </Stack>
    </Paper>
  )
}
