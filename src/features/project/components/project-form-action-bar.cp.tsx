import React from "react"
import { Box } from "@mui/material"

type ProjectFormActionBarCPProps = {
  children: React.ReactNode
}

export default function ProjectFormActionBarCP({ children }: ProjectFormActionBarCPProps) {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 2,
        mt: 3,
        mx: -3,
        mb: -3,
        px: 3,
        py: 2,
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
        borderBottomRightRadius: (theme) => theme.shape.borderRadius
      }}
    >
      {children}
    </Box>
  )
}
