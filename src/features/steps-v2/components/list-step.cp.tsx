import { Chip, List, ListItemButton, ListItemText, Paper, Stack, Typography } from "@mui/material"
import type { CustomerStepV2 } from "../services/customer-steps-v2.service"

export type ListStepCpProps = {
  items: CustomerStepV2[]
  loading: boolean
  onSelectStep: (step: CustomerStepV2) => void
}

function ListStepItem({
  item,
  onClick,
}: {
  item: CustomerStepV2
  onClick: (item: CustomerStepV2) => void
}) {
  return (
    <ListItemButton onClick={() => onClick(item)} divider>
      <ListItemText
        primary={`${item.order}. ${item.name}`}
        secondary={item.description || "No description"}
      />
      <Stack direction="row" spacing={1}>
        {item.color ? (
          <Chip size="small" label={item.color} sx={{ bgcolor: item.color, color: "#fff" }} />
        ) : null}
        <Chip
          size="small"
          color={item.isActive ? "success" : "default"}
          label={item.isActive ? "Active" : "Inactive"}
        />
      </Stack>
    </ListItemButton>
  )
}

export default function ListStepCp({ items, loading, onSelectStep }: ListStepCpProps) {
  if (loading) {
    return <Typography>Loading steps...</Typography>
  }
  if (items.length === 0) {
    return <Typography>No steps yet.</Typography>
  }
  return (
    <Paper variant="outlined">
      <List disablePadding>
        {items.map((item) => (
          <ListStepItem key={item.id} item={item} onClick={onSelectStep} />
        ))}
      </List>
    </Paper>
  )
}
