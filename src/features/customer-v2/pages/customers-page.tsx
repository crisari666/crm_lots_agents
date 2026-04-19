import React from "react"
import { Box } from "@mui/material"
import CustomerControlsCP from "../components/customer-controls.cp"
import CustomerListCP from "../components/customer-list.cp"

export default function CustomersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <CustomerControlsCP />
      <CustomerListCP />
    </Box>
  )
}
