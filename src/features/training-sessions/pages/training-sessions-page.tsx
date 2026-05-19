import { Box, Button } from "@mui/material"
import { useState } from "react"
import TrainingSessionsList from "../components/training-sessions-list"
import TrainingSessionsDetail from "../components/training-sessions-detail"
import TrainingSessionsFormDialog from "../components/training-sessions-form-dialog"

export default function TrainingSessionsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)} sx={{ cursor: "pointer" }}>
          Nueva sesión
        </Button>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.2fr) minmax(0, 2fr)" },
          gap: 2
        }}
      >
        <TrainingSessionsList />
        <TrainingSessionsDetail />
      </Box>
      <TrainingSessionsFormDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Box>
  )
}
