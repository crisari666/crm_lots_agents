import { useMemo } from "react"
import {
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
import { useAppSelector } from "../../../../app/hooks"
import { AppConstants } from "../../../../app/app-constants"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import { isCallAuditAuditorLevel } from "../../business-logic/call-audit-auditor-levels"
import { getUserLevelDesc } from "../../../../utils/user.utils"
import { resolveCallAuditUserLabel } from "./call-audit-user-label.util"

export default function CallAuditAuditorProgressTableCP() {
  const { auditorProgress, loadingAuditorProgress, config } = useAppSelector(
    (state) => state.customerCallAudit
  )
  const usersOriginal = useAppSelector((state) => state.users.usersOriginal)
  const required =
    auditorProgress?.required ??
    config?.requiredHumanAuditsPerMonth ??
    AppConstants.call_audit_required_per_month
  const countByAuditorId = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of auditorProgress?.auditors ?? []) {
      map.set(row.auditorUserId, row.humanAuditCount)
    }
    return map
  }, [auditorProgress?.auditors])
  const rows = useMemo(() => {
    const eligibleUsers = usersOriginal.filter((user) =>
      isCallAuditAuditorLevel(user.level)
    )
    return eligibleUsers
      .map((user) => {
        const userId = user._id ?? ""
        const humanAuditCount = countByAuditorId.get(userId) ?? 0
        return {
          userId,
          name: resolveCallAuditUserLabel(userId, usersOriginal),
          roleLabel: getUserLevelDesc(user.level ?? -1),
          humanAuditCount,
        }
      })
      .sort((a, b) => {
        const aMet = a.humanAuditCount >= required
        const bMet = b.humanAuditCount >= required
        if (aMet !== bMet) {
          return aMet ? 1 : -1
        }
        if (a.humanAuditCount !== b.humanAuditCount) {
          return a.humanAuditCount - b.humanAuditCount
        }
        return a.name.localeCompare(b.name)
      })
  }, [countByAuditorId, required, usersOriginal])
  return (
    <>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
        {s.auditorProgressTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.auditorProgressSubtitle}
      </Typography>
      {loadingAuditorProgress ? <LinearProgress sx={{ mb: 2 }} /> : null}
      <TableContainer component={Paper} variant="outlined" sx={{ overflowX: "auto", mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{s.auditorColumn}</TableCell>
              <TableCell>{s.roleColumn}</TableCell>
              <TableCell>{s.progressColumn}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loadingAuditorProgress ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" color="text.secondary">
                    {s.noAuditorsForProgress}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : null}
            {rows.map((row) => {
              const pct =
                required > 0 ? Math.min(100, (row.humanAuditCount / required) * 100) : 0
              const isQuotaMet = required > 0 && row.humanAuditCount >= required
              return (
                <TableRow key={row.userId} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {row.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {row.roleLabel}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 200 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        {row.humanAuditCount} / {required}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        color={isQuotaMet ? "success" : "primary"}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
