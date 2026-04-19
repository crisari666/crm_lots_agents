import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { Search as SearchIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { Moment } from "moment"
import moment from "moment"
import { fetchUsers } from "../../../app/services/users.service"
import UserInterface from "../../../app/models/user-interface"
import {
  CustomerAdminListItem,
  listCustomersAdmin,
} from "../services/customers-ms.service"
import AssignUserAutocompleteCP from "./assign-user-autocomplete.cp"
import CustomerListItemCP from "./customer-list-item.cp"

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const

export type FilterFormState = {
  /** When true, date range is not sent (`omitDateRange`); dates pickers disabled. */
  excludeFecha: boolean
  /** When true and no assignee selected, API returns only customers without `assignedTo`. */
  unassignedOnly: boolean
  /** When true, API filters `enabled !== false` (active customers). */
  enabledOnly: boolean
  createdFrom: Moment | null
  createdTo: Moment | null
  assignedTo: string
  search: string
}

export function emptyFilters(): FilterFormState {
  return {
    excludeFecha: true,
    unassignedOnly: true,
    enabledOnly: false,
    createdFrom: null,
    createdTo: null,
    assignedTo: "",
    search: "",
  }
}

export type CustomerListCPProps = {
  draft: FilterFormState
  setDraft: React.Dispatch<React.SetStateAction<FilterFormState>>
  applied: FilterFormState
  onApplyFilters: () => void
  /** Increment to refetch after mutations (e.g. new customer). */
  refreshVersion?: number
}

export default function CustomerListCP({
  draft,
  setDraft,
  applied,
  onApplyFilters,
  refreshVersion = 0,
}: CustomerListCPProps) {
  const [users, setUsers] = useState<UserInterface[]>([])

  const [items, setItems] = useState<CustomerAdminListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userLabelById = useMemo(() => {
    const m = new Map<string, string>()
    for (const u of users) {
      if (u._id) {
        const label = `${u.name ?? ""} ${u.lastName ?? ""}`.trim() + (u.email ? ` (${u.email})` : "")
        m.set(u._id, label || u.email || u._id)
      }
    }
    return m
  }, [users])

  useEffect(() => {
    void fetchUsers({ enable: true }).then((list) => {
      if (Array.isArray(list)) setUsers(list)
    })
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const search = applied.search.trim()
      const params = {
        ...(applied.excludeFecha ? { omitDateRange: true } : {}),
        ...(!applied.excludeFecha && applied.createdFrom
          ? { createdFrom: applied.createdFrom.clone().startOf("day").toISOString() }
          : {}),
        ...(!applied.excludeFecha && applied.createdTo
          ? { createdTo: applied.createdTo.clone().endOf("day").toISOString() }
          : {}),
        ...(applied.assignedTo
          ? { assignedTo: applied.assignedTo }
          : applied.unassignedOnly
            ? { unassignedOnly: true }
            : {}),
        ...(applied.enabledOnly ? { enabled: true } : {}),
        ...(search ? { search } : {}),
        limit: rowsPerPage,
        skip: page * rowsPerPage,
      }
      const res = await listCustomersAdmin(params)
      setItems(res.items)
      setTotal(res.total)
    } catch (err: unknown) {
      let message = "No se pudo cargar la lista de clientes."
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string | string[] }
        if (Array.isArray(data?.message)) {
          message = data.message.join(", ")
        } else if (typeof data?.message === "string") {
          message = data.message
        }
      }
      setError(message)
      setItems([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [applied, page, rowsPerPage, refreshVersion])

  useEffect(() => {
    void load()
  }, [load])

  useLayoutEffect(() => {
    setPage(0)
  }, [applied, refreshVersion])

  const handleSearch = () => {
    onApplyFilters()
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const clearDateFilters = () => {
    setDraft((prev) => ({ ...prev, createdFrom: null, createdTo: null }))
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Filtros
            </Typography>
            <TextField
              size="small"
              placeholder="Buscar por nombre, email o teléfono…"
              value={draft.search}
              onChange={(e) => setDraft((prev) => ({ ...prev, search: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  e.preventDefault()
                  handleSearch()
                }
              }}
              sx={{ minWidth: { xs: 1, md: 320 }, maxWidth: 480 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              disabled={loading}
              sx={{ cursor: "pointer", alignSelf: { xs: "stretch", md: "center" } }}
            >
              Buscar
            </Button>
          </Stack>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <DatePicker
              label="Creado desde"
              value={draft.createdFrom}
              onChange={(v) => setDraft((prev) => ({ ...prev, createdFrom: v }))}
              disabled={draft.excludeFecha}
              slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
            />
            <DatePicker
              label="Creado hasta"
              value={draft.createdTo}
              onChange={(v) => setDraft((prev) => ({ ...prev, createdTo: v }))}
              disabled={draft.excludeFecha}
              slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
            />
            <Box sx={{ minWidth: { xs: "100%", sm: 280 }, flex: { sm: "1 1 280px" } }}>
              <AssignUserAutocompleteCP
                users={users}
                value={draft.unassignedOnly ? "" : draft.assignedTo}
                onChange={(userId) =>
                  setDraft((prev) => ({
                    ...prev,
                    assignedTo: userId,
                    ...(userId ? { unassignedOnly: false } : {}),
                  }))
                }
                disabled={draft.unassignedOnly}
                label="Usuario asignado"
                size="small"
              />
            </Box>
            {!draft.excludeFecha && (draft.createdFrom || draft.createdTo) && (
              <Typography
                component="button"
                type="button"
                onClick={clearDateFilters}
                sx={{
                  cursor: "pointer",
                  border: "none",
                  background: "none",
                  color: "primary.main",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                  p: 0,
                  alignSelf: "center",
                }}
              >
                Limpiar fechas
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2, mb: 0 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer sx={{ position: "relative" }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
              zIndex: 1,
            }}
          >
            <CircularProgress size={36} />
          </Box>
        )}
        <Table size="small" aria-label="Lista de clientes">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Asignado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No hay resultados con los filtros actuales.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => {
                const assignedLabel = row.assignedTo
                  ? userLabelById.get(row.assignedTo) ?? row.assignedTo
                  : ""
                const createdLabel = moment(row.createdAt).format("DD/MM/YYYY HH:mm")
                return (
                  <CustomerListItemCP
                    key={row.id}
                    row={row}
                    assignedLabel={assignedLabel}
                    createdLabel={createdLabel}
                  />
                )
              })
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          labelRowsPerPage="Filas"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </Paper>
  )
}
