import { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
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
import { Search as SearchIcon, Receipt as ReceiptIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchProjectsThunk } from "../../project/slice/projects.slice"
import { fetchCustomerPaymentsThunk } from "../slice/customer-payments.slice"
import type UserInterface from "../../../app/models/user-interface"

const PAGE_SIZE = 50

const headerCellSx = {
  fontWeight: 600,
  typography: "caption",
  color: "text.secondary",
  letterSpacing: 0.06,
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
}

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

  const totalPageAmount = useMemo(
    () => payments.reduce((sum, p) => sum + p.paymentValue, 0),
    [payments],
  )

  let runningTotal = 0

  return (
    <Stack spacing={2.5}>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
          <Stack spacing={2}>
            <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
              Filtros de búsqueda
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Box sx={{ minWidth: 280, flex: "0 0 auto" }}>
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
                sx={{ minWidth: 260, flex: 1 }}
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
                sx={{ cursor: "pointer", minWidth: 130, height: 40, flexShrink: 0 }}
              >
                Buscar
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      {error && <Alert severity="error">{error}</Alert>}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : payments.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ py: 6, textAlign: "center" }}>
            <ReceiptIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="body1" color="text.secondary">
              No se encontraron pagos para los filtros seleccionados.
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
              Ajusta el rango de fechas o el usuario y busca de nuevo.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Resultados
                  </Typography>
                  <Chip
                    size="small"
                    label={`${total} registro${total !== 1 ? "s" : ""}`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Total en página: <strong>{formatCurrency(totalPageAmount)}</strong>
                </Typography>
              </Stack>
              <Divider />
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={headerCellSx}>Fecha</TableCell>
                      <TableCell sx={headerCellSx}>Proyecto</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Valor</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Acumulado</TableCell>
                      <TableCell sx={headerCellSx}>Recibo</TableCell>
                      <TableCell sx={headerCellSx}>Método</TableCell>
                      <TableCell sx={headerCellSx}>Registrado por</TableCell>
                      <TableCell sx={headerCellSx}>Notas</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((p) => {
                      runningTotal += p.paymentValue
                      return (
                        <TableRow
                          key={p.id}
                          hover
                          sx={{ "&:last-child td": { border: 0 } }}
                        >
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {new Date(p.datePayment).toLocaleDateString("es-CO")}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>
                              {projectById.get(p.projectId) ?? p.projectId}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 500 }}>
                            {formatCurrency(p.paymentValue)}
                          </TableCell>
                          <TableCell align="right" sx={{ color: "text.secondary" }}>
                            {formatCurrency(runningTotal)}
                          </TableCell>
                          <TableCell>{p.receiptNumber ?? "-"}</TableCell>
                          <TableCell>{p.paymentMethod ?? "-"}</TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                              {getUserName(p.recordedBy)}
                            </Typography>
                          </TableCell>
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
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" sx={{ pt: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={page === 0}
                    onClick={() => runSearch(page - 1)}
                    sx={{ cursor: "pointer" }}
                  >
                    Anterior
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    Página <strong>{page + 1}</strong> de <strong>{Math.ceil(total / PAGE_SIZE)}</strong>
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={(page + 1) * PAGE_SIZE >= total}
                    onClick={() => runSearch(page + 1)}
                    sx={{ cursor: "pointer" }}
                  >
                    Siguiente
                  </Button>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
