import React, { useEffect, useMemo, useState } from "react"
import { Alert, Box, Snackbar } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import ProjectReleasesControlsCP from "../components/project-releases-controls.cp"
import ProjectReleasesListCP from "../components/project-releases-list.cp"
import ProjectReleaseDialogCP from "../components/project-release-dialog.cp"
import {
  clearProjectReleasesErrorAct,
  fetchProjectReleasesThunk
} from "../slice/project-releases.slice"
import type { ProjectRelease } from "../types/project-release.types"

export default function ProjectReleasesPage() {
  const dispatch = useAppDispatch()
  const { listTab, error, items } = useAppSelector((s) => s.projectReleases)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [editId, setEditId] = useState<string | null>(null)

  const editRelease = useMemo(
    () => (editId ? items.find((r) => r._id === editId) ?? null : null),
    [editId, items]
  )

  useEffect(() => {
    dispatch(fetchProjectReleasesThunk(listTab))
  }, [dispatch, listTab])

  const openCreate = () => {
    dispatch(clearProjectReleasesErrorAct())
    setDialogMode("create")
    setEditId(null)
    setDialogOpen(true)
  }

  const openEdit = (release: ProjectRelease) => {
    dispatch(clearProjectReleasesErrorAct())
    setDialogMode("edit")
    setEditId(release._id)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditId(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <ProjectReleasesControlsCP onAddClick={openCreate} />
      <ProjectReleasesListCP onEdit={openEdit} />
      <ProjectReleaseDialogCP
        open={dialogOpen}
        onClose={closeDialog}
        mode={dialogMode}
        initialRelease={dialogMode === "edit" ? editRelease : null}
        listTab={listTab}
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => dispatch(clearProjectReleasesErrorAct())}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => dispatch(clearProjectReleasesErrorAct())} variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
