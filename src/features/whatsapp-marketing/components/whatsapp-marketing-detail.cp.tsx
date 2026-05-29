import { Fragment, useEffect, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Alert,
  Box,
  Button,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  cancelWhatsappMarketingCampaignThunk,
  fetchWhatsappMarketingDetailThunk,
  retryWhatsappMarketingRecipientThunk,
  setWhatsappMarketingRecipientsStatusFilterAct,
} from "../slice/whatsapp-marketing.slice"
import {
  selectWhatsappMarketingCancelLoading,
  selectWhatsappMarketingDetailCampaign,
  selectWhatsappMarketingDetailError,
  selectWhatsappMarketingDetailLoading,
  selectWhatsappMarketingRecipients,
  selectWhatsappMarketingRecipientsStatusFilter,
  selectWhatsappMarketingRetryingRecipientId,
} from "../slice/whatsapp-marketing.selectors"
import type { WhatsappMarketingRecipientStatus } from "../services/customers-ms-whatsapp-marketing.types"

function recipientStatusColor(
  status: WhatsappMarketingRecipientStatus
): "default" | "success" | "warning" | "error" | "info" {
  if (status === "delivered" || status === "read" || status === "replied") return "success"
  if (status === "failed") return "error"
  if (status === "pending" || status === "sending") return "warning"
  if (status === "sent") return "info"
  return "default"
}

type WhatsappMarketingDetailCPProps = {
  readonly campaignId: string
}

export default function WhatsappMarketingDetailCP({
  campaignId,
}: WhatsappMarketingDetailCPProps) {
  const dispatch = useAppDispatch()
  const campaign = useAppSelector(selectWhatsappMarketingDetailCampaign)
  const recipients = useAppSelector(selectWhatsappMarketingRecipients)
  const statusFilter = useAppSelector(selectWhatsappMarketingRecipientsStatusFilter)
  const loading = useAppSelector(selectWhatsappMarketingDetailLoading)
  const error = useAppSelector(selectWhatsappMarketingDetailError)
  const retryingId = useAppSelector(selectWhatsappMarketingRetryingRecipientId)
  const cancelLoading = useAppSelector(selectWhatsappMarketingCancelLoading)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const fetchDetail = () => {
    void dispatch(
      fetchWhatsappMarketingDetailThunk({
        campaignId,
        statusFilter,
      }),
    )
  }
  useEffect(() => {
    fetchDetail()
  }, [dispatch, campaignId, statusFilter])
  useEffect(() => {
    if (campaign?.status !== "sending") return
    const timer = window.setInterval(fetchDetail, 5000)
    return () => window.clearInterval(timer)
  }, [campaign?.status, campaignId, statusFilter, dispatch])
  const handleRetry = (recipientId: string) => {
    void dispatch(
      retryWhatsappMarketingRecipientThunk({ campaignId, recipientId }),
    ).then(() => fetchDetail())
  }
  const handleCancel = () => {
    void dispatch(cancelWhatsappMarketingCampaignThunk(campaignId)).then(() => fetchDetail())
  }
  if (campaign == null && !loading) {
    return (
      <Typography color="text.secondary">
        Campaña no encontrada.{" "}
        <RouterLink to="/dashboard/whatsapp-marketing">Volver al listado</RouterLink>
      </Typography>
    )
  }
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {campaign?.name ?? "Campaña"}
          </Typography>
          <Typography color="text.secondary">
            Plantilla: {campaign?.templateName} · Modo: {campaign?.audienceMode} · Lote:{" "}
            {campaign?.batchSize} / {campaign?.batchDelayMs}ms
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton onClick={fetchDetail} aria-label="Actualizar" sx={{ cursor: "pointer" }}>
            <RefreshIcon />
          </IconButton>
          {campaign?.status === "sending" ? (
            <Button
              color="warning"
              variant="outlined"
              disabled={cancelLoading}
              onClick={handleCancel}
              sx={{ cursor: "pointer" }}
            >
              Cancelar envío
            </Button>
          ) : null}
        </Stack>
      </Stack>
      {error != null ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
      {campaign != null ? (
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
          <Chip label={`Estado: ${campaign.status}`} />
          <Chip label={`Total: ${campaign.stats.total}`} />
          <Chip label={`Pendientes: ${campaign.stats.pending}`} color="warning" />
          <Chip label={`Enviados: ${campaign.stats.sent}`} color="info" />
          <Chip label={`Entregados: ${campaign.stats.delivered}`} color="success" />
          <Chip label={`Fallidos: ${campaign.stats.failed}`} color="error" />
        </Stack>
      ) : null}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filtrar estado</InputLabel>
          <Select
            label="Filtrar estado"
            value={statusFilter}
            onChange={(e) =>
              dispatch(setWhatsappMarketingRecipientsStatusFilterAct(e.target.value))
            }
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="sent">Enviado</MenuItem>
            <MenuItem value="delivered">Entregado</MenuItem>
            <MenuItem value="failed">Fallido</MenuItem>
            <MenuItem value="replied">Respondió</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Step</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Respondió</TableCell>
              <TableCell>Resultado</TableCell>
              <TableCell>Error</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {recipients.map((row) => (
              <Fragment key={row.id}>
                <TableRow hover>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>{row.customerStepName ?? "—"}</TableCell>
                  <TableCell>
                    <Chip size="small" label={row.status} color={recipientStatusColor(row.status)} />
                  </TableCell>
                  <TableCell>
                    {row.repliedAt != null ? new Date(row.repliedAt).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell>{row.replyOutcome ?? "—"}</TableCell>
                  <TableCell>{row.errorMessage ?? "—"}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                        sx={{ cursor: "pointer" }}
                      >
                        Historial
                      </Button>
                      {row.status === "failed" ? (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={retryingId === row.id}
                          onClick={() => handleRetry(row.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          Reintentar
                        </Button>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 0, border: 0 }}>
                    <Collapse in={expandedId === row.id}>
                      <Box sx={{ py: 1, pl: 2 }}>
                        {row.statusHistory.map((h) => (
                          <Typography key={`${h.at}-${h.status}`} variant="caption" display="block">
                            {new Date(h.at).toLocaleString()} · {h.status} · {h.source}
                            {h.detail ? ` · ${h.detail}` : ""}
                          </Typography>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}
