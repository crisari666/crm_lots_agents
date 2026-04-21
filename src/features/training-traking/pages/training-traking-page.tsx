import { Box, Button, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import TrainingTrakingListCP from "../components/training-traking-list.cp"
import TrainingTrakingDetailCP from "../components/training-traking-detail.cp"
import TrainingTrakingCreateDialogCP from "../components/training-traking-create-dialog.cp"
import type { TrainingListFilterType } from "../types/training-traking.types"

export default function TrainingTrakingPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<TrainingListFilterType>("all")

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setIsCreateOpen(true)}>
          Nueva capacitación
        </Button>
      </Box>
      <Tabs
        value={activeFilter}
        onChange={(_, value: TrainingListFilterType) => setActiveFilter(value)}
        sx={{ mb: 2 }}
      >
        <Tab value="all" label="Todas" />
        <Tab value="todayAndFuture" label="Hoy y futuras" />
      </Tabs>
      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 2fr)", gap: 2 }}>
        <TrainingTrakingListCP filter={activeFilter} />
        <TrainingTrakingDetailCP />
      </Box>

      <TrainingTrakingCreateDialogCP
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Box>
  )
}

