import { useCallback, useEffect, useState } from "react"
import {
  Alert,
  Button,
  Chip,
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
  Tooltip,
  Typography,
} from "@mui/material"
import {
  HeadsetMic as HeadsetMicIcon,
  HeadsetOff as HeadsetOffIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from "@mui/icons-material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setCoachRuntimeListeners } from "./lib/twilio-coach-runtime"
import {
  clearCoachErrors,
  fetchActiveLiveCallsThunk,
  joinCoachCallThunk,
  leaveCoachCallThunk,
  selectLiveCall,
  sendCoachNoteThunk,
  setCoachMutedState,
  setCoachPhase,
} from "./redux/live-calls.slice"
import type { ActiveLiveCallItem } from "./services/voip-live-calls.types"

const compactCellSx = { py: 0.75, px: 1 }

const coachPhaseLabels: Record<string, string> = {
  idle: "Sin conexión",
  connecting: "Conectando…",
  open: "Coach activo",
  closed: "Desconectado",
  error: "Error",
}

export default function LiveCallsListCP() {
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector((s) => s.login.currentUser)
  const {
    items,
    loading,
    error,
    selectedCallSid,
    coachSession,
    coachPhase,
    coachError,
    coachMuted,
    noteSending,
    noteError,
  } = useAppSelector((s) => s.liveCalls)

  const [noteDraft, setNoteDraft] = useState("")

  const selectedCall = items.find((c) => c.callSid === selectedCallSid) ?? null
  const supervisorUserId = currentUser?._id ?? ""
  const supervisorName = currentUser?.name ?? "Supervisor"
  const isCoaching = coachPhase === "open" || coachPhase === "connecting"

  useEffect(() => {
    setCoachRuntimeListeners({
      onPhase: (phase) => dispatch(setCoachPhase(phase)),
      onError: (message) => {
        dispatch(setCoachPhase("error"))
        console.error("[live-calls] coach error:", message)
      },
    })
    return () => {
      setCoachRuntimeListeners({})
    }
  }, [dispatch])

  useEffect(() => {
    void dispatch(fetchActiveLiveCallsThunk())
    const timer = window.setInterval(() => {
      void dispatch(fetchActiveLiveCallsThunk())
    }, 5000)
    return () => window.clearInterval(timer)
  }, [dispatch])

  useEffect(() => {
    return () => {
      void dispatch(leaveCoachCallThunk())
    }
  }, [dispatch])

  const handleRefresh = useCallback(() => {
    void dispatch(fetchActiveLiveCallsThunk())
  }, [dispatch])

  const handleSelectCall = useCallback(
    (callSid: string) => {
      if (isCoaching && selectedCallSid !== callSid) return
      dispatch(selectLiveCall(callSid))
      setNoteDraft("")
    },
    [dispatch, isCoaching, selectedCallSid]
  )

  const handleJoinCoach = useCallback(() => {
    if (!selectedCallSid || !supervisorUserId) return
    void dispatch(
      joinCoachCallThunk({
        callSid: selectedCallSid,
        supervisorUserId,
      })
    )
  }, [dispatch, selectedCallSid, supervisorUserId])

  const handleLeaveCoach = useCallback(() => {
    void dispatch(leaveCoachCallThunk())
    setNoteDraft("")
  }, [dispatch])

  const handleSendNote = useCallback(() => {
    const message = noteDraft.trim()
    if (!selectedCall || !message) return
    const agentUserId = selectedCall.agentExternalRef
    if (!agentUserId) return
    void dispatch(
      sendCoachNoteThunk({
        callSid: selectedCall.callSid,
        agentUserId,
        message,
        supervisorName,
      })
    ).then((result) => {
      if (sendCoachNoteThunk.fulfilled.match(result)) {
        setNoteDraft("")
      }
    })
  }, [dispatch, noteDraft, selectedCall, supervisorName])

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {items.length} llamada{items.length === 1 ? "" : "s"} activa{items.length === 1 ? "" : "s"}
        </Typography>
        <Tooltip title="Actualizar">
          <span>
            <IconButton size="small" onClick={handleRefresh} disabled={loading}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
        <Table size="small" sx={{ "& .MuiTableCell-root": compactCellSx }}>
          <TableHead>
            <TableRow>
              <TableCell>Inicio</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Números</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    Cargando…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {!loading && items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography variant="body2" color="text.secondary">
                    No hay llamadas activas en este momento.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {items.map((row) => (
              <LiveCallRow
                key={row.callSid}
                row={row}
                selected={row.callSid === selectedCallSid}
                disabled={isCoaching && row.callSid !== selectedCallSid}
                onSelect={() => handleSelectCall(row.callSid)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedCall ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Coaching — {selectedCall.from} → {selectedCall.to}
          </Typography>

          {coachError ? (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearCoachErrors())}
            >
              {coachError}
            </Alert>
          ) : null}
          {noteError ? (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => dispatch(clearCoachErrors())}
            >
              {noteError}
            </Alert>
          ) : null}

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              size="small"
              label={coachPhaseLabels[coachPhase] ?? coachPhase}
              color={coachPhase === "open" ? "success" : coachPhase === "error" ? "error" : "default"}
            />
            {coachSession ? (
              <Typography variant="caption" color="text.secondary">
                Conferencia: {coachSession.conferenceName}
              </Typography>
            ) : null}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 2 }}>
            {!isCoaching ? (
              <Button
                variant="contained"
                startIcon={<HeadsetMicIcon />}
                onClick={handleJoinCoach}
                disabled={!supervisorUserId}
              >
                Unirse como coach
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<HeadsetOffIcon />}
                  onClick={handleLeaveCoach}
                >
                  Salir del coach
                </Button>
                <Button
                  variant="outlined"
                  startIcon={coachMuted ? <MicOffIcon /> : <MicIcon />}
                  onClick={() => dispatch(setCoachMutedState(!coachMuted))}
                >
                  {coachMuted ? "Activar micrófono" : "Silenciar micrófono"}
                </Button>
              </>
            )}
          </Stack>

          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Nota al agente
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "flex-start" }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              placeholder="Escribe una sugerencia para el agente…"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              disabled={!selectedCall.agentExternalRef || noteSending}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendNote}
              disabled={!noteDraft.trim() || !selectedCall.agentExternalRef || noteSending}
            >
              Enviar
            </Button>
          </Stack>
          {!selectedCall.agentExternalRef ? (
            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
              Esta llamada no tiene referencia de agente; no se pueden enviar notas.
            </Typography>
          ) : null}
        </Paper>
      ) : null}
    </>
  )
}

function LiveCallRow({
  row,
  selected,
  disabled,
  onSelect,
}: {
  row: ActiveLiveCallItem
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  const started = moment(row.startedAt)
  return (
    <TableRow hover selected={selected} sx={{ opacity: disabled ? 0.5 : 1 }}>
      <TableCell>
        <Typography variant="body2" fontWeight={selected ? 600 : 400}>
          {started.format("HH:mm:ss")}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {started.fromNow()}
        </Typography>
      </TableCell>
      <TableCell>
        <Chip size="small" label={row.status} />
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>
          {row.from} → {row.to}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" noWrap>
          {row.agentExternalRef ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        {row.coachConnected ? (
          <Chip size="small" color="info" label={`${row.coachCount} coach`} />
        ) : (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <Button size="small" onClick={onSelect} disabled={disabled}>
          {selected ? "Seleccionada" : "Seleccionar"}
        </Button>
      </TableCell>
    </TableRow>
  )
}
