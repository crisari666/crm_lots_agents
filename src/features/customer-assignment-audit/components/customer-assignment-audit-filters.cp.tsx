import React, { useEffect, useMemo } from "react"
import { Alert, Box, Button, Paper, Stack } from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { customerAssignmentAuditStrings as s } from "../../../i18n/locales/customer-assignment-audit.strings"
import AssignUserAutocompleteCP from "../../customer-v2/components/assign-user-autocomplete.cp"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import {
  fetchCustomerAssignmentChangesThunk,
  setCustomerAssignmentAuditFiltersAct,
} from "../slice/customer-assignment-audit.slice"

export default function CustomerAssignmentAuditFiltersCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const { filters, loading } = useAppSelector((state) => state.customerAssignmentAudit)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const physicalUsers = useMemo(
    () => usersOriginal.filter((user) => user.physical === true),
    [usersOriginal]
  )
  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])
  const isSearchDisabled = filters.assigneeUserId.trim() === "" || loading
  const runSearch = () => {
    if (filters.assigneeUserId.trim() === "") {
      return
    }
    void dispatch(
      fetchCustomerAssignmentChangesThunk({
        assigneeUserId: filters.assigneeUserId.trim(),
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        limit: filters.limit,
        skip: filters.page * filters.limit,
      })
    )
  }
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <Box sx={{ minWidth: 280, flex: 1 }}>
          <AssignUserAutocompleteCP
            users={physicalUsers}
            value={filters.assigneeUserId}
            label={s.assigneeLabel}
            size="small"
            onChange={(userId) =>
              dispatch(setCustomerAssignmentAuditFiltersAct({ assigneeUserId: userId, page: 0 }))
            }
          />
        </Box>
        <Box sx={{ minWidth: 260, cursor: "pointer" }}>
          <AppDateRangeSelector
            id="customer-assignment-audit-date-range"
            dateStart={new Date(filters.dateFrom)}
            dateEnd={new Date(filters.dateTo)}
            onChange={({ dateStart, dateEnd }) =>
              dispatch(
                setCustomerAssignmentAuditFiltersAct({
                  dateFrom: dateStart.toISOString(),
                  dateTo: dateEnd.toISOString(),
                  page: 0,
                })
              )
            }
          />
        </Box>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={isSearchDisabled}
          sx={{ cursor: isSearchDisabled ? "default" : "pointer" }}
        >
          {s.search}
        </Button>
      </Stack>
      {filters.assigneeUserId.trim() === "" ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          {s.emptyAssignee}
        </Alert>
      ) : null}
    </Paper>
  )
}
