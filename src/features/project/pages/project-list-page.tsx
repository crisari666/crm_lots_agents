import React from "react"
import { Box } from "@mui/material"
import ProjectControlsCP from "../components/project-controls.cp"
import ProjectListCP from "../components/project-list.cp"

export default function ProjectListPage() {
  return (
    <Box sx={{ p: 3 }}>
      <ProjectControlsCP />
      <ProjectListCP />
    </Box>
  )
}
