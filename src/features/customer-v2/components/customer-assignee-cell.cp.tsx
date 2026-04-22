import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import UserInterface from "../../../app/models/user-interface"
import type { CustomerAdminListItem } from "../services/customers-ms.service"
import { assignCustomerAssignee } from "../services/customers-ms.service"
import AssignUserAutocompleteCP from "./assign-user-autocomplete.cp"

export type CustomerAssigneeCellCPProps = {
  row: CustomerAdminListItem
  users: UserInterface[]
  assignedUser: Pick<UserInterface, "name" | "lastName" | "email"> | null
  onAssigneeUpdated: () => void
}

export default function CustomerAssigneeCellCP({
  row,
  users,
  assignedUser,
  onAssigneeUpdated,
}: CustomerAssigneeCellCPProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [draftUserId, setDraftUserId] = useState(row.assignedTo ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  /** Assignee picker: only office users with `physical` (monolith user schema); keep current assignee in list if not physical. */
  const usersForAssigneePicker = useMemo(
    () =>
      users.filter(
        (u) =>
          u._id &&
          (u.physical === true || (Boolean(row.assignedTo) && u._id === row.assignedTo)),
      ),
    [users, row.assignedTo],
  )

  useEffect(() => {
    setDraftUserId(row.assignedTo ?? "")
  }, [row.assignedTo, row.id])

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setDraftUserId(row.assignedTo ?? "")
    setError(null)
  }

  const handleClose = () => {
    if (!saving) {
      setAnchorEl(null)
      setError(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await assignCustomerAssignee(row.id, draftUserId)
      onAssigneeUpdated()
      setAnchorEl(null)
    } catch (err: unknown) {
      let message = "No se pudo actualizar el usuario asignado."
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string | string[] }
        if (Array.isArray(data?.message)) {
          message = data.message.join(", ")
        } else if (typeof data?.message === "string") {
          message = data.message
        }
      }
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const trigger = row.assignedTo ? (
    <Chip
      label={
        <Stack spacing={0} sx={{ py: 0.25 }}>
          <Typography variant="caption" sx={{ lineHeight: 1.2 }}>
            {`${assignedUser?.name ?? ""} ${assignedUser?.lastName ?? ""}`.trim() || "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
            {assignedUser?.email?.trim() ? assignedUser.email : "Sin email"}
          </Typography>
        </Stack>
      }
      size="small"
      variant="outlined"
      onClick={handleOpen}
      sx={{
        cursor: "pointer",
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
    <Typography
      component="button"
      type="button"
      variant="body2"
      color="text.disabled"
      onClick={handleOpen}
      sx={{
        cursor: "pointer",
        border: "none",
        background: "none",
        p: 0,
        font: "inherit",
        textAlign: "left",
        textDecoration: "underline",
      }}
    >
      Sin asignar
    </Typography>
  )

  return (
    <>
      <Tooltip title="Clic para cambiar usuario asignado" placement="top" enterDelay={400}>
        <Box component="span" sx={{ display: "inline-block" }}>
          {trigger}
        </Box>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: { sx: { p: 2, minWidth: 320, maxWidth: 420 } },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle2" fontWeight={600}>
            Usuario asignado
          </Typography>
          <AssignUserAutocompleteCP
            users={usersForAssigneePicker}
            value={draftUserId}
            onChange={setDraftUserId}
            disabled={saving}
            label="Buscar usuario"
            size="small"
          />
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button size="small" onClick={handleClose} disabled={saving} sx={{ cursor: "pointer" }}>
              Cancelar
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => void handleSave()}
              disabled={saving}
              sx={{ cursor: "pointer", minWidth: 100 }}
            >
              {saving ? <CircularProgress size={20} color="inherit" /> : "Guardar"}
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}
