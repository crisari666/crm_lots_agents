import React from "react"
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  Typography,
  Button
} from "@mui/material"
import { Edit as EditIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import {
  fetchProjectReleasesThunk,
  setListTabAct,
  setProjectReleaseEnabledThunk
} from "../slice/project-releases.slice"
import type { ProjectRelease, ProjectReleaseListStatus } from "../types/project-release.types"
import { buildProjectReleaseAssetUrl } from "../utils/project-release-assets.util"

const uploadsBaseUrl = import.meta.env.VITE_URL_RAG_AGENT_UPLOADS ?? ""

type ProjectReleasesListCPProps = {
  onEdit: (release: ProjectRelease) => void
}

export default function ProjectReleasesListCP({ onEdit }: ProjectReleasesListCPProps) {
  const dispatch = useAppDispatch()
  const { items, listTab, isLoading } = useAppSelector((s) => s.projectReleases)

  const handleTab = (_: React.SyntheticEvent, value: ProjectReleaseListStatus) => {
    dispatch(setListTabAct(value))
  }

  const handleToggleEnabled = async (release: ProjectRelease, enabled: boolean) => {
    try {
      await dispatch(setProjectReleaseEnabledThunk({ id: release._id, enabled })).unwrap()
    } catch {
      dispatch(fetchProjectReleasesThunk(listTab))
    }
  }

  const thumbUrl = (release: ProjectRelease) => {
    const first = release.images?.[0]
    if (!first) return undefined
    return buildProjectReleaseAssetUrl(uploadsBaseUrl, first)
  }

  return (
    <Box>
      <Tabs
        value={listTab}
        onChange={handleTab}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Visibles" value="enabled" sx={{ cursor: "pointer", textTransform: "none" }} />
        <Tab label="Ocultos" value="disabled" sx={{ cursor: "pointer", textTransform: "none" }} />
      </Tabs>

      {isLoading && items.length === 0 ? (
        <Typography color="text.secondary">Cargando…</Typography>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No hay registros en esta vista.</Typography>
      ) : (
        <Grid container spacing={2}>
          {items.map((release) => (
            <Grid item xs={12} sm={6} md={4} key={release._id}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  "&:hover": { boxShadow: 2, borderColor: "primary.light" }
                }}
              >
                {thumbUrl(release) ? (
                  <CardMedia
                    component="img"
                    height="140"
                    image={thumbUrl(release)}
                    alt=""
                    sx={{ objectFit: "cover", bgcolor: "action.hover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Sin imagen
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {release.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap title={release.location}>
                    {release.location}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      size="small"
                      label={release.status === "enabled" ? "Visible" : "Oculto"}
                      color={release.enabled ? "primary" : "default"}
                      variant={release.enabled ? "filled" : "outlined"}
                    />
                  </Box>
                </CardContent>
                <CardActions sx={{ flexDirection: "column", alignItems: "stretch", px: 2, pb: 2, pt: 0 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={release.enabled}
                        onChange={(_, checked) => handleToggleEnabled(release, checked)}
                        color="primary"
                      />
                    }
                    label="Visible en catálogo"
                    sx={{ m: 0, cursor: "pointer", userSelect: "none" }}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(release)}
                    sx={{ mt: 1, cursor: "pointer" }}
                  >
                    Editar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
