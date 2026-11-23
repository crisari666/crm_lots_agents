import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import type { CustomerDownPaymentItem } from "../../customer-v2/services/customer-payments-ms.types"
import { salesDownPaymentsReportStrings as s } from "../../../i18n/locales/sales-down-payments-report.strings"

const PAGE_SIZE = 50

export type SalesReportTableProps = {
  readonly rows: CustomerDownPaymentItem[]
  readonly total: number
  readonly page: number
  readonly onPageChange: (page: number) => void
  readonly resolveAgentName: (userId: string) => string
  readonly resolveProjectName: (projectId: string, fallback?: string) => string
}

const headerCellSx = {
  fontWeight: 600,
  typography: "caption",
  color: "text.secondary",
  letterSpacing: 0.06,
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  })
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Paginated detail table of down-payment sales.
 */
export default function SalesReportTableCP(props: SalesReportTableProps) {
  const { rows, total, page, onPageChange, resolveAgentName, resolveProjectName } = props
  const from = total === 0 ? 0 : page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, total)
  const canPrev = page > 0
  const canNext = to < total
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ py: 2, px: 2.5, "&:last-child": { pb: 2 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {s.tableTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.showingOf
                .replace("{from}", String(from))
                .replace("{to}", String(to))
                .replace("{total}", String(total))}
            </Typography>
          </Stack>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={headerCellSx}>{s.colCustomer}</TableCell>
                  <TableCell sx={headerCellSx}>{s.colProject}</TableCell>
                  <TableCell sx={headerCellSx}>{s.colLot}</TableCell>
                  <TableCell sx={headerCellSx} align="right">
                    {s.colExpected}
                  </TableCell>
                  <TableCell sx={headerCellSx} align="right">
                    {s.colPaid}
                  </TableCell>
                  <TableCell sx={headerCellSx} align="right">
                    {s.colRemaining}
                  </TableCell>
                  <TableCell sx={headerCellSx}>{s.colStatus}</TableCell>
                  <TableCell sx={headerCellSx}>{s.colAgent}</TableCell>
                  <TableCell sx={headerCellSx}>{s.colDate}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell>
                      <Link
                        component={RouterLink}
                        to="/dashboard/customers-v2"
                        underline="hover"
                        color="inherit"
                        title={s.openCustomer}
                        sx={{ cursor: "pointer", fontWeight: 500 }}
                      >
                        {row.customerName ?? row.customerId}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {resolveProjectName(row.projectId, row.projectName)}
                    </TableCell>
                    <TableCell>{row.lotNumber}</TableCell>
                    <TableCell align="right">{formatCurrency(row.expectedValue)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.totalPaid)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.remaining)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          row.status === "completed" ? s.statusCompleted : s.statusPending
                        }
                        color={row.status === "completed" ? "success" : "warning"}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{resolveAgentName(row.recordedBy)}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatDate(row.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button
              size="small"
              disabled={!canPrev}
              onClick={() => onPageChange(page - 1)}
              sx={{ cursor: canPrev ? "pointer" : "default" }}
            >
              {s.prevPage}
            </Button>
            <Button
              size="small"
              disabled={!canNext}
              onClick={() => onPageChange(page + 1)}
              sx={{ cursor: canNext ? "pointer" : "default" }}
            >
              {s.nextPage}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export { PAGE_SIZE as SALES_REPORT_PAGE_SIZE }
