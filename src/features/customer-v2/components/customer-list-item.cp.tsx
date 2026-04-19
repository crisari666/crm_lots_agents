import React from "react"
import { Chip, TableCell, TableRow, Typography } from "@mui/material"
import type { CustomerAdminListItem } from "../services/customers-ms.service"

export type CustomerListItemCPProps = {
  row: CustomerAdminListItem
  assignedLabel: string
  createdLabel: string
}

function displayName(row: CustomerAdminListItem): string {
  const full = `${row.name ?? ""} ${row.lastName ?? ""}`.trim()
  return full || "—"
}

export default function CustomerListItemCP({
  row,
  assignedLabel,
  createdLabel,
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
        {row.assignedTo ? (
          <Chip
            title={assignedLabel}
            label={assignedLabel}
            size="small"
            variant="outlined"
            sx={{ maxWidth: 260, "& .MuiChip-label": { display: "block", overflow: "hidden", textOverflow: "ellipsis" } }}
          />
        ) : (
          <Typography variant="body2" color="text.disabled">
            Sin asignar
          </Typography>
        )}
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
