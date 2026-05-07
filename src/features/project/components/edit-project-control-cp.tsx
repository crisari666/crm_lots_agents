import React, { useState } from "react"
import { Box, Button } from "@mui/material"
import { Description as DescriptionIcon } from "@mui/icons-material"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../app/hooks"
import { getProjectByIdThunk } from "../slice/projects.slice"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import ProjectDocumentIngestionDialogCP from "./project-document-ingestion-dialog.cp"

export default function EditProjectControlCP() {
  const dispatch = useAppDispatch()
  const { projectId } = useParams<{ projectId: string }>()
  const [ingestionOpen, setIngestionOpen] = useState(false)

  if (!projectId) {
    return null
  }

  return (
    <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        startIcon={<DescriptionIcon />}
        onClick={() => setIngestionOpen(true)}
      >
        {s.documentIngestionButton}
      </Button>
      <ProjectDocumentIngestionDialogCP
        open={ingestionOpen}
        onClose={() => setIngestionOpen(false)}
        projectId={projectId}
        onIngestSuccess={() => {
          dispatch(getProjectByIdThunk(projectId))
        }}
      />
    </Box>
  )
}
