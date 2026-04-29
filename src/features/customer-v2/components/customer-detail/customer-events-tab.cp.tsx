import { useEffect } from "react"
import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material"
import moment from "moment"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchCustomerEventsByCustomerThunk } from "../../redux/customer-events.slice"

export default function CustomerEventsTabCP({ customerId }: { customerId: string }) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.customerEvents.detailLoading)
  const error = useAppSelector((s) => s.customerEvents.detailError)
  const items = useAppSelector((s) => s.customerEvents.detailItems[customerId] ?? [])

  useEffect(() => {
    if (customerId.trim() === "") {
      return
    }
    void dispatch(fetchCustomerEventsByCustomerThunk(customerId))
  }, [customerId, dispatch])

  if (loading && items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" py={3}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Sin eventos registrados.
      </Typography>
    )
  }

  return (
    <List dense disablePadding>
      {items.map((row) => (
        <ListItem key={row.id} divider>
          <ListItemText
            primary={`${row.eventType} · ${moment(row.createdAt).format("DD/MM/YYYY HH:mm")}`}
            secondary={`Score ${row.score ?? "-"} · ${row.description} — ${row.userId}`}
          />
        </ListItem>
      ))}
    </List>
  )
}
