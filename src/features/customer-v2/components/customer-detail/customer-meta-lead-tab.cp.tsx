import { useEffect } from "react"
import { Alert, Box, CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchCustomerMetaLeadMappedFieldsThunk } from "../../redux/customer-meta-lead.slice"

export default function CustomerMetaLeadTabCP({ customerId }: { customerId: string }) {
  const dispatch = useAppDispatch()
  const loading = useAppSelector((s) => s.customerMetaLead.detailLoading)
  const error = useAppSelector((s) => s.customerMetaLead.detailError)
  const items = useAppSelector((s) => s.customerMetaLead.detailItems[customerId] ?? [])
  const hasLead = useAppSelector((s) => s.customerMetaLead.detailHasLead[customerId] ?? false)

  useEffect(() => {
    if (customerId.trim() === "") {
      return
    }
    void dispatch(fetchCustomerMetaLeadMappedFieldsThunk(customerId))
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

  if (!hasLead || items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No hay datos de formulario Meta para este cliente.
      </Typography>
    )
  }

  return (
    <List dense disablePadding>
      {items.map((row) => (
        <ListItem key={row.label} divider>
          <ListItemText primary={row.label} secondary={row.value} />
        </ListItem>
      ))}
    </List>
  )
}
