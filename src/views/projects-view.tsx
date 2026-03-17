import React from "react"
import { Box } from "@mui/material"
import ProjectControlsCP from "../features/project/components/project-controls.cp"
import ProjectListCP from "../features/project/components/project-list.cp"

export default function ProjectsView() {
  return (
    <Box sx={{ p: 3 }}>
      <ProjectControlsCP />
      <ProjectListCP />
    </Box>
  )
}
