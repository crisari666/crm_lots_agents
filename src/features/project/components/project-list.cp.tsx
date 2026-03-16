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
  Link
} from "@mui/material"
import { Edit as EditIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { fetchProjectsThunk } from "../slice/projects.slice"
import { ProjectType } from "../types/project.types"

export default function ProjectListCP() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { projects, isLoading, error } = useAppSelector((state: RootState) => state.projects)

  useEffect(() => {
    dispatch(fetchProjectsThunk())
  }, [dispatch])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatMoney = (n: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
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
            <TableCell>Ubicación</TableCell>
            <TableCell align="right">Precio venta</TableCell>
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
                <Typography variant="body2" fontWeight="medium">
                  {project.title}
                </Typography>
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
              <TableCell align="right">{formatMoney(project.priceSell)}</TableCell>
              <TableCell align="right">{formatMoney(project.commissionValue)}</TableCell>
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
              <TableCell colSpan={6} align="center">
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
