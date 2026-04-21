import React from "react"
import { Box, Button, Typography } from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"

type ProjectReleasesControlsCPProps = {
  onAddClick: () => void
}

export default function ProjectReleasesControlsCP({ onAddClick }: ProjectReleasesControlsCPProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        flexWrap: "wrap",
        gap: 2
      }}
    >
      <Typography variant="h4" component="h1">
        Proyectos finalizado
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddClick} sx={{ cursor: "pointer" }}>
        Agregar proyecto release
      </Button>
    </Box>
  )
}
