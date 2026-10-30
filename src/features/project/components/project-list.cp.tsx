import React, { useEffect } from "react"
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Alert,
  Link,
  Switch,
  Chip,
  Stack,
  Tooltip
} from "@mui/material"
import { Edit as EditIcon, InfoOutlined as InfoOutlinedIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import {
  fetchProjectsThunk,
  setProjectEnabledThunk,
  setProjectExternalDistributionThunk
} from "../slice/projects.slice"
import { ProjectType } from "../types/project.types"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectStockPublicLinkCP from "./project-stock-public-link.cp"

export default function ProjectListCP() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projects, isLoading, error } = useAppSelector((state: RootState) => state.projects)

  useEffect(() => {
    dispatch(fetchProjectsThunk())
  }, [dispatch])

  const handleToggleEnabled = (project: ProjectType, enabled: boolean) => {
    if (!project._id) return
    dispatch(setProjectEnabledThunk({ id: project._id, enabled }))
  }

  const handleToggleExternalDistribution = (project: ProjectType, externalDistribution: boolean) => {
    if (!project._id) return
    dispatch(setProjectExternalDistributionThunk({ id: project._id, externalDistribution }))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatMoneyCop = (n: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(n)
  }

  const formatMoneyUsd = (n: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(n)
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )
  }

  const formatLocation = (project: ProjectType) => {
    const parts = [project.city, project.state, project.country].filter(Boolean)
    return parts.length ? parts.join(", ") : project.location || "-"
  }

  const getMapsQuery = (project: ProjectType) => {
    const parts = [project.city, project.state, project.country].filter(Boolean)
    const query = parts.length ? parts.join(", ") : project.location
    return query ? encodeURIComponent(query) : ""
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>{s.listColPublicStock}</TableCell>
            <TableCell align="center">Habilitado</TableCell>
            <TableCell align="center">
              <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
                <span>{s.listColExternalDistribution}</span>
                <Tooltip title={s.listExternalDistributionHint} arrow>
                  <InfoOutlinedIcon fontSize="inherit" sx={{ color: "text.secondary", cursor: "help" }} />
                </Tooltip>
              </Stack>
            </TableCell>
            <TableCell>Ubicación</TableCell>
            <TableCell align="right">Precio venta (COP)</TableCell>
            <TableCell align="right">Precio (USD)</TableCell>
            <TableCell align="right">Comisión (COP)</TableCell>
            <TableCell>Creado</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project: ProjectType) => (
            <TableRow
              key={project._id}
              hover
              onClick={() => navigate(`/dashboard/edit-project/${project._id}`)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="medium">
                    {project.title}
                  </Typography>
                  {project.externalDistribution === true && (
                    <Chip label={s.listExternalChip} size="small" color="secondary" variant="outlined" />
                  )}
                </Stack>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <ProjectStockPublicLinkCP projectId={project._id} />
              </TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <Switch
                  size="small"
                  color="primary"
                  checked={project.enabled === true}
                  onChange={(_, checked) => handleToggleEnabled(project, checked)}
                  disabled={isLoading}
                />
              </TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <Switch
                  size="small"
                  color="secondary"
                  checked={project.externalDistribution === true}
                  onChange={(_, checked) => handleToggleExternalDistribution(project, checked)}
                  disabled={isLoading}
                  inputProps={{ "aria-label": `${s.listColExternalDistribution}: ${project.title}` }}
                />
              </TableCell>
              <TableCell>
                {getMapsQuery(project) ? (
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${getMapsQuery(project)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="body2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {formatLocation(project).length > 45
                      ? `${formatLocation(project).slice(0, 45)}...`
                      : formatLocation(project)}
                  </Link>
                ) : (
                  formatLocation(project)
                )}
              </TableCell>
              <TableCell align="right">{formatMoneyCop(project.priceSell)}</TableCell>
              <TableCell align="right">
                {formatMoneyUsd(project.priceSellUsd ?? 0)}
              </TableCell>
              <TableCell align="right">{formatMoneyCop(project.commissionValue)}</TableCell>
              <TableCell>{formatDate(project.createdAt)}</TableCell>
              <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/dashboard/edit-project/${project._id}`)}
                  disabled={isLoading}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={10} align="center">
                <Typography variant="body2" color="text.secondary">
                  No se encontraron proyectos
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
