import { useEffect } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import AssignUserAutocompleteCP from "../assign-user-autocomplete.cp"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import {
  fetchCallAuditAiReviewThunk,
  setCallAuditFiltersAct,
} from "../../redux/customer-call-audit.slice"

export default function CallAuditAiReviewFiltersCP() {
  const dispatch = useAppDispatch()
  const { filters, loadingAiReview } = useAppSelector((state) => state.customerCallAudit)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const physicalUsers = usersOriginal.filter((user) => user.physical === true)
  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])
  const runSearch = () => {
    void dispatch(
      fetchCallAuditAiReviewThunk({
        month: filters.month,
        limit: 200,
        skip: 0,
        ...(filters.agentExternalRef.trim() !== ""
          ? { agentExternalRef: filters.agentExternalRef.trim() }
          : {}),
        ...(filters.onlyWithoutAi ? { onlyWithoutAi: true } : {}),
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
            label={s.agentLabel}
            size="small"
            onChange={(userId) =>
              dispatch(setCallAuditFiltersAct({ agentExternalRef: userId }))
            }
          />
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.onlyWithoutAi}
              onChange={(e) =>
                dispatch(setCallAuditFiltersAct({ onlyWithoutAi: e.target.checked }))
              }
            />
          }
          label={s.onlyWithoutAi}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={loadingAiReview || filters.month === ""}
          sx={{ cursor: "pointer" }}
        >
          {s.search}
        </Button>
      </Stack>
    </Paper>
  )
}
