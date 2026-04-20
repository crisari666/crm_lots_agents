import { Add } from "@mui/icons-material"
import { Box, Button } from "@mui/material"

export type StepsV2ControlsCpProps = {
  onAddStep: () => void
}

export default function StepsV2ControlsCp({ onAddStep }: StepsV2ControlsCpProps) {
  return (
    <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" startIcon={<Add />} onClick={onAddStep}>
        Add Step
      </Button>
    </Box>
  )
}
