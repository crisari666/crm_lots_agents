import React from "react"
import { Link, Stack, Typography } from "@mui/material"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"
import type { ProjectLotStatusLogType } from "../types/project-lot-status-log.type"

const uploadsBaseUrl = (
  import.meta.env.VITE_URL_RAG_AGENT_UPLOADS ?? ""
).replace(/\/$/, "")

type LotInventoryHistoryListProps = {
  logs: ProjectLotStatusLogType[]
  loading: boolean
}

export default function LotInventoryHistoryListCP({
  logs,
  loading
}: LotInventoryHistoryListProps) {
  if (loading) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.loading}
      </Typography>
    )
  }
  if (logs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {s.historyEmpty}
      </Typography>
    )
  }
  return (
    <Stack spacing={1.25}>
      {logs.map((log) => (
        <Stack key={log._id} spacing={0.25}>
          <Typography variant="caption" color="text.secondary">
            {log.createdAt
              ? new Date(log.createdAt).toLocaleString()
              : ""}
          </Typography>
          <Typography variant="body2">
            {log.fromStatus} → {log.toStatus} ({log.action})
          </Typography>
          <Typography variant="caption">
            {s.historyActor}:{" "}
            {log.actorLevel === "system" || !log.actorUserId
              ? s.historySystem
              : `${log.actorUserId}${log.actorLevel ? ` · ${log.actorLevel}` : ""}`}
          </Typography>
          {log.note ? (
            <Typography variant="caption">{log.note}</Typography>
          ) : null}
          {log.evidenceFiles?.map((fileName) => (
            <Link
              key={fileName}
              href={`${uploadsBaseUrl}/${fileName}`}
              target="_blank"
              rel="noreferrer"
              variant="caption"
            >
              {fileName}
            </Link>
          ))}
        </Stack>
      ))}
    </Stack>
  )
}
