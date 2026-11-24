import { Box, Button, Stack, Typography } from "@mui/material"
import type { ReactNode } from "react"

type Props = {
  readonly title: string
  readonly body: string
  readonly icon?: ReactNode
  readonly actionLabel?: string
  readonly actionIcon?: ReactNode
  readonly onAction?: () => void
}

/** Empty state: what is missing, why it matters, and the primary action. */
export default function SectionEmptyStateCP(props: Props) {
  return (
    <Stack
      alignItems="flex-start"
      spacing={1.5}
      sx={{
        py: 5,
        px: { xs: 0, sm: 1 },
        maxWidth: 520,
      }}
    >
      {props.icon != null ? (
        <Box aria-hidden sx={{ color: "text.secondary", display: "flex" }}>
          {props.icon}
        </Box>
      ) : null}
      <Typography variant="h6" component="h3">
        {props.title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {props.body}
      </Typography>
      {props.actionLabel != null && props.onAction != null ? (
        <Button variant="contained" startIcon={props.actionIcon} onClick={props.onAction}>
          {props.actionLabel}
        </Button>
      ) : null}
    </Stack>
  )
}
