import RefreshIcon from "@mui/icons-material/Refresh"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  clearWebinarConvertFeedback,
  convertWebinarLeadThunk,
  deleteWebinarLeadThunk,
  fetchWebinarLeadsThunk,
  selectWebinarState,
  setWebinarLeadsStatusFilter,
} from "../slice/webinar.slice"
import type { WebinarLead, WebinarLeadStatus } from "../types/webinar.types"
import WebinarLeadFormDataDialog from "./webinar-lead-form-data-dialog"
import WebinarLeadFormDialog from "./webinar-lead-form-dialog"
import WebinarLeadsImportDialog from "./webinar-leads-import-dialog"

const leadStatusLabel: Record<WebinarLeadStatus, string> = {
  registered: s.leadsFilterRegistered,
  converted: s.leadsFilterConverted,
  discarded: s.leadsFilterDiscarded,
}

type WebinarLeadsSectionProps = {
  readonly webinarEventId: string
}

export default function WebinarLeadsSection({
  webinarEventId,
}: WebinarLeadsSectionProps) {
  const dispatch = useAppDispatch()
  const {
    leads,
    leadsTotal,
    leadsStatusFilter,
    leadsLoading,
    leadsError,
    convertingLeadId,
    convertError,
    convertSuccessMessage,
    deletingLeadId,
    deleteLeadError,
  } = useAppSelector(selectWebinarState)
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [formDataLead, setFormDataLead] = useState<WebinarLead | null>(null)

  useEffect(() => {
    void dispatch(
      fetchWebinarLeadsThunk({
        webinarEventId,
        status: leadsStatusFilter,
      })
    )
  }, [dispatch, webinarEventId, leadsStatusFilter])

  const handleRefreshLeads = () => {
    void dispatch(
      fetchWebinarLeadsThunk({
        webinarEventId,
        status: leadsStatusFilter,
      })
    )
  }

  const handleConvert = (leadId: string) => {
    if (!window.confirm(s.convertConfirm)) {
      return
    }
    void dispatch(convertWebinarLeadThunk(leadId))
  }

  const handleDeleteLead = (leadId: string) => {
    if (!window.confirm(s.deleteLeadConfirm)) {
      return
    }
    void dispatch(deleteWebinarLeadThunk(leadId))
  }

  return (
    <Box sx={{ mt: 1.25 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
        flexWrap="wrap"
        useFlexGap
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {s.leadsTitle} ({leadsTotal})
        </Typography>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="webinar-leads-status-filter">{s.columnLeadStatus}</InputLabel>
            <Select
              labelId="webinar-leads-status-filter"
              label={s.columnLeadStatus}
              value={leadsStatusFilter}
              onChange={(event) =>
                dispatch(
                  setWebinarLeadsStatusFilter(
                    event.target.value as WebinarLeadStatus | ""
                  )
                )
              }
            >
              <MenuItem value="">{s.leadsFilterAll}</MenuItem>
              <MenuItem value="registered">{s.leadsFilterRegistered}</MenuItem>
              <MenuItem value="converted">{s.leadsFilterConverted}</MenuItem>
              <MenuItem value="discarded">{s.leadsFilterDiscarded}</MenuItem>
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="contained"
            onClick={() => setIsAddLeadOpen(true)}
          >
            {s.addLead}
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsImportOpen(true)}
          >
            {s.importLeads}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={
              leadsLoading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <RefreshIcon fontSize="small" />
              )
            }
            onClick={handleRefreshLeads}
            disabled={leadsLoading}
          >
            {s.refreshLeads}
          </Button>
        </Stack>
      </Stack>
      {convertSuccessMessage != null ? (
        <Alert
          severity="success"
          sx={{ mb: 1, py: 0.25 }}
          onClose={() => dispatch(clearWebinarConvertFeedback())}
        >
          {convertSuccessMessage}
        </Alert>
      ) : null}
      {convertError != null ? (
        <Alert
          severity="error"
          sx={{ mb: 1, py: 0.25 }}
          onClose={() => dispatch(clearWebinarConvertFeedback())}
        >
          {convertError}
        </Alert>
      ) : null}
      {deleteLeadError != null ? (
        <Alert
          severity="error"
          sx={{ mb: 1, py: 0.25 }}
          onClose={() => dispatch(clearWebinarConvertFeedback())}
        >
          {deleteLeadError}
        </Alert>
      ) : null}
      {leadsError != null ? (
        <Alert severity="error" sx={{ mb: 1, py: 0.25 }}>
          {leadsError}
        </Alert>
      ) : null}
      {!leadsLoading && leads.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          {s.noLeads}
        </Typography>
      ) : null}
      {leads.length > 0 ? (
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: 0.75 }}>{s.columnName}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnPhone}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnEmail}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnNotification}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnCustomer}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnLeadStatus}</TableCell>
              <TableCell sx={{ py: 0.75 }}>{s.columnActions}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => {
              const customerId = lead.convertedCustomerId ?? lead.customerId
              const isConverting = convertingLeadId === lead.id
              const isDeleting = deletingLeadId === lead.id
              const isBusy = isConverting || isDeleting
              return (
                <TableRow key={lead.id} hover>
                  <TableCell sx={{ py: 0.5 }}>
                    {[lead.name, lead.lastName].filter(Boolean).join(" ")}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>{lead.phone}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>{lead.email || "—"}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    {lead.notificationSentAt != null ? (
                      <Chip size="small" color="success" label={s.notificationSent} sx={{ height: 22 }} />
                    ) : lead.notificationError != null ? (
                      <Chip
                        size="small"
                        color="error"
                        label={s.notificationError}
                        title={lead.notificationError}
                        sx={{ height: 22 }}
                      />
                    ) : (
                      <Chip size="small" label={s.notificationPending} sx={{ height: 22 }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    {customerId != null ? (
                      <Link
                        component={RouterLink}
                        to={`/dashboard/customers-v2?customerId=${customerId}`}
                        variant="body2"
                      >
                        {s.viewCustomer}
                      </Link>
                    ) : (
                      s.noCustomer
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>{leadStatusLabel[lead.status]}</TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {(lead.mappedFields != null &&
                        Object.keys(lead.mappedFields).length > 0) ||
                      (lead.fieldData != null && lead.fieldData.length > 0) ? (
                        <Button
                          size="small"
                          variant="text"
                          disabled={isBusy}
                          onClick={() => setFormDataLead(lead)}
                        >
                          {s.viewFormData}
                        </Button>
                      ) : null}
                      {lead.status === "registered" ? (
                        <Button
                          size="small"
                          variant="text"
                          disabled={isBusy}
                          onClick={() => handleConvert(lead.id)}
                        >
                          {isConverting ? s.converting : s.convertToCustomer}
                        </Button>
                      ) : null}
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        disabled={isBusy}
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        {isDeleting ? s.deletingLead : s.deleteLead}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : null}
      <WebinarLeadFormDialog
        open={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        webinarEventId={webinarEventId}
      />
      <WebinarLeadsImportDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        webinarEventId={webinarEventId}
      />
      <WebinarLeadFormDataDialog
        open={formDataLead != null}
        onClose={() => setFormDataLead(null)}
        lead={formDataLead}
      />
    </Box>
  )
}
