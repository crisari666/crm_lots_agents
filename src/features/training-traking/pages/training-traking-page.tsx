import { Box, Button } from "@mui/material"
import { useState } from "react"
import TrainingTrakingListCP from "../components/training-traking-list.cp"
import TrainingTrakingDetailCP from "../components/training-traking-detail.cp"
import TrainingTrakingCreateDialogCP from "../components/training-traking-create-dialog.cp"

export default function TrainingTrakingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          Nueva capacitación
        </Button>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 2fr)", gap: 2 }}>
        <TrainingTrakingListCP />
        <TrainingTrakingDetailCP />
      </Box>

      <TrainingTrakingCreateDialogCP
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Box>
  )
}

