import { useEffect, useMemo } from "react"
import {
  Alert,
  Box,
  Chip,
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
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice"
import {
  clearCustomerEventsErrorAct,
  fetchCustomerEventsAdminThunk,
  setCustomerEventsFiltersAct,
} from "../../redux/customer-events.slice"
import { getCustomerEventTypeLabel } from "./customer-event-types"

const TABLE_COLUMN_COUNT = 6

type UserDisplayMap = Record<string, string>

function buildUserDisplayMap(users: { _id?: string; name?: string; lastName?: string }[]): UserDisplayMap {
  const map: UserDisplayMap = {}
  users.forEach((user) => {
    if (!user._id) return
    const name = `${user.name ?? ""} ${user.lastName ?? ""}`.trim()
    if (name.length > 0) map[user._id] = name
  })
  return map
}

function buildCustomerName(name?: string, lastName?: string, fallbackId?: string): string {
  const display = `${name ?? ""} ${lastName ?? ""}`.trim()
  if (display.length > 0) return display
  return fallbackId ?? "—"
}

export default function CustomerEventsListCP() {
  const dispatch = useAppDispatch()
  const { items, total, loading, error, filters } = useAppSelector((s) => s.customerEvents)
  const usersOriginal = useAppSelector((s) => s.users.usersOriginal)
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const userDisplayMap = useMemo(() => buildUserDisplayMap(usersOriginal), [usersOriginal])

  const queryParams = useMemo(
    () => ({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      eventType: filters.eventType || undefined,
      officeId: filters.officeId || undefined,
      userId: filters.userId || undefined,
      limit: filters.limit,
      skip: filters.page * filters.limit,
    }),
    [filters]
  )

  const onChangePage = (_: unknown, newPage: number) => {
    dispatch(setCustomerEventsFiltersAct({ page: newPage }))
    void dispatch(fetchCustomerEventsAdminThunk({ ...queryParams, skip: newPage * filters.limit }))
  }

  const onChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextLimit = Number(event.target.value) as 100 | 200 | 500
    dispatch(setCustomerEventsFiltersAct({ limit: nextLimit, page: 0 }))
    void dispatch(fetchCustomerEventsAdminThunk({ ...queryParams, limit: nextLimit, skip: 0 }))
  }

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCustomerEventsErrorAct())}>
          {error}
        </Alert>
      ) : null}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {total} evento{total === 1 ? "" : "s"}
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Cliente</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_COLUMN_COUNT}>Cargando...</TableCell>
              </TableRow>
            ) : null}
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={TABLE_COLUMN_COUNT}>Sin resultados.</TableCell>
              </TableRow>
            ) : null}
            {items.map((row) => {
              const userName = userDisplayMap[row.userId] ?? row.userId
              const customerName = buildCustomerName(row.customerName, row.customerLastName, row.customerId)
              return (
                <TableRow key={row.id} hover>
                  <TableCell>{moment(row.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
                  <TableCell>
                    <Chip size="small" label={getCustomerEventTypeLabel(row.eventType)} />
                  </TableCell>
                  <TableCell>{row.score ?? "—"}</TableCell>
                  <TableCell>
                    <Box sx={{ maxWidth: 420, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                      {row.description}
                    </Box>
                  </TableCell>
                  <TableCell>{userName}</TableCell>
                  <TableCell>{customerName}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={filters.page}
          onPageChange={onChangePage}
          rowsPerPage={filters.limit}
          onRowsPerPageChange={onChangeRowsPerPage}
          rowsPerPageOptions={[100, 200, 500]}
        />
      </TableContainer>
    </>
  )
}
