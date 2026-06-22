import { useCallback, useEffect, useState } from "react"
import { Button, Stack, TextField, Typography } from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { sendCoachNoteThunk } from "../redux/live-calls.slice"

export default function LiveCallCoachNoteFormCP() {
  const dispatch = useAppDispatch()
  const selectedCallSid = useAppSelector((s) => s.liveCalls.selectedCallSid)
  const selectedCall = useAppSelector((s) =>
    s.liveCalls.items.find((c) => c.callSid === s.liveCalls.selectedCallSid)
  )
  const noteSending = useAppSelector((s) => s.liveCalls.noteSending)
  const supervisorName = useAppSelector((s) => s.login.currentUser?.name ?? "Supervisor")

  const [noteDraft, setNoteDraft] = useState("")

  useEffect(() => {
    setNoteDraft("")
  }, [selectedCallSid])

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

  if (!selectedCall) return null

  const agentExternalRef = selectedCall.agentExternalRef

  return (
    <>
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
          disabled={!agentExternalRef || noteSending}
        />
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSendNote}
          disabled={!noteDraft.trim() || !agentExternalRef || noteSending}
        >
          Enviar
        </Button>
      </Stack>
      {!agentExternalRef ? (
        <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: "block" }}>
          Esta llamada no tiene referencia de agente; no se pueden enviar notas.
        </Typography>
      ) : null}
    </>
  )
}
