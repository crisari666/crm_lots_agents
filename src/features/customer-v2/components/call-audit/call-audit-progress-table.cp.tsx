import { useMemo, useState } from "react"
import {
  Alert,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { AppConstants } from "../../../../app/app-constants"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import { clearCallAuditErrorAct } from "../../redux/customer-call-audit.slice"
import CallAuditFormDialogCP from "./call-audit-form-dialog.cp"

function resolveUserLabel(
  userId: string,
  users: { _id?: string; name?: string; lastName?: string }[]
): string {
  const user = users.find((u) => u._id === userId)
  if (user === undefined) {
    return userId
  }
  return [user.name, user.lastName].filter(Boolean).join(" ").trim() || userId
}

export default function CallAuditProgressTableCP() {
  const dispatch = useAppDispatch()
  const { progress, loadingProgress, error, config } = useAppSelector((state) => state.customerCallAudit)
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const [auditCallLogId, setAuditCallLogId] = useState<string | null>(null)
  const required =
    progress?.required ??
    config?.requiredHumanAuditsPerMonth ??
    AppConstants.call_audit_required_per_month
  const rows = useMemo(() => progress?.agents ?? [], [progress?.agents])
  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearCallAuditErrorAct())}>
          {error}
        </Alert>
      ) : null}
      {loadingProgress ? <LinearProgress sx={{ mb: 2 }} /> : null}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.agentColumn}</TableCell>
              <TableCell>{s.progressColumn}</TableCell>
              <TableCell>{s.pendingColumn}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loadingProgress ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary">
                    Sin datos para el mes seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const label = resolveUserLabel(row.agentExternalRef, usersOriginal)
              const pct = required > 0 ? Math.min(100, (row.humanAuditCount / required) * 100) : 0
              return (
                <TableRow key={row.agentExternalRef} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {label}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 180 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        {row.humanAuditCount} / {required}
                      </Typography>
                      <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 1 }} />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {row.pendingCallLogIds.length === 0 ? (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      ) : (
                        row.pendingCallLogIds.slice(0, 8).map((id) => (
                          <Chip
                            key={id}
                            size="small"
                            label={s.auditCall}
                            onClick={() => setAuditCallLogId(id)}
                            sx={{ cursor: "pointer" }}
                          />
                        ))
                      )}
                      {row.pendingCallLogIds.length > 8 ? (
                        <Typography variant="caption" color="text.secondary">
                          +{row.pendingCallLogIds.length - 8}
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
      {auditCallLogId !== null ? (
        <CallAuditFormDialogCP
          open
          callLogId={auditCallLogId}
          onClose={() => setAuditCallLogId(null)}
        />
      ) : null}
    </>
  )
}
