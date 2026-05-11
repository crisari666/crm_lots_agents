import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchProjectsThunk } from "../../project/slice/projects.slice"
import { fetchCustomerPaymentsThunk } from "../slice/customer-payments.slice"
import type UserInterface from "../../../app/models/user-interface"

const PAGE_SIZE = 50

export default function CustomerPaymentsAuditoryPanelCP() {
  const dispatch = useAppDispatch()
  const payments = useAppSelector((s) => s.customerPayments.payments)
  const total = useAppSelector((s) => s.customerPayments.total)
  const isLoading = useAppSelector((s) => s.customerPayments.isLoading)
  const error = useAppSelector((s) => s.customerPayments.error)
  const gotUsers = useAppSelector((s) => s.users.gotUsers)
  const usersOriginal = useAppSelector((s) => s.users.usersOriginal)
  const projects = useAppSelector((s) => s.projects.projects)
  const projectsLoaded = projects.length > 0
  const [dateStart, setDateStart] = useState<Date>(() => {
    const d = new Date()
    d.setDate(d.getDate() - 29)
    d.setHours(0, 0, 0, 0)
    return d
  })
  const [dateEnd, setDateEnd] = useState<Date>(() => new Date())
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  useEffect(() => {
    if (!projectsLoaded) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projectsLoaded])

  const physicalUsers = useMemo(
    () => usersOriginal.filter((user) => user.physical === true),
    [usersOriginal],
  )

  const userById = useMemo(() => {
    const map = new Map<string, UserInterface>()
    usersOriginal.forEach((u) => {
      if (u._id) map.set(u._id, u)
    })
    return map
  }, [usersOriginal])

  const projectById = useMemo(() => {
    const map = new Map<string, string>()
    projects.forEach((p) => map.set(p._id, p.title))
    return map
  }, [projects])

  const runSearch = useCallback(
    (pageNum = 0) => {
      setPage(pageNum)
      void dispatch(
        fetchCustomerPaymentsThunk({
          dateFrom: dateStart.toISOString(),
          dateTo: dateEnd.toISOString(),
          recordedBy: selectedUser?._id || undefined,
          skip: pageNum * PAGE_SIZE,
          limit: PAGE_SIZE,
        }),
      )
    },
    [dispatch, dateStart, dateEnd, selectedUser],
  )

  const formatCurrency = (value: number): string =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })

  const getUserName = (userId: string): string => {
    const u = userById.get(userId)
    if (!u) return userId
    return `${u.name ?? ""} ${u.lastName ?? ""}`.trim()
  }

  let runningTotal = 0

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
        <Box sx={{ minWidth: 280 }}>
          <AppDateRangeSelector
            id="payments-date-range"
            dateStart={dateStart}
            dateEnd={dateEnd}
            onChange={({ dateStart: ds, dateEnd: de }) => {
              setDateStart(ds)
              setDateEnd(de)
            }}
          />
        </Box>
        <Autocomplete
          size="small"
          sx={{ minWidth: 250 }}
          options={physicalUsers}
          value={selectedUser}
          onChange={(_, option) => setSelectedUser(option)}
          getOptionLabel={(option) => `${option.name ?? ""} ${option.lastName ?? ""}`.trim()}
          isOptionEqualToValue={(a, b) => a._id === b._id}
          renderInput={(params) => <TextField {...params} label="Usuario (físico)" />}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => runSearch(0)}
          disabled={isLoading}
          sx={{ cursor: "pointer", minWidth: 120 }}
        >
          Buscar
        </Button>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
          No se encontraron pagos para los filtros seleccionados.
        </Typography>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary">
            Mostrando {payments.length} de {total} registros
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Proyecto</TableCell>
                  <TableCell align="right">Valor</TableCell>
                  <TableCell align="right">Total acumulado</TableCell>
                  <TableCell>Recibo</TableCell>
                  <TableCell>Método</TableCell>
                  <TableCell>Registrado por</TableCell>
                  <TableCell>Notas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((p) => {
                  runningTotal += p.paymentValue
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        {new Date(p.datePayment).toLocaleDateString("es-CO")}
                      </TableCell>
                      <TableCell>{projectById.get(p.projectId) ?? p.projectId}</TableCell>
                      <TableCell align="right">{formatCurrency(p.paymentValue)}</TableCell>
                      <TableCell align="right">{formatCurrency(runningTotal)}</TableCell>
                      <TableCell>{p.receiptNumber ?? "-"}</TableCell>
                      <TableCell>{p.paymentMethod ?? "-"}</TableCell>
                      <TableCell>{getUserName(p.recordedBy)}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.notes ?? "-"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {total > PAGE_SIZE && (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                size="small"
                disabled={page === 0}
                onClick={() => runSearch(page - 1)}
                sx={{ cursor: "pointer" }}
              >
                Anterior
              </Button>
              <Typography variant="body2" sx={{ lineHeight: "30px" }}>
                Página {page + 1} de {Math.ceil(total / PAGE_SIZE)}
              </Typography>
              <Button
                size="small"
                disabled={(page + 1) * PAGE_SIZE >= total}
                onClick={() => runSearch(page + 1)}
                sx={{ cursor: "pointer" }}
              >
                Siguiente
              </Button>
            </Stack>
          )}
        </>
      )}
    </Stack>
  )
}
