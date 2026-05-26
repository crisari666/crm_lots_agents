import { useEffect } from "react"
import { Box, Button, Paper, Stack, TextField } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import AssignUserAutocompleteCP from "../assign-user-autocomplete.cp"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import {
  fetchCallAuditAuditorProgressThunk,
  fetchCallAuditConfigThunk,
  fetchCallAuditResultsThunk,
  setCallAuditFiltersAct,
} from "../../redux/customer-call-audit.slice"

export default function CallAuditResultsFiltersCP() {
  const dispatch = useAppDispatch()
  const { filters, loadingResults } = useAppSelector((state) => state.customerCallAudit)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const physicalUsers = usersOriginal.filter((user) => user.physical === true)
  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])
  useEffect(() => {
    void dispatch(fetchCallAuditConfigThunk())
  }, [dispatch])
  const runSearch = () => {
    void dispatch(fetchCallAuditAuditorProgressThunk({ month: filters.month }))
    void dispatch(
      fetchCallAuditResultsThunk({
        month: filters.month,
        ...(filters.agentExternalRef.trim() !== ""
          ? { agentExternalRef: filters.agentExternalRef.trim() }
          : {}),
      })
    )
  }
  useEffect(() => {
    runSearch()
  }, [])
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} useFlexGap flexWrap="wrap">
        <TextField
          label={s.monthLabel}
          type="month"
          size="small"
          value={filters.month}
          onChange={(e) => dispatch(setCallAuditFiltersAct({ month: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <Box sx={{ minWidth: 280, flex: 1 }}>
          <AssignUserAutocompleteCP
            users={physicalUsers}
            value={filters.agentExternalRef}
            label={s.callerFilterLabel}
            size="small"
            onChange={(userId) =>
              dispatch(setCallAuditFiltersAct({ agentExternalRef: userId }))
            }
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={loadingResults || filters.month === ""}
          sx={{ cursor: "pointer" }}
        >
          {s.search}
        </Button>
      </Stack>
    </Paper>
  )
}
