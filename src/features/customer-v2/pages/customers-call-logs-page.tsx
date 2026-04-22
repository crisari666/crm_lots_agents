import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { Person as PersonIcon, Search as SearchIcon } from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import type { Moment } from "moment"
import moment from "moment"
import { fetchUsers } from "../../../app/services/users.service"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  clearCallLogsErrorAct,
  fetchCallLogsAdminThunk,
} from "../redux/customer-call-logs.slice"
import { fetchCustomerAdminDetailThunk } from "../redux/customer-v2.slice"
import type { ListCallLogsAdminParams } from "../services/customers-ms.service"
import CallLogStatusAvatarCP from "../components/customer-detail/call-log-status-avatar.cp"
import CustomerCallTranscriptDialogCP from "../components/customer-detail/customer-call-transcript-dialog.cp"
import CustomerDetailDialogCP from "../components/customer-detail-dialog.cp"
import { directionLabelEs, formatCallDurationSeconds, outcomeLabelEs } from "../components/customer-detail/call-log-utils"

type OutcomeFilter = NonNullable<ListCallLogsAdminParams["outcome"]>

export default function CustomersCallLogsPage() {
  const dispatch = useAppDispatch()
  const { items, total, loading, error } = useAppSelector((s) => s.customerCallLogs)

  const [users, setUsers] = useState<UserInterface[]>([])

  const [from, setFrom] = useState<Moment | null>(() => moment().subtract(7, "days").startOf("day"))
  const [to, setTo] = useState<Moment | null>(() => moment().endOf("day"))
  const [outcome, setOutcome] = useState<OutcomeFilter>("all")
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [transcriptBody, setTranscriptBody] = useState("")
  const [transcriptTitle, setTranscriptTitle] = useState("")

  const params = useMemo((): ListCallLogsAdminParams => {
    const p: ListCallLogsAdminParams = {
      outcome,
      limit: 100,
      skip: 0,
    }
    if (from) {
      p.callFrom = from.clone().startOf("day").toISOString()
    }
    if (to) {
      p.callTo = to.clone().endOf("day").toISOString()
    }
    return p
  }, [from, to, outcome])

  const rangeOk = from !== null && to !== null

  const runSearch = useCallback(() => {
    if (!rangeOk) {
      return
    }
    void dispatch(fetchCallLogsAdminThunk(params))
  }, [dispatch, params, rangeOk])

  useEffect(() => {
    if (!rangeOk) {
      return
    }
    void dispatch(fetchCallLogsAdminThunk(params))
  }, [dispatch, params, rangeOk])

  const onOutcomeChange = (e: SelectChangeEvent<OutcomeFilter>) => {
    setOutcome(e.target.value as OutcomeFilter)
  }

  useEffect(() => {
    void fetchUsers({ enable: true }).then((list) => {
      if (Array.isArray(list)) {
        setUsers(list)
      }
    })
  }, [])

  const openCustomerDetail = useCallback(
    (customerId: string) => {
      void dispatch(fetchCustomerAdminDetailThunk(customerId))
    },
    [dispatch]
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Registro de llamadas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Llamadas registradas en CRM (Twilio / voz). Estado derivado del último evento antes de
        &quot;completed&quot;.
      </Typography>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} flexWrap="wrap" useFlexGap>
          <DatePicker
            label="Desde"
            value={from}
            onChange={(v) => setFrom(v)}
            slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
          />
          <DatePicker
            label="Hasta"
            value={to}
            onChange={(v) => setTo(v)}
            slotProps={{ textField: { size: "small", sx: { minWidth: 160 } } }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="call-log-outcome-filter">Estado</InputLabel>
            <Select
              labelId="call-log-outcome-filter"
              label="Estado"
              value={outcome}
              onChange={onOutcomeChange}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="answered">Contestada</MenuItem>
              <MenuItem value="busy">Ocupado</MenuItem>
              <MenuItem value="no_answer">Sin contestar / otros</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={runSearch}
            disabled={loading || !rangeOk}
            sx={{ cursor: "pointer" }}
          >
            Actualizar
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallLogsErrorAct())}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {total} llamada{total === 1 ? "" : "s"} (máx. 100 en esta vista)
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={56} />
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Números</TableCell>
              <TableCell>Cliente ref.</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary">
                    Cargando…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography variant="body2" color="text.secondary">
                    Sin resultados para el rango y filtros seleccionados.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {items.map((row) => {
              const when = moment(row.completedAt ?? row.updatedAt ?? row.createdAt)
              const transcriptAvailable = (row.transcript ?? row.text ?? "").trim() !== ""
              const showTranscript = row.resolvedOutcome === "answered" && transcriptAvailable
              const customerKey = row.customerId ?? row.customerExternalRef
              const refLabel = customerKey ?? "—"
              const canOpenCustomer = customerKey !== undefined && customerKey !== ""
              return (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <CallLogStatusAvatarCP outcome={row.resolvedOutcome} />
                  </TableCell>
                  <TableCell>{when.format("DD/MM/YYYY HH:mm")}</TableCell>
                  <TableCell>{outcomeLabelEs(row.resolvedOutcome)}</TableCell>
                  <TableCell>{formatCallDurationSeconds(row.durationSeconds)}</TableCell>
                  <TableCell>{directionLabelEs(row.direction) || "—"}</TableCell>
                  <TableCell sx={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {[row.from, row.to].filter(Boolean).join(" → ") || "—"}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    {canOpenCustomer ? (
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => openCustomerDetail(customerKey)}
                        title="Abrir ficha del cliente"
                        sx={{
                          cursor: "pointer",
                          textTransform: "none",
                          p: 0,
                          minWidth: 0,
                          maxWidth: "100%",
                          justifyContent: "flex-start",
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        {refLabel}
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary" component="span">
                        —
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                      {canOpenCustomer ? (
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<PersonIcon fontSize="small" />}
                          onClick={() => openCustomerDetail(customerKey)}
                          sx={{ cursor: "pointer" }}
                        >
                          Cliente
                        </Button>
                      ) : null}
                      {showTranscript ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setTranscriptBody((row.transcript ?? row.text ?? "").trim())
                            setTranscriptTitle(`Transcripción · ${row.callSid}`)
                            setTranscriptOpen(true)
                          }}
                          sx={{ cursor: "pointer" }}
                        >
                          Transcripción
                        </Button>
                      ) : null}
                      {!canOpenCustomer && !showTranscript ? (
                        <Typography variant="body2" color="text.secondary" component="span">
                          —
                        </Typography>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <CustomerCallTranscriptDialogCP
        open={transcriptOpen}
        title={transcriptTitle}
        transcript={transcriptBody}
        onClose={() => setTranscriptOpen(false)}
      />

      <CustomerDetailDialogCP users={users} />
    </Box>
  )
}
