import React, { useEffect } from "react"
import { Chip, Stack, Tooltip, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks"
import { fetchProjectsThunk } from "../../features/project/slice/projects.slice"

export type ProjectChipsCPProps = {
  /** RAG project ids (customers / leads list). */
  readonly projectIds?: readonly string[]
  /** Pre-resolved title (lead conversations). */
  readonly projectTitle?: string
  readonly isAllProjects?: boolean
  readonly emptyLabel?: string
  readonly allProjectsLabel?: string
}

function shortProjectId(projectId: string): string {
  if (projectId.length <= 10) {
    return projectId
  }
  return `${projectId.slice(0, 6)}…`
}

/**
 * Compact project Chip(s) for admin tables. Resolves titles from RAG Redux when given ids.
 */
export default function ProjectChipsCP({
  projectIds,
  projectTitle,
  isAllProjects = false,
  emptyLabel = "Sin proyecto",
  allProjectsLabel = "Todos los proyectos",
}: ProjectChipsCPProps): React.ReactElement {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((state) => state.projects.projects)
  const isLoading = useAppSelector((state) => state.projects.isLoading)

  useEffect(() => {
    if ((projectIds?.length ?? 0) > 0 && projects.length === 0 && !isLoading) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projectIds, projects.length, isLoading])

  if (isAllProjects) {
    return (
      <Chip
        size="small"
        variant="outlined"
        label={allProjectsLabel}
        sx={{
          maxWidth: 200,
          "& .MuiChip-label": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      />
    )
  }

  if (projectTitle?.trim()) {
    const title = projectTitle.trim()
    return (
      <Tooltip title={title}>
        <Chip
          size="small"
          variant="outlined"
          color="primary"
          label={title}
          sx={{
            maxWidth: 200,
            cursor: "default",
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            },
          }}
        />
      </Tooltip>
    )
  }

  const ids = (projectIds ?? []).map((id) => id.trim()).filter((id) => id.length > 0)
  if (ids.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel}
      </Typography>
    )
  }

  return (
    <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} sx={{ maxWidth: 280 }}>
      {ids.map((projectId) => {
        const match = projects.find((project) => project._id === projectId)
        const title = match?.title?.trim() || shortProjectId(projectId)
        const fullTitle = match?.title?.trim() || projectId
        return (
          <Tooltip key={projectId} title={fullTitle}>
            <Chip
              size="small"
              variant="outlined"
              color="primary"
              label={title}
              sx={{
                maxWidth: 160,
                cursor: "default",
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            />
          </Tooltip>
        )
      })}
    </Stack>
  )
}
