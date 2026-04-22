import React from "react"
import { List, ListItem, Typography } from "@mui/material"
import moment from "moment"
import type { CustomerAdminNote } from "../../services/customers-ms.service"

export type CustomerDetailNotesTabCPProps = {
  notes: CustomerAdminNote[]
}

export default function CustomerDetailNotesTabCP({ notes }: CustomerDetailNotesTabCPProps) {
  if (notes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Sin notas registradas.
      </Typography>
    )
  }
  return (
    <List dense sx={{ bgcolor: "grey.50", borderRadius: 1, maxHeight: 420, overflow: "auto" }}>
      {notes.map((n) => (
        <ListItem
          key={n.id}
          sx={{
            flexDirection: "column",
            alignItems: "stretch",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {moment(n.date).format("DD/MM/YYYY HH:mm")} · usuario {n.user}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", pt: 0.5 }}>
            {n.description}
          </Typography>
        </ListItem>
      ))}
    </List>
  )
}
