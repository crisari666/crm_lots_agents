import React, { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { Add as AddIcon, Apartment as AmenitiesIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import AmenitiesDialogCP from "./amenities-dialog.cp"

export default function ProjectControlsCP() {
  const navigate = useNavigate()
  const [amenitiesOpen, setAmenitiesOpen] = useState(false)

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h4" component="h1">
        Projects
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
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
    </Box>
  )
}
