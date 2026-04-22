import React, { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import moment from "moment"
import type { CustomerCallLogAdminItem } from "../../services/customers-ms.service"
import { listCustomerCallLogs } from "../../services/customers-ms.service"
import CallLogStatusAvatarCP from "./call-log-status-avatar.cp"
import CustomerCallTranscriptDialogCP from "./customer-call-transcript-dialog.cp"
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
          return (
            <ListItem
              key={row.id}
              alignItems="flex-start"
              sx={{
                py: 1.5,
                px: 0,
                borderBottom: 1,
                borderColor: "divider",
                flexDirection: "column",
                alignItems: "stretch",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start" width="100%">
                <ListItemAvatar sx={{ minWidth: 48, mt: 0.25 }}>
                  <CallLogStatusAvatarCP outcome={row.resolvedOutcome} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {when.format("DD/MM/YYYY HH:mm")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {outcomeLabelEs(row.resolvedOutcome)}
                        {dir ? ` · ${dir}` : ""}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Stack component="span" spacing={0.5} sx={{ mt: 0.5 }}>
                      <Typography component="span" variant="body2" color="text.primary">
                        {formatCallDurationSeconds(row.durationSeconds)} · SID {row.callSid}
                      </Typography>
                      {(row.from || row.to) && (
                        <Typography component="span" variant="caption" color="text.secondary">
                          {[row.from, row.to].filter(Boolean).join(" → ")}
                          {peer ? ` · ${peer}` : ""}
                        </Typography>
                      )}
                    </Stack>
                  }
                  secondaryTypographyProps={{ component: "div" }}
                />
              </Stack>
              {showTranscriptBtn && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => openTranscript(row)}
                  sx={{ cursor: "pointer", alignSelf: "flex-start", mt: 1, ml: 7 }}
                >
                  Ver transcripción
                </Button>
              )}
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
