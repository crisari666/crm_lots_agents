import React, { useState } from "react"
import { IconButton, Tooltip } from "@mui/material"
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material"
import type { CustomerCallLogAdminItem } from "../../services/customers-ms.service"
import CallLogRecordingDialogCP from "./call-log-recording-dialog.cp"

export type CallLogPlayRecordingButtonCPProps = {
  callSid: string
  resolvedOutcome: CustomerCallLogAdminItem["resolvedOutcome"]
  size?: "small" | "medium"
}

export function canPlayCallRecording(
  resolvedOutcome: CustomerCallLogAdminItem["resolvedOutcome"],
  callSid: string | undefined
): boolean {
  const sid = (callSid ?? "").trim()
  return resolvedOutcome === "answered" && sid.startsWith("CA")
}

export default function CallLogPlayRecordingButtonCP({
  callSid,
  resolvedOutcome,
  size = "small",
}: CallLogPlayRecordingButtonCPProps) {
  const [open, setOpen] = useState(false)
  if (!canPlayCallRecording(resolvedOutcome, callSid)) {
    return null
  }
  return (
    <>
      <Tooltip title="Reproducir grabación">
        <span>
          <IconButton
            size={size}
            aria-label="Reproducir grabación de la llamada"
            onClick={() => setOpen(true)}
            sx={{
              cursor: "pointer",
              transition: "color 0.2s ease, background-color 0.2s ease",
            }}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <CallLogRecordingDialogCP
        open={open}
        callSid={callSid}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
