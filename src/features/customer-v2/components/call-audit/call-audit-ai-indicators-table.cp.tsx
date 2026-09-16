import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import { callAuditStrings as s } from "../../../../i18n/locales/call-audit.strings"
import type { CallAuditIndicatorResult } from "../../services/customers-ms-admin-call-audit.types"

export type CallAuditAiIndicatorsTableCPProps = {
  indicators: CallAuditIndicatorResult[]
  interestScore?: number
  totalScore?: number
  maxScore?: number
}

function buildIndicatorTooltip(ind: CallAuditIndicatorResult): string {
  const status = ind.passed ? s.indicatorPassed : s.indicatorFailed
  const points = `${ind.pointsEarned ?? 0}/${ind.maxPoints ?? 0} ${s.pointsLabel}`
  if (ind.rationale !== undefined && ind.rationale !== "") {
    return `${status} (${points}): ${ind.rationale}`
  }
  return `${ind.label}: ${status} (${points})`
}

export default function CallAuditAiIndicatorsTableCP({
  indicators,
  interestScore,
  totalScore,
  maxScore,
}: CallAuditAiIndicatorsTableCPProps) {
  const hasInterestScore = interestScore !== undefined
  const hasTotalScore = totalScore !== undefined
  if (indicators.length === 0 && !hasInterestScore && !hasTotalScore) {
    return null
  }
  return (
    <TableContainer>
      <Table size="small" aria-label={s.indicatorsResumeAria}>
        <TableHead>
          <TableRow>
            {indicators.map((ind) => (
              <TableCell key={ind.key} align="center" sx={{ fontWeight: 600, py: 1, px: 0.75 }}>
                <Tooltip title={`${ind.label} (${ind.maxPoints ?? 0} ${s.pointsLabel})`}>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      display: "inline-block",
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      verticalAlign: "bottom",
                    }}
                  >
                    {ind.label}
                  </Typography>
                </Tooltip>
              </TableCell>
            ))}
            {hasTotalScore ? (
              <TableCell align="center" sx={{ fontWeight: 600, py: 1, px: 0.75 }}>
                <Typography variant="caption" component="span">
                  {s.totalScore}
                </Typography>
              </TableCell>
            ) : null}
            {hasInterestScore ? (
              <TableCell align="center" sx={{ fontWeight: 600, py: 1, px: 0.75 }}>
                <Typography variant="caption" component="span">
                  {s.interestScore}
                </Typography>
              </TableCell>
            ) : null}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {indicators.map((ind) => (
              <TableCell key={ind.key} align="center" sx={{ py: 0.75, px: 0.75 }}>
                <Tooltip title={buildIndicatorTooltip(ind)}>
                  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
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
                    <Typography variant="caption" color="text.secondary">
                      {ind.pointsEarned ?? 0}/{ind.maxPoints ?? 0}
                    </Typography>
                  </span>
                </Tooltip>
              </TableCell>
            ))}
            {hasTotalScore ? (
              <TableCell align="center" sx={{ py: 0.75, px: 0.75 }}>
                <Typography variant="body2" fontWeight={700} component="span" aria-label={s.totalScore}>
                  {totalScore}/{maxScore ?? 100}
                </Typography>
              </TableCell>
            ) : null}
            {hasInterestScore ? (
              <TableCell align="center" sx={{ py: 0.75, px: 0.75 }}>
                <Typography variant="body2" fontWeight={700} component="span" aria-label={s.interestScore}>
                  {interestScore}
                </Typography>
              </TableCell>
            ) : null}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
