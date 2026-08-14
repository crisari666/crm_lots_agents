import React from "react"
import { Box } from "@mui/material"
import { useParams } from "react-router-dom"
import LotInventoryWorkspaceCP from "../components/lot-inventory-workspace.cp"

export default function LotInventoryWorkspacePage() {
  const { projectId } = useParams<{ projectId: string }>()
  if (!projectId) {
    return null
  }
  return (
    <Box sx={{ p: 3 }}>
      <LotInventoryWorkspaceCP projectId={projectId} />
    </Box>
  )
}
