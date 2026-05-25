import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { Subject as SubjectIcon } from "@mui/icons-material"
import moment from "moment"
import type { CustomerCallLogAdminItem } from "../../services/customers-ms.service"
import { listCustomerCallLogs } from "../../services/customers-ms.service"
import CallLogStatusAvatarCP from "./call-log-status-avatar.cp"
import CustomerCallTranscriptDialogCP from "./customer-call-transcript-dialog.cp"
import CallLogPlayRecordingButtonCP from "./call-log-play-recording-button.cp"
import { directionLabelEs, formatCallDurationSeconds, outcomeLabelEs } from "./call-log-utils"

export type CustomerCallHistoryTabCPProps = {
  customerId: string
}

export default function CustomerCallHistoryTabCP({ customerId }: CustomerCallHistoryTabCPProps) {
  const [rows, setRows] = useState<CustomerCallLogAdminItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcriptOpen, setTranscriptOpen] = useState(false)
  const [transcriptBody, setTranscriptBody] = useState("")
  const [transcriptTitle, setTranscriptTitle] = useState("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void listCustomerCallLogs(customerId)
      .then((data) => {
        if (!cancelled) {
          setRows(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("No se pudo cargar el historial de llamadas.")
          setRows([])
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [customerId])

  const openTranscript = useCallback((row: CustomerCallLogAdminItem) => {
    const text = (row.transcript ?? row.text ?? "").trim()
    setTranscriptBody(text)
    setTranscriptTitle(`Transcripción · ${row.callSid}`)
    setTranscriptOpen(true)
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress size={28} />
      </Box>
    )
  }
  if (error) {
    return (
      <Typography variant="body2" color="error">
        {error}
      </Typography>
    )
  }
  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Sin llamadas registradas para este cliente.
      </Typography>
    )
  }

  return (
    <>
      <List disablePadding sx={{ width: "100%" }}>
        {rows.map((row) => {
          const when = moment(row.completedAt ?? row.updatedAt ?? row.createdAt)
          const dir = directionLabelEs(row.direction)
          const transcriptAvailable = (row.transcript ?? row.text ?? "").trim() !== ""
          const showTranscriptBtn = row.resolvedOutcome === "answered" && transcriptAvailable
          const numbersLine = [row.from, row.to].filter(Boolean).join(" → ")
          return (
            <ListItem
              key={row.id}
              disableGutters
              sx={{
                py: 0.75,
                px: 0,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" width="100%" minWidth={0}>
                <ListItemAvatar sx={{ minWidth: 40, mt: 0 }}>
                  <CallLogStatusAvatarCP outcome={row.resolvedOutcome} />
                </ListItemAvatar>
                <Box flex={1} minWidth={0}>
                  <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" fontWeight={600}>
                      {when.format("DD/MM/YY HH:mm")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {outcomeLabelEs(row.resolvedOutcome)}
                      {dir ? ` · ${dir}` : ""}
                      {` · ${formatCallDurationSeconds(row.durationSeconds)}`}
                    </Typography>
                  </Stack>
                  {numbersLine ? (
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {numbersLine}
                    </Typography>
                  ) : null}
                </Box>
                <Stack direction="row" spacing={0.25} alignItems="center" flexShrink={0}>
                  <CallLogPlayRecordingButtonCP
                    callSid={row.callSid}
                    resolvedOutcome={row.resolvedOutcome}
                  />
                  {showTranscriptBtn ? (
                    <Tooltip title="Transcripción">
                      <IconButton
                        size="small"
                        aria-label="Ver transcripción"
                        onClick={() => openTranscript(row)}
                        sx={{ cursor: "pointer", transition: "color 0.2s ease" }}
                      >
                        <SubjectIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ) : null}
                </Stack>
              </Stack>
            </ListItem>
          )
        })}
      </List>
      <CustomerCallTranscriptDialogCP
        open={transcriptOpen}
        title={transcriptTitle}
        transcript={transcriptBody}
        onClose={() => setTranscriptOpen(false)}
      />
    </>
  )
}
