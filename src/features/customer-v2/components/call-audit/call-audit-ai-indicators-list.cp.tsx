import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditIndicatorResult } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditAiIndicatorsListCPProps = {
  indicators: CallAuditIndicatorResult[]
  totalScore?: number
  maxScore?: number
}

export default function CallAuditAiIndicatorsListCP({
  indicators,
  totalScore,
  maxScore,
}: CallAuditAiIndicatorsListCPProps) {
  if (indicators.length === 0) {
    return null
  }
  return (
    <TableContainer>
      <Table size="small" aria-label={s.indicatorsResumeAria}>
        <TableBody>
          {indicators.map((ind) => (
            <TableRow key={ind.key}>
              <TableCell sx={{ border: 0, py: 0.5, pl: 0, pr: 1 }}>
                <Typography variant="body2">
                  {ind.label}{" "}
                  <Typography component="span" variant="caption" color="text.secondary">
                    ({ind.maxPoints ?? 0} {s.pointsLabel})
                  </Typography>
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ border: 0, py: 0.5, width: 72 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  {ind.pointsEarned ?? 0}/{ind.maxPoints ?? 0}
                </Typography>
                {ind.passed ? (
                  <CheckCircleOutlineIcon
                    fontSize="small"
                    color="success"
                    aria-label={`${ind.label}: ${s.indicatorPassed}`}
                  />
                ) : (
                  <CancelOutlinedIcon
                    fontSize="small"
                    color="error"
                    aria-label={`${ind.label}: ${s.indicatorFailed}`}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          {totalScore !== undefined ? (
            <TableRow>
              <TableCell sx={{ border: 0, py: 0.75, pl: 0, pr: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {s.totalScore}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ border: 0, py: 0.75 }}>
                <Typography variant="body2" fontWeight={700}>
                  {totalScore}/{maxScore ?? 100}
                </Typography>
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
