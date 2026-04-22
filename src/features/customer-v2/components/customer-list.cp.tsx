import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import { alpha } from "@mui/material/styles"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { clearListErrorAct, fetchCustomerListAdminThunk } from "../redux/customer-v2.slice"
import moment from "moment"
import { listCustomerStepsV2, type CustomerStepV2 } from "../../steps-v2/services/customer-steps-v2.service"
import type { FilterFormState } from "../types/filter-form.types"
import { aggregateStepsFromListItems } from "../utils/aggregate-steps-from-list-items"
import { buildCustomerListQueryParams } from "../utils/build-customer-list-query"
import CustomerDetailDialogCP from "./customer-detail-dialog.cp"
import CustomerListFiltersCP from "./customer-list-filters.cp"
import CustomerListItemCP from "./customer-list-item.cp"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50] as const

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
  const dispatch = useAppDispatch()
  const items = useAppSelector((s) => s.customerV2.listItems)
  const total = useAppSelector((s) => s.customerV2.listTotal)
  const loading = useAppSelector((s) => s.customerV2.listLoading)
  const error = useAppSelector((s) => s.customerV2.listError)
  const usersFromSlice = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users,
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  const [steps, setSteps] = useState<CustomerStepV2[]>([])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const users = useMemo(
    () => usersFromSlice.filter((user) => user.physical === true),
    [usersFromSlice],
  )

  const userById = useMemo(() => {
    const m = new Map<string, UserInterface>()
    for (const u of users) {
      if (u._id) {
        m.set(u._id, u)
      }
    }
    return m
  }, [users])

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  useEffect(() => {
    void listCustomerStepsV2()
      .then((list) => {
        if (Array.isArray(list)) setSteps(list)
      })
      .catch(() => {
        setSteps([])
      })
  }, [])

  const load = useCallback(async () => {
    const params = {
      ...buildCustomerListQueryParams(applied),
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    }
    await dispatch(fetchCustomerListAdminThunk(params))
  }, [applied, page, rowsPerPage, dispatch])

  useEffect(() => {
    void load()
  }, [load])

  const stepDigest = useMemo(() => aggregateStepsFromListItems(items), [items])

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

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <CustomerDetailDialogCP users={users} />
      <CustomerListFiltersCP
        draft={draft}
        setDraft={setDraft}
        loading={loading}
        onSearch={handleSearch}
        users={users}
        steps={steps}
      />

      {stepDigest.length > 0 && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Total por paso en filas mostradas (esta página)
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
            {stepDigest.map((row) => {
              const c = row.color?.trim()
              return (
                <Chip
                  key={row.customerStepId ?? "__none__"}
                  size="small"
                  variant="outlined"
                  label={`${row.name}: ${row.count}`}
                  sx={{
                    cursor: "default",
                    maxWidth: 320,
                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                    ...(c
                      ? {
                          borderColor: c,
                          bgcolor: alpha(c, 0.12),
                        }
                      : {}),
                  }}
                />
              )
            })}
          </Stack>
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ m: 2, mb: 0 }}
          onClose={() => dispatch(clearListErrorAct())}
        >
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
              <TableCell sx={{ fontWeight: 700, width: 48 }} aria-label="Ver detalle" />
              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Asignado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Creador</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Paso actual</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    No hay resultados con los filtros actuales.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              items.map((row) => {
                const assignedUser = row.assignedTo ? userById.get(row.assignedTo) ?? null : null
                const creatorUser = row.createdBy ? userById.get(row.createdBy) ?? null : null
                const createdLabel = moment(row.createdAt).format("DD/MM/YYYY HH:mm")
                return (
                  <CustomerListItemCP
                    key={row.id}
                    row={row}
                    users={users}
                    assignedUser={assignedUser}
                    creatorUser={creatorUser}
                    createdLabel={createdLabel}
                    onAssigneeUpdated={() => void load()}
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
