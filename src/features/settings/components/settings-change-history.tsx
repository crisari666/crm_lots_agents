import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { getSettingsHistoryThunk } from "../slice/settings.slice"
import type { RootState } from "../../../app/store"

function formatSettingValue(value: unknown): string {
  if (value === undefined || value === null) {
    return "—"
  }
  if (typeof value === "string") {
    return value
  }
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

/**
 * Root-only change history for app settings. Owns its Redux subscription.
 */
export default function SettingsChangeHistory() {
  const dispatch = useAppDispatch()
  const isRoot = useAppSelector(
    (state: RootState) => state.login.currentUser?.root === true,
  )
  const { history, historyLoading, historyError, settings } = useAppSelector(
    (state) => state.settings,
  )
  const settingsRevision = settings
    .map((setting) => `${setting._id}:${setting.updatedAt ?? ""}`)
    .join("|")

  useEffect(() => {
    if (!isRoot) {
      return
    }
    dispatch(getSettingsHistoryThunk())
  }, [dispatch, isRoot, settingsRevision])

  if (!isRoot) {
    return null
  }

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Settings change history
      </Typography>
      {historyLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={28} />
        </Box>
      )}
      {!historyLoading && historyError != null && (
        <Typography color="error" variant="body2">
          {historyError}
        </Typography>
      )}
      {!historyLoading && historyError == null && history.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No setting changes recorded yet.
        </Typography>
      )}
      {!historyLoading && history.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Who</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Previous</TableCell>
                <TableCell>Next</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>{row.actorEmail || row.actorUserId}</TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {row.action === "create"
                      ? "—"
                      : formatSettingValue(row.previousValue)}
                  </TableCell>
                  <TableCell>{formatSettingValue(row.nextValue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  )
}
