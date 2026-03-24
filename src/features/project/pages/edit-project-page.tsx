import React from "react"
import { Box, Typography } from "@mui/material"
import EditProjectControlCP from "../components/edit-project-control-cp"
import EditProjectFormCP from "../components/edit-project-form.cp"

export default function EditProjectPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Edit Project
      </Typography>
      <EditProjectControlCP />
      <EditProjectFormCP />
    </Box>
  )
}
