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
import type { FilterFormState } from "../types/filter-form.types"
import { aggregateStepsFromListItems } from "../utils/aggregate-steps-from-list-items"
import { buildCustomerListQueryParams } from "../utils/build-customer-list-query"
import { resolveCustomerListScopeUserIds } from "../business-logic/resolve-customer-list-scope-user-ids"
import CustomerDetailDialogCP from "./customer-detail-dialog.cp"
import CustomerListItemCP from "./customer-list-item.cp"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"

const ROWS_PER_PAGE_OPTIONS = [50, 100, 200] as const

export type CustomerListCPProps = {
  applied: FilterFormState
  /** Increment to refetch after mutations (e.g. new customer). */
  refreshVersion?: number
}

export default function CustomerListCP({
  applied,
  refreshVersion = 0,
}: CustomerListCPProps) {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((s) => s.login.currentUser)
  const items = useAppSelector((s) => s.customerV2.listItems)
  const stepDistribution = useAppSelector((s) => s.customerV2.listStepDistribution)
  const total = useAppSelector((s) => s.customerV2.listTotal)
  const loading = useAppSelector((s) => s.customerV2.listLoading)
  const error = useAppSelector((s) => s.customerV2.listError)
  const usersFromSlice = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users,
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)

  const scopeUserIds = useMemo(
    () =>
      resolveCustomerListScopeUserIds({
        currentUser,
        officeId: applied.officeId,
        users: usersFromSlice,
      }),
    [applied.officeId, currentUser, usersFromSlice],
  )

  const userById = useMemo(() => {
    const map = new Map<string, UserInterface>()
    for (const user of usersFromSlice) {
      if (user._id) {
        map.set(user._id, user)
      }
    }
    return map
  }, [usersFromSlice])

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const load = useCallback(async () => {
    const params = {
      ...buildCustomerListQueryParams(applied, { scopeUserIds }),
      limit: rowsPerPage,
      skip: page * rowsPerPage,
    }
    await dispatch(fetchCustomerListAdminThunk(params))
  }, [applied, page, rowsPerPage, dispatch, scopeUserIds])

  useEffect(() => {
    void load()
  }, [load])

  const stepDigest = useMemo(() => aggregateStepsFromListItems(items), [items])
  const hasStepSummary = stepDigest.length > 0 || stepDistribution.length > 0

  useLayoutEffect(() => {
    setPage(0)
  }, [applied, refreshVersion])

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
      <CustomerDetailDialogCP />

      {hasStepSummary && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider", bgcolor: "grey.50" }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Total por paso en filas mostradas (esta página)
          </Typography>
          {stepDigest.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Sin filas visibles en esta página.
            </Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1} sx={{ mb: 1 }}>
              {stepDigest.map((row) => {
                const color = row.color?.trim()
                return (
                  <Chip
                    key={`page_${row.customerStepId ?? "__none__"}`}
                    size="small"
                    variant="outlined"
                    label={`${row.name}: ${row.count}`}
                    sx={{
                      cursor: "default",
                      maxWidth: 320,
                      "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                      ...(color
                        ? {
                            borderColor: color,
                            bgcolor: alpha(color, 0.12),
                          }
                        : {}),
                    }}
                  />
                )
              })}
            </Stack>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
            Total por paso en todos los resultados filtrados (backend): {total}
          </Typography>
          {stepDistribution.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
              Sin resultados en backend para resumir por paso.
            </Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
              {stepDistribution.map((row) => {
                const color = row.color?.trim()
                return (
                  <Chip
                    key={`all_${row.customerStepId ?? "__none__"}`}
                    size="small"
                    variant="outlined"
                    label={`${row.name}: ${row.count}`}
                    sx={{
                      cursor: "default",
                      maxWidth: 320,
                      "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                      ...(color
                        ? {
                            borderColor: color,
                            bgcolor: alpha(color, 0.12),
                          }
                        : {}),
                    }}
                  />
                )
              })}
            </Stack>
          )}
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
              items.map((row) => (
                <CustomerListItemCP
                  key={row.id}
                  row={row}
                  users={usersFromSlice}
                  userById={userById}
                  onAssigneeUpdated={() => void load()}
                />
              ))
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
