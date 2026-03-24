import React, { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { Add as AddIcon, Apartment as AmenitiesIcon, Public as PublicIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import AmenitiesDialogCP from "./amenities-dialog.cp"
import GlobalDocumentIngestionDialogCP from "./global-document-ingestion-dialog.cp"

export default function ProjectControlsCP() {
  const navigate = useNavigate()
  const [amenitiesOpen, setAmenitiesOpen] = useState(false)
  const [globalIngestionOpen, setGlobalIngestionOpen] = useState(false)

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h4" component="h1">
        Projects
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          startIcon={<PublicIcon />}
          onClick={() => setGlobalIngestionOpen(true)}
        >
          {s.globalIngestionButton}
        </Button>
        <Button
          variant="outlined"
          startIcon={<AmenitiesIcon />}
          onClick={() => setAmenitiesOpen(true)}
        >
          Amenities
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/dashboard/create-project")}
        >
          Add Project
        </Button>
      </Box>
      <AmenitiesDialogCP open={amenitiesOpen} onClose={() => setAmenitiesOpen(false)} />
      <GlobalDocumentIngestionDialogCP
        open={globalIngestionOpen}
        onClose={() => setGlobalIngestionOpen(false)}
      />
    </Box>
  )
}
