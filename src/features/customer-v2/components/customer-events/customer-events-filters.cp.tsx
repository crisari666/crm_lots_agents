import { useEffect, useMemo } from "react"
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import AppDateRangeSelector from "../../../../app/components/app-date-range-selector"
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import {
  fetchCustomerEventsAdminThunk,
  setCustomerEventsFiltersAct,
} from "../../redux/customer-events.slice"
import CustomerAutocompleteAsyncCP from "../customer-autocomplete-async.cp"
import { CUSTOMER_EVENT_TYPE_OPTIONS } from "./customer-event-types"

function getOfficeIdFromUser(user: { office?: unknown }): string {
  if (typeof user.office === "string") {
    return user.office
  }
  if (typeof user.office === "object" && user.office !== null && "_id" in user.office) {
    return String((user.office as { _id?: string })._id ?? "")
  }
  return ""
}

export default function CustomerEventsFiltersCP() {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.customerEvents.loading)
  const filters = useAppSelector((s) => s.customerEvents.filters)
  const offices = useAppSelector((s) => s.offices.offices)
  const gotOffices = useAppSelector((s) => s.offices.gotOffices)
  const gotUsers = useAppSelector((s) => s.users.gotUsers)
  const usersOriginal = useAppSelector((s) => s.users.usersOriginal)

  useEffect(() => {
    if (!gotOffices) {
      void dispatch(getOfficesThunk())
    }
  }, [dispatch, gotOffices])

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const physicalUsers = useMemo(() => {
    const filtered = usersOriginal.filter((user) => user.physical === true)
    if (filters.officeId === "") {
      return filtered
    }
    return filtered.filter((user) => getOfficeIdFromUser(user) === filters.officeId)
  }, [filters.officeId, usersOriginal])

  const selectedEventType =
    CUSTOMER_EVENT_TYPE_OPTIONS.find((item) => item.id === filters.eventType) ?? null
  const selectedOffice = offices.find((item) => item._id === filters.officeId) ?? null
  const selectedUser = physicalUsers.find((item) => item._id === filters.userId) ?? null

  const runSearch = () => {
    void dispatch(
      fetchCustomerEventsAdminThunk({
        dateFrom: filters.excludeDate ? undefined : filters.dateFrom,
        dateTo: filters.excludeDate ? undefined : filters.dateTo,
        eventType: filters.eventType || undefined,
        officeId: filters.officeId || undefined,
        userId: filters.userId || undefined,
        customerId: filters.customerId || undefined,
        limit: filters.limit,
        skip: filters.page * filters.limit,
      })
    )
  }

  return (
    <Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1, mb: 2 }}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
        <Stack spacing={0.5} sx={{ minWidth: 240 }}>
          <Box sx={{ opacity: filters.excludeDate ? 0.5 : 1, pointerEvents: filters.excludeDate ? "none" : "auto" }}>
            <AppDateRangeSelector
              id="customer-events-date-range"
              dateStart={new Date(filters.dateFrom)}
              dateEnd={new Date(filters.dateTo)}
              onChange={({ dateStart, dateEnd }) =>
                dispatch(
                  setCustomerEventsFiltersAct({
                    dateFrom: dateStart.toISOString(),
                    dateTo: dateEnd.toISOString(),
                    page: 0,
                  })
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
                  dispatch(setCustomerEventsFiltersAct({ excludeDate: checked, page: 0 }))
                }
                sx={{ cursor: "pointer", py: 0.25 }}
              />
            }
            label="Sin filtro de fecha"
            slotProps={{ typography: { variant: "caption" } }}
          />
        </Stack>
        <Autocomplete
          size="small"
          sx={{ minWidth: 210 }}
          options={CUSTOMER_EVENT_TYPE_OPTIONS}
          value={selectedEventType}
          onChange={(_, option) =>
            dispatch(setCustomerEventsFiltersAct({ eventType: option?.id ?? "", page: 0 }))
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => <TextField {...params} label="Event type" />}
        />
        <Autocomplete
          size="small"
          sx={{ minWidth: 210 }}
          options={offices}
          value={selectedOffice}
          onChange={(_, option) =>
            dispatch(
              setCustomerEventsFiltersAct({
                officeId: option?._id ?? "",
                userId: "",
                page: 0,
              })
            )
          }
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="Office" />}
        />
        <Autocomplete
          size="small"
          sx={{ minWidth: 230 }}
          options={physicalUsers}
          value={selectedUser}
          onChange={(_, option) =>
            dispatch(setCustomerEventsFiltersAct({ userId: option?._id ?? "", page: 0 }))
          }
          getOptionLabel={(option) => `${option.name} ${option.lastName}`.trim()}
          renderInput={(params) => <TextField {...params} label="User (physical)" />}
        />
        <CustomerAutocompleteAsyncCP
          value={filters.selectedCustomer}
          onChange={(option) =>
            dispatch(
              setCustomerEventsFiltersAct({
                customerId: option?.id ?? "",
                selectedCustomer: option ?? null,
                page: 0,
              })
            )
          }
          minWidth={260}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={runSearch}
          disabled={loading}
          sx={{ cursor: "pointer" }}
        >
          Buscar
        </Button>
      </Stack>
    </Box>
  )
}
