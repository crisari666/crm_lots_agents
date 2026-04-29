import { useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import CustomerEventsFiltersCP from "../components/customer-events/customer-events-filters.cp"
import CustomerEventsListCP from "../components/customer-events/customer-events-list.cp"
import { fetchCustomerEventsAdminThunk } from "../redux/customer-events.slice"

export default function CustomersEventsPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.customerEvents.filters)

  useEffect(() => {
    void dispatch(
      fetchCustomerEventsAdminThunk({
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
        eventType: filters.eventType || undefined,
        officeId: filters.officeId || undefined,
        userId: filters.userId || undefined,
        limit: filters.limit,
        skip: filters.page * filters.limit,
      })
    )
  }, [dispatch])

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Customer events
      </Typography>
      <CustomerEventsFiltersCP />
      <CustomerEventsListCP />
    </Box>
  )
}
