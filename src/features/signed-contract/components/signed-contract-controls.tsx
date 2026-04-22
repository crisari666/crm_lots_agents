import { Paper, Stack, Typography } from "@mui/material"
import FilterByDate from "./filter-by-date"

export default function SignedContractControls() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          Filtros
        </Typography>
        <FilterByDate />
      </Stack>
    </Paper>
  )
}
