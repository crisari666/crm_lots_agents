import React from "react"
import { Chip, TableCell, TableRow, Typography } from "@mui/material"
import UserInterface from "../../../app/models/user-interface"
import type { CustomerAdminListItem } from "../services/customers-ms.service"
import CustomerAssigneeCellCP from "./customer-assignee-cell.cp"

export type CustomerListItemCPProps = {
  row: CustomerAdminListItem
  users: UserInterface[]
  assignedLabel: string
  createdLabel: string
  onAssigneeUpdated: () => void
}

function displayName(row: CustomerAdminListItem): string {
  const full = `${row.name ?? ""} ${row.lastName ?? ""}`.trim()
  return full || "—"
}

export default function CustomerListItemCP({
  row,
  users,
  assignedLabel,
  createdLabel,
  onAssigneeUpdated,
}: CustomerListItemCPProps) {
  return (
    <TableRow
      hover
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" fontWeight={500}>
          {displayName(row)}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {row.phone}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220 }}>
          {row.email?.trim() ? row.email : "—"}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <CustomerAssigneeCellCP
          row={row}
          users={users}
          assignedLabel={assignedLabel}
          onAssigneeUpdated={onAssigneeUpdated}
        />
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        {row.enabled ? (
          <Chip label="Activo" size="small" color="success" variant="outlined" />
        ) : (
          <Chip label="Inactivo" size="small" color="default" variant="outlined" />
        )}
      </TableCell>
      <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
        <Typography variant="body2" color="text.secondary">
          {createdLabel}
        </Typography>
      </TableCell>
    </TableRow>
  )
}
