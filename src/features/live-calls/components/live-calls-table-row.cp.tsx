import { memo, useCallback } from "react"
import { Button, Chip, TableCell, TableRow, Typography } from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { useLiveCallAgentLabel } from "../hooks/use-live-call-agent-label"
import { selectLiveCall } from "../redux/live-calls.slice"

type LiveCallsTableRowCPProps = {
  callSid: string
}

function LiveCallsTableRowCP({ callSid }: LiveCallsTableRowCPProps) {
  const dispatch = useAppDispatch()
  const row = useAppSelector((s) => s.liveCalls.items.find((c) => c.callSid === callSid))
  const selectedCallSid = useAppSelector((s) => s.liveCalls.selectedCallSid)
  const coachPhase = useAppSelector((s) => s.liveCalls.coachPhase)

  const agentLabel = useLiveCallAgentLabel(row?.agentExternalRef)

  if (!row) return null

  const selected = selectedCallSid === callSid
  const isCoaching = coachPhase === "open" || coachPhase === "connecting"
  const disabled = isCoaching && !selected

  const handleSelect = useCallback(() => {
    if (disabled) return
    dispatch(selectLiveCall(callSid))
  }, [callSid, disabled, dispatch])

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
        <Typography variant="body2" noWrap fontWeight={500}>
          {agentLabel}
        </Typography>
        {row.agentExternalRef && agentLabel !== row.agentExternalRef ? (
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {row.agentExternalRef}
          </Typography>
        ) : null}
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
        <Button size="small" onClick={handleSelect} disabled={disabled}>
          {selected ? "Seleccionada" : "Seleccionar"}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default memo(LiveCallsTableRowCP)
