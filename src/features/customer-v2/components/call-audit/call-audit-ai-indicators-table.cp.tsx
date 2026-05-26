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
}

function buildIndicatorTooltip(ind: CallAuditIndicatorResult): string {
  const status = ind.passed ? s.indicatorPassed : s.indicatorFailed
  if (ind.rationale !== undefined && ind.rationale !== "") {
    return `${status}: ${ind.rationale}`
  }
  return `${ind.label}: ${status}`
}

export default function CallAuditAiIndicatorsTableCP({
  indicators,
  interestScore,
}: CallAuditAiIndicatorsTableCPProps) {
  const hasInterestScore = interestScore !== undefined
  if (indicators.length === 0 && !hasInterestScore) {
    return null
  }
  return (
    <TableContainer>
      <Table size="small" aria-label={s.indicatorsResumeAria}>
        <TableHead>
          <TableRow>
            {indicators.map((ind) => (
              <TableCell key={ind.key} align="center" sx={{ fontWeight: 600, py: 1, px: 0.75 }}>
                <Tooltip title={ind.label}>
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
                  <span style={{ display: "inline-flex", lineHeight: 0 }}>
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
                  </span>
                </Tooltip>
              </TableCell>
            ))}
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
