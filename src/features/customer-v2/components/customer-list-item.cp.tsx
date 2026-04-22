import React from "react"
import { Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { Visibility as VisibilityIcon } from "@mui/icons-material"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch } from "../../../app/hooks"
import type { CustomerAdminListItem } from "../services/customers-ms.service"
import { fetchCustomerAdminDetailThunk } from "../redux/customer-v2.slice"
import CustomerAssigneeCellCP from "./customer-assignee-cell.cp"

export type CustomerListItemCPProps = {
  row: CustomerAdminListItem
  users: UserInterface[]
  assignedUser: Pick<UserInterface, "name" | "lastName" | "email"> | null
  creatorUser: Pick<UserInterface, "name" | "lastName" | "email"> | null
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
  assignedUser,
  creatorUser,
  createdLabel,
  onAssigneeUpdated,
}: CustomerListItemCPProps) {
  const dispatch = useAppDispatch()
  return (
    <TableRow
      hover
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <TableCell sx={{ py: 1, width: 48 }} padding="checkbox">
        <Tooltip title="Ver detalle">
          <IconButton
            size="small"
            aria-label="Ver detalle del cliente"
            onClick={() => void dispatch(fetchCustomerAdminDetailThunk(row.id))}
            sx={{ cursor: "pointer" }}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
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
          assignedUser={assignedUser}
          onAssigneeUpdated={onAssigneeUpdated}
        />
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        {creatorUser ? (
          <Chip
            size="small"
            variant="outlined"
            label={
              <span>
                <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
                  {`${creatorUser.name ?? ""} ${creatorUser.lastName ?? ""}`.trim() || "Sin nombre"}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                  {creatorUser.email?.trim() ? creatorUser.email : "Sin email"}
                </Typography>
              </span>
            }
            sx={{
              height: "auto",
              maxWidth: 260,
              "& .MuiChip-label": {
                display: "block",
                py: 0.5,
                whiteSpace: "normal",
              },
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Chip
          label={row.currentStep?.trim() ? row.currentStep : "Sin paso"}
          size="small"
          color={row.currentStep?.trim() ? "info" : "default"}
          variant="outlined"
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
