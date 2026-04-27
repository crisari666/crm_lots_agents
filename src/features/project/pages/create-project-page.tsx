import React from "react"
import { Box, Typography } from "@mui/material"
import CreateProjectFormCP from "../components/create-project-form.cp"

export default function CreateProjectPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        Create Project
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Primary prices and commission use Colombian pesos (COP). You can also enter an optional list price in US dollars (USD).
      </Typography>
      <CreateProjectFormCP />
    </Box>
  )
}
