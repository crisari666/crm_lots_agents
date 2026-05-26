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
}

export default function CallAuditAiIndicatorsListCP({
  indicators,
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
                <Typography variant="body2">{ind.label}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ border: 0, py: 0.5, width: 40 }}>
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
        </TableBody>
      </Table>
    </TableContainer>
  )
}
