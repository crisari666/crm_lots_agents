import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import GroupsIcon from "@mui/icons-material/Groups"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  fetchSignupCampaignRegistrationsThunk,
  selectSignupCampaignAct,
  selectSignupCampaignsError,
  selectSignupCampaignsItems,
  selectSignupCampaignsLoading,
  selectUpdatingSignupCampaignId,
  updateSignupCampaignThunk,
} from "../slice/signup-campaign.slice"
import type { SignupCampaignAdminItem } from "../types/signup-campaign.types"

function formatDateTime(iso: string): string {
  if (iso == null || iso === "") {
    return "—"
  }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return "—"
  }
  return d.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

function resolveAgentSignupBaseUrl(): string {
  const fromAgent = (import.meta.env.VITE_AGENT_BASE_URL as string | undefined)?.trim() ?? ""
  if (fromAgent !== "") {
    return fromAgent
  }
  return (import.meta.env.VITE_SIGNUP_PUBLIC_BASE_URL as string | undefined)?.trim() ?? ""
}

function buildPublicLinkFallback(code: string): string {
  const base = resolveAgentSignupBaseUrl()
  if (base === "") {
    return ""
  }
  const trimmed = base.replace(/\/$/, "")
  return `${trimmed}/signup?code=${encodeURIComponent(code)}`
}

function CampaignPublicLinkCell({ campaign }: { readonly campaign: SignupCampaignAdminItem }) {
  const [copied, setCopied] = useState(false)
  const link =
    campaign.publicLink != null && campaign.publicLink !== ""
      ? campaign.publicLink
      : buildPublicLinkFallback(campaign.code)
  const handleCopy = useCallback(async () => {
    if (link === "") return
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [link])
  if (link === "") {
    return (
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {campaign.code}
        </Typography>
      </TableCell>
    )
  }
  return (
    <TableCell sx={{ maxWidth: 320 }}>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Tooltip title={link}>
          <Typography
            variant="body2"
            component="span"
            sx={{
              flex: 1,
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}
          >
            {link}
          </Typography>
        </Tooltip>
        <Tooltip title={copied ? "Copiado" : "Copiar enlace público"}>
          <span>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                void handleCopy()
              }}
              aria-label="Copiar enlace público"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Abrir enlace público">
          <IconButton
            component={Link}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            color="primary"
            aria-label="Abrir enlace público en nueva pestaña"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </TableCell>
  )
}

export default function SignupCampaignsList() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectSignupCampaignsItems)
  const isLoading = useAppSelector(selectSignupCampaignsLoading)
  const error = useAppSelector(selectSignupCampaignsError)
  const updatingId = useAppSelector(selectUpdatingSignupCampaignId)
  if (error != null && error !== "") {
    return <Alert severity="error">{error}</Alert>
  }
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    )
  }
  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        Aún no has creado campañas de registro. Pulsa "Crear campaña" para comenzar.
      </Typography>
    )
  }
  const handleToggleEnabled = (campaign: SignupCampaignAdminItem, next: boolean) => {
    void dispatch(
      updateSignupCampaignThunk({
        id: campaign.id,
        body: { enabled: next },
      }),
    )
  }
  const handleViewRegistrations = (campaign: SignupCampaignAdminItem) => {
    dispatch(selectSignupCampaignAct(campaign.id))
    void dispatch(fetchSignupCampaignRegistrationsThunk(campaign.id))
  }
  return (
    <TableContainer component={Paper} sx={{ mt: 1 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Código / Enlace</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Fin</TableCell>
            <TableCell align="center">Habilitada</TableCell>
            <TableCell align="right">Registros</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((campaign) => (
            <TableRow key={campaign.id} hover>
              <TableCell>
                <Stack spacing={0.25}>
                  <Typography variant="body2" fontWeight={600}>
                    {campaign.name}
                  </Typography>
                  {campaign.description !== "" ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ maxWidth: 280 }}
                    >
                      {campaign.description}
                    </Typography>
                  ) : null}
                </Stack>
              </TableCell>
              <CampaignPublicLinkCell campaign={campaign} />
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarMonthIcon fontSize="inherit" color="action" />
                  <Typography variant="body2">
                    {formatDateTime(campaign.dateStart)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <CalendarMonthIcon fontSize="inherit" color="action" />
                  <Typography variant="body2">
                    {formatDateTime(campaign.dateEnd)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Switch
                  size="small"
                  checked={campaign.enabled}
                  disabled={updatingId === campaign.id}
                  onChange={(_, checked) => handleToggleEnabled(campaign, checked)}
                  inputProps={{
                    "aria-label": campaign.enabled
                      ? "Deshabilitar campaña"
                      : "Habilitar campaña",
                  }}
                />
              </TableCell>
              <TableCell align="right">
                <Chip
                  size="small"
                  variant="outlined"
                  color={campaign.signupsCount > 0 ? "primary" : "default"}
                  label={campaign.signupsCount}
                />
              </TableCell>
              <TableCell align="center">
                <Tooltip title="Ver registros">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewRegistrations(campaign)}
                    aria-label="Ver registros de la campaña"
                  >
                    <GroupsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
