import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import CloseIcon from "@mui/icons-material/Close"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import CircularProgress from "@mui/material/CircularProgress"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  selectSelectedSignupCampaignId,
  selectSignupCampaignAct,
  selectSignupCampaignById,
  selectSignupCampaignRegistrations,
  selectSignupCampaignRegistrationsError,
  selectSignupCampaignRegistrationsLoading,
} from "../slice/signup-campaign.slice"

function formatDateTime(iso: string | null): string {
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

function CopySignUrlButton({ signUrl }: { readonly signUrl: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(signUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }, [signUrl])
  return (
    <Tooltip title={copied ? "Copiado" : "Copiar enlace de firma"}>
      <span>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            void handleCopy()
          }}
          aria-label="Copiar enlace de firma"
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default function SignupCampaignRegistrations() {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector(selectSelectedSignupCampaignId)
  const campaign = useAppSelector(selectSignupCampaignById(selectedId))
  const registrations = useAppSelector(selectSignupCampaignRegistrations)
  const isLoading = useAppSelector(selectSignupCampaignRegistrationsLoading)
  const error = useAppSelector(selectSignupCampaignRegistrationsError)
  const open = selectedId != null
  const handleClose = () => {
    dispatch(selectSignupCampaignAct(null))
  }
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", md: "70%" }, maxWidth: 1100 } }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack spacing={0.25}>
            <Typography variant="h6">
              Registros · {campaign?.name ?? ""}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Código: {campaign?.code ?? ""}
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box sx={{ mt: 2 }}>
          {error != null && error !== "" ? (
            <Alert severity="error">{error}</Alert>
          ) : null}
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : null}
          {!isLoading && registrations.length === 0 && error == null ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              Sin registros aún.
            </Typography>
          ) : null}
          {!isLoading && registrations.length > 0 ? (
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Ciudad</TableCell>
                  <TableCell>Enviado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Firmado</TableCell>
                  <TableCell align="center">Enlace firma</TableCell>
                  <TableCell align="center">PDF firmado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.document}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{formatDateTime(row.dateSent)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        color={row.signed ? "success" : "warning"}
                        variant={row.signed ? "filled" : "outlined"}
                        icon={
                          row.signed ? (
                            <CheckCircleOutlineIcon />
                          ) : (
                            <HourglassEmptyIcon />
                          )
                        }
                        label={row.signed ? "Firmado" : "Pendiente"}
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(row.dateSigned)}</TableCell>
                    <TableCell align="center">
                      {row.signUrl != null && row.signUrl !== "" ? (
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <CopySignUrlButton signUrl={row.signUrl} />
                          <Tooltip title="Abrir enlace de firma">
                            <IconButton
                              component={Link}
                              href={row.signUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              size="small"
                              color="primary"
                              aria-label="Abrir enlace de firma"
                            >
                              <OpenInNewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {row.signedPdfLink != null && row.signedPdfLink !== "" ? (
                        <Tooltip title="Abrir PDF firmado en nueva pestaña">
                          <IconButton
                            component={Link}
                            href={row.signedPdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="small"
                            color="primary"
                            aria-label="Abrir PDF firmado"
                          >
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </Box>
      </Box>
    </Drawer>
  )
}
