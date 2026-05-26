import { Alert, Box, Typography } from "@mui/material"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "../../../app/hooks"
import { callAuditStrings as s } from "../../../i18n/locales/call-audit.strings"
import CallAuditAiReviewFiltersCP from "../components/call-audit/call-audit-ai-review-filters.cp"
import CallAuditAiReviewTableCP from "../components/call-audit/call-audit-ai-review-table.cp"

export default function CallAuditAiReviewPage() {
  const currentUser = useAppSelector((state) => state.login.currentUser)
  const isAdmin = currentUser?.level === 0
  if (!isAdmin) {
    return <Navigate to="/dashboard/customers-v2/call-audit" replace />
  }
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {s.aiReviewTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {s.aiReviewSubtitle}
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        {s.adminOnly}
      </Alert>
      <CallAuditAiReviewFiltersCP />
      <CallAuditAiReviewTableCP />
    </Box>
  )
}
