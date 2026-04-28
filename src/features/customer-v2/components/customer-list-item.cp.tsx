import React from "react"
import { Chip, IconButton, TableCell, TableRow, Tooltip, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { Visibility as VisibilityIcon } from "@mui/icons-material"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch } from "../../../app/hooks"
import type { CustomerAdminListItem } from "../services/customers-ms.service"
import { fetchCustomerAdminDetailThunk } from "../redux/customer-v2.slice"
import CustomerAssigneeCellCP from "./customer-assignee-cell.cp"

export type CustomerListItemCPProps = {
  row: CustomerAdminListItem
  users: UserInterface[]
  userById: Map<string, UserInterface>
  onAssigneeUpdated: () => void
}

function displayName(row: CustomerAdminListItem): string {
  const full = `${row.name ?? ""} ${row.lastName ?? ""}`.trim()
  return full || "—"
}

function userFullName(u: Pick<UserInterface, "name" | "lastName">): string {
  return `${u.name ?? ""} ${u.lastName ?? ""}`.trim() || "—"
}

export default function CustomerListItemCP({
  row,
  users,
  userById,
  onAssigneeUpdated,
}: CustomerListItemCPProps) {
  const dispatch = useAppDispatch()
  const assignedUser = row.assignedTo ? userById.get(row.assignedTo) ?? null : null
  const creatorUser = row.createdBy ? userById.get(row.createdBy) ?? null : null
  const creatorIsPhysical = creatorUser?.physical ?? null
  const createdLabel = new Date(row.createdAt).toLocaleString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  const stepLabel = row.currentStep?.trim() ? row.currentStep : "Sin paso"
  const stepColor = row.currentStepColor?.trim()
  const hasStep = Boolean(row.currentStep?.trim())
  const isCreatorNonPhysical = creatorIsPhysical === false

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
          <Tooltip
            title={creatorUser.email?.trim() ? creatorUser.email : "Sin email"}
            placement="top"
            enterDelay={400}
          >
            <Chip
              size="small"
              variant="outlined"
              label={userFullName(creatorUser)}
              sx={{
                cursor: "default",
                maxWidth: 220,
                "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                ...(isCreatorNonPhysical
                  ? {
                      borderColor: "#7e57c2",
                      bgcolor: alpha("#7e57c2", 0.14),
                      color: "#5e35b1",
                    }
                  : {}),
              }}
            />
          </Tooltip>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Chip
          label={stepLabel}
          size="small"
          variant="outlined"
          sx={{
            cursor: "default",
            ...(stepColor && hasStep
              ? {
                  borderColor: stepColor,
                  bgcolor: alpha(stepColor, 0.14),
                  color: "text.primary",
                }
              : hasStep
                ? { borderColor: "info.main", color: "info.dark" }
                : {}),
          }}
          color={!stepColor && hasStep ? "info" : "default"}
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
