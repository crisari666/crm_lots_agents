import React from "react"
import { Box, Typography } from "@mui/material"
import CreateProjectFormCP from "../components/create-project-form.cp"

export default function CreateProjectPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Project
      </Typography>
      <CreateProjectFormCP />
    </Box>
  )
}
