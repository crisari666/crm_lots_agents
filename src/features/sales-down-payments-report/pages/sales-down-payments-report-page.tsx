import { Box } from "@mui/material"
import SalesReportContentCP from "../components/sales-report-content.cp"

/**
 * Thin route shell for the down-payments sales report.
 */
export default function SalesDownPaymentsReportPage() {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <SalesReportContentCP />
    </Box>
  )
}
