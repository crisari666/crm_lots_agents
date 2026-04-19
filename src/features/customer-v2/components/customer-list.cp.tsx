import React from "react"
import { Box, Paper, Typography } from "@mui/material"

export default function CustomerListCP() {
  return (
    <Paper variant="outlined" sx={{ p: 3, minHeight: 200 }}>
      <Typography variant="body1" color="text.secondary">
        No hay clientes listados aún. Use el botón arriba para crear uno.
      </Typography>
    </Paper>
  )
}
