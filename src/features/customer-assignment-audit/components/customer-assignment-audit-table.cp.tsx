import React, { useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import LoadingIndicator from "../../../app/components/loading-indicator"
import { customerAssignmentAuditStrings as s } from "../../../i18n/locales/customer-assignment-audit.strings"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchCustomerAdminDetailThunk } from "../../customer-v2/redux/customer-v2.slice"
import {
  clearCustomerAssignmentAuditErrorAct,
  fetchCustomerAssignmentChangesThunk,
  setCustomerAssignmentAuditFiltersAct,
} from "../slice/customer-assignment-audit.slice"

type UserDisplayMap = Record<string, string>

function buildUserDisplayMap(
  users: { _id?: string; name?: string; lastName?: string }[]
): UserDisplayMap {
  const map: UserDisplayMap = {}
  users.forEach((user) => {
    if (!user._id) {
      return
    }
    const name = `${user.name ?? ""} ${user.lastName ?? ""}`.trim()
    if (name.length > 0) {
      map[user._id] = name
    }
  })
  return map
}

function resolveUserLabel(userId: string | undefined, map: UserDisplayMap): string {
  if (userId === undefined || userId === "") {
    return "—"
  }
  return map[userId] ?? userId
}

function buildCustomerLabel(
  name?: string,
  lastName?: string,
  phone?: string,
  fallbackId?: string
): string {
  const display = `${name ?? ""} ${lastName ?? ""}`.trim()
  const base = display.length > 0 ? display : (fallbackId ?? "—")
  if (phone !== undefined && phone.trim() !== "") {
    return `${base} · ${phone}`
  }
  return base
}

function formatDurationFromMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined || !Number.isFinite(ms) || ms < 0) {
    return "—"
  }
  const totalMinutes = Math.round(ms / 60000)
  if (totalMinutes < 60) {
    return `${totalMinutes}m`
  }
  const totalHours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (totalHours < 48) {
    return minutes > 0 ? `${totalHours}h ${minutes}m` : `${totalHours}h`
  }
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`
}

export default function CustomerAssignmentAuditTableCP(): React.ReactElement {
  const dispatch = useAppDispatch()
  const { items, total, loading, error, filters, lastParams, attendedCount, avgTimeToAttendMs } =
    useAppSelector((state) => state.customerAssignmentAudit)
  const gotUsers = useAppSelector((state) => state.users.gotUsers)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])
  const userDisplayMap = useMemo(() => buildUserDisplayMap(usersOriginal), [usersOriginal])
  const queryParams = useMemo(
    () =>
      lastParams ?? {
        assigneeUserId: filters.assigneeUserId.trim(),
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        limit: filters.limit,
        skip: filters.page * filters.limit,
      },
    [filters, lastParams]
  )
  const onChangePage = (_: unknown, newPage: number) => {
    dispatch(setCustomerAssignmentAuditFiltersAct({ page: newPage }))
    if (filters.assigneeUserId.trim() === "") {
      return
    }
    void dispatch(
      fetchCustomerAssignmentChangesThunk({ ...queryParams, skip: newPage * filters.limit })
    )
  }
  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLimit = Number(event.target.value) as 100 | 200 | 500
    dispatch(setCustomerAssignmentAuditFiltersAct({ limit: nextLimit, page: 0 }))
    if (filters.assigneeUserId.trim() === "") {
      return
    }
    void dispatch(
      fetchCustomerAssignmentChangesThunk({
        ...queryParams,
        limit: nextLimit,
        skip: 0,
      })
    )
  }
  const openCustomer = (customerId: string) => {
    void dispatch(fetchCustomerAdminDetailThunk(customerId))
  }
  return (
    <>
      <LoadingIndicator open={loading} />
      {error ? (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearCustomerAssignmentAuditErrorAct())}
        >
          {error}
        </Alert>
      ) : null}
      {filters.assigneeUserId.trim() !== "" && lastParams !== null ? (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {s.resultCount(total)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {s.attendanceSummary(attendedCount, formatDurationFromMs(avgTimeToAttendMs))}
          </Typography>
        </Box>
      ) : null}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.colDate}</TableCell>
              <TableCell>{s.colCustomer}</TableCell>
              <TableCell>{s.colPreviousAssignee}</TableCell>
              <TableCell>{s.colAssignedTo}</TableCell>
              <TableCell>{s.colActor}</TableCell>
              <TableCell>{s.colAttendedAt}</TableCell>
              <TableCell>{s.colTimeToAttend}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    {lastParams === null ? s.emptyAssignee : s.noRows}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => (
                <TableRow key={row.changeLogId} hover>
                  <TableCell>
                    {moment(row.occurredAt).format("DD/MM/YYYY HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => openCustomer(row.customerId)}
                      sx={{ cursor: "pointer", textAlign: "left" }}
                    >
                      {buildCustomerLabel(
                        row.customerName,
                        row.customerLastName,
                        row.customerPhone,
                        row.customerId
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>{resolveUserLabel(row.assignedFrom, userDisplayMap)}</TableCell>
                  <TableCell>{resolveUserLabel(row.assignedTo, userDisplayMap)}</TableCell>
                  <TableCell>{resolveUserLabel(row.actorUserId, userDisplayMap)}</TableCell>
                  <TableCell>
                    {row.attendedAt !== undefined && row.attendedAt !== ""
                      ? moment(row.attendedAt).format("DD/MM/YYYY HH:mm")
                      : "—"}
                  </TableCell>
                  <TableCell>{formatDurationFromMs(row.timeToAttendMs)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {lastParams !== null ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <TablePagination
              component="div"
              count={total}
              page={filters.page}
              onPageChange={onChangePage}
              rowsPerPage={filters.limit}
              onRowsPerPageChange={onChangeRowsPerPage}
              rowsPerPageOptions={[100, 200, 500]}
              labelRowsPerPage="Filas"
            />
          </Box>
        ) : null}
      </TableContainer>
    </>
  )
}
