import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  IconButton,
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
import {
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material"
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppDateRangeSelector from "../../../app/components/app-date-range-selector"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import { fetchProjectsThunk } from "../../project/slice/projects.slice"
import { fetchCustomerDownPaymentsThunk } from "../slice/customer-payments.slice"
import CustomerPaymentFilePreviewDialogCP from "./customer-payment-file-preview-dialog.cp"
import {
  fetchDownPaymentContractBlob,
  fetchFeeEvidenceBlob,
  listFeesByDownPaymentReq,
} from "../../customer-v2/services/customer-payments-ms.http"
import type { CustomerPaymentFeeItem } from "../../customer-v2/services/customer-payments-ms.types"
import type UserInterface from "../../../app/models/user-interface"
import type { ProjectType } from "../../project/types/project.types"
import { customerPaymentStrings as payS } from "../../../i18n/locales/customer-payment.strings"

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
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [statusFilter, setStatusFilter] = useState<"pending" | "completed" | "">("")
  const [page, setPage] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feesByDownPayment, setFeesByDownPayment] = useState<
    Record<string, CustomerPaymentFeeItem[]>
  >({})
  const [feesLoadingId, setFeesLoadingId] = useState<string | null>(null)
  const [preview, setPreview] = useState<{
    title: string
    fetchBlob: () => Promise<Blob>
  } | null>(null)

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

  const enabledProjects = useMemo(
    () => projects.filter((p) => p.enabled !== false && p.deleted !== true),
    [projects],
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
        fetchCustomerDownPaymentsThunk({
          dateFrom: dateStart.toISOString(),
          dateTo: dateEnd.toISOString(),
          recordedBy: selectedUser?._id || undefined,
          projectId: selectedProject?._id || undefined,
          status: statusFilter || undefined,
          skip: pageNum * PAGE_SIZE,
          limit: PAGE_SIZE,
        }),
      )
    },
    [dispatch, dateStart, dateEnd, selectedUser, selectedProject, statusFilter],
  )

  const formatCurrency = (value: number): string =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })

  const getUserName = (userId: string): string => {
    const u = userById.get(userId)
    if (!u) return userId
    return `${u.name ?? ""} ${u.lastName ?? ""}`.trim()
  }

  const totalPagePaid = useMemo(
    () => payments.reduce((sum, p) => sum + p.totalPaid, 0),
    [payments],
  )

  const toggleExpand = async (downPaymentId: string) => {
    if (expandedId === downPaymentId) {
      setExpandedId(null)
      return
    }
    setExpandedId(downPaymentId)
    if (feesByDownPayment[downPaymentId]) return
    setFeesLoadingId(downPaymentId)
    try {
      const fees = await listFeesByDownPaymentReq(downPaymentId)
      setFeesByDownPayment((prev) => ({ ...prev, [downPaymentId]: fees }))
    } catch {
      setFeesByDownPayment((prev) => ({ ...prev, [downPaymentId]: [] }))
    } finally {
      setFeesLoadingId(null)
    }
  }

  const statusOptions = [
    { id: "", label: "Todos" },
    { id: "pending", label: payS.statusPending },
    { id: "completed", label: payS.statusCompleted },
  ] as const

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
              flexWrap="wrap"
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
                sx={{ minWidth: 220, flex: 1 }}
                options={enabledProjects}
                value={selectedProject}
                onChange={(_, option) => setSelectedProject(option)}
                getOptionLabel={(option) => option.title}
                isOptionEqualToValue={(a, b) => a._id === b._id}
                renderInput={(params) => <TextField {...params} label="Proyecto" />}
              />
              <Autocomplete
                size="small"
                sx={{ minWidth: 200, flex: 1 }}
                options={physicalUsers}
                value={selectedUser}
                onChange={(_, option) => setSelectedUser(option)}
                getOptionLabel={(option) => `${option.name ?? ""} ${option.lastName ?? ""}`.trim()}
                isOptionEqualToValue={(a, b) => a._id === b._id}
                renderInput={(params) => <TextField {...params} label="Registrado por" />}
              />
              <Autocomplete
                size="small"
                sx={{ minWidth: 160 }}
                options={[...statusOptions]}
                value={statusOptions.find((o) => o.id === statusFilter) ?? statusOptions[0]}
                onChange={(_, option) =>
                  setStatusFilter((option?.id as "pending" | "completed" | "") ?? "")
                }
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderInput={(params) => <TextField {...params} label="Estado" />}
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
              No se encontraron separaciones para los filtros seleccionados.
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
                    Separaciones
                  </Typography>
                  <Chip
                    size="small"
                    label={`${total} registro${total !== 1 ? "s" : ""}`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Pagado en página: <strong>{formatCurrency(totalPagePaid)}</strong>
                </Typography>
              </Stack>
              <Divider />
              <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "action.hover" }}>
                      <TableCell sx={headerCellSx} width={40} />
                      <TableCell sx={headerCellSx}>Fecha</TableCell>
                      <TableCell sx={headerCellSx}>Cliente</TableCell>
                      <TableCell sx={headerCellSx}>Proyecto</TableCell>
                      <TableCell sx={headerCellSx}>Lote</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Esperado</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Pagado</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }}>Restante</TableCell>
                      <TableCell sx={headerCellSx}>Estado</TableCell>
                      <TableCell sx={headerCellSx}>Registrado por</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                        {payS.contractColumn}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {payments.map((dp) => {
                      const open = expandedId === dp.id
                      const fees = feesByDownPayment[dp.id] ?? []
                      return (
                        <Fragment key={dp.id}>
                          <TableRow hover>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => void toggleExpand(dp.id)}
                                sx={{
                                  cursor: "pointer",
                                  transform: open ? "rotate(180deg)" : "none",
                                  transition: "transform 150ms",
                                }}
                              >
                                <ExpandMoreIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                            <TableCell sx={{ whiteSpace: "nowrap" }}>
                              {new Date(dp.createdAt).toLocaleDateString("es-CO")}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                {dp.customerName ?? dp.customerId}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 160 }}>
                                {dp.projectName ?? projectById.get(dp.projectId) ?? dp.projectId}
                              </Typography>
                            </TableCell>
                            <TableCell>{dp.lotNumber}</TableCell>
                            <TableCell align="right">{formatCurrency(dp.expectedValue)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                              {formatCurrency(dp.totalPaid)}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(dp.remaining)}</TableCell>
                            <TableCell>
                              <Chip
                                size="small"
                                label={
                                  dp.status === "completed"
                                    ? payS.statusCompleted
                                    : payS.statusPending
                                }
                                color={dp.status === "completed" ? "success" : "warning"}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap sx={{ maxWidth: 140 }}>
                                {getUserName(dp.recordedBy)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {dp.hasContract ? (
                                <IconButton
                                  size="small"
                                  aria-label={payS.previewContractAria}
                                  onClick={() =>
                                    setPreview({
                                      title: payS.previewContractTitle,
                                      fetchBlob: () => fetchDownPaymentContractBlob(dp.id),
                                    })
                                  }
                                  sx={{ cursor: "pointer" }}
                                >
                                  <DescriptionOutlinedIcon fontSize="small" />
                                </IconButton>
                              ) : (
                                payS.noEvidenceDash
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={11} sx={{ py: 0, border: 0 }}>
                              <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ py: 1.5, pl: 6, pr: 2 }}>
                                  {feesLoadingId === dp.id ? (
                                    <CircularProgress size={22} />
                                  ) : fees.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">
                                      Sin abonos
                                    </Typography>
                                  ) : (
                                    <Table size="small">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Fecha</TableCell>
                                          <TableCell align="right">Valor</TableCell>
                                          <TableCell>Recibo</TableCell>
                                          <TableCell>Método</TableCell>
                                          <TableCell>Notas</TableCell>
                                          <TableCell align="center">
                                            {payS.evidenceColumn}
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {fees.map((fee) => (
                                          <TableRow key={fee.id}>
                                            <TableCell>
                                              {new Date(fee.datePayment).toLocaleDateString(
                                                "es-CO",
                                              )}
                                            </TableCell>
                                            <TableCell align="right">
                                              {formatCurrency(fee.paymentValue)}
                                            </TableCell>
                                            <TableCell>{fee.receiptNumber ?? "-"}</TableCell>
                                            <TableCell>{fee.paymentMethod ?? "-"}</TableCell>
                                            <TableCell
                                              sx={{
                                                maxWidth: 200,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                              }}
                                            >
                                              {fee.notes ?? "-"}
                                            </TableCell>
                                            <TableCell align="center">
                                              {fee.hasEvidence ? (
                                                <IconButton
                                                  size="small"
                                                  onClick={() =>
                                                    setPreview({
                                                      title: payS.previewDialogTitle,
                                                      fetchBlob: () =>
                                                        fetchFeeEvidenceBlob(fee.id),
                                                    })
                                                  }
                                                  sx={{ cursor: "pointer" }}
                                                >
                                                  <ImageOutlinedIcon fontSize="small" />
                                                </IconButton>
                                              ) : (
                                                payS.noEvidenceDash
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  )}
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {total > PAGE_SIZE && (
                <Stack
                  direction="row"
                  spacing={1.5}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ pt: 1 }}
                >
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
                    Página <strong>{page + 1}</strong> de{" "}
                    <strong>{Math.ceil(total / PAGE_SIZE)}</strong>
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
      <CustomerPaymentFilePreviewDialogCP
        open={preview !== null}
        title={preview?.title}
        fetchBlob={preview?.fetchBlob ?? null}
        onClose={() => setPreview(null)}
      />
    </Stack>
  )
}
