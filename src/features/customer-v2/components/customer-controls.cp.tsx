import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material"
import { Add as AddIcon } from "@mui/icons-material"
import { fetchUsers } from "../../../app/services/users.service"
import UserInterface from "../../../app/models/user-interface"
import { createCustomerAdmin } from "../services/customers-ms.service"
import AssignUserAutocompleteCP from "./assign-user-autocomplete.cp"

export default function CustomerControlsCP() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [users, setUsers] = useState<UserInterface[]>([])
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [assignUserId, setAssignUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitOk, setSubmitOk] = useState(false)

  const loadUsers = useCallback(async () => {
    const list = await fetchUsers({ enable: true })
    if (Array.isArray(list)) {
      setUsers(list)
    }
  }, [])

  useEffect(() => {
    if (dialogOpen) {
      void loadUsers()
    }
  }, [dialogOpen, loadUsers])

  const handleClose = () => {
    if (!loading) {
      setDialogOpen(false)
      setSubmitError(null)
      setSubmitOk(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitError(null)
    setSubmitOk(false)
    const trimmed = phone.trim()
    if (!trimmed) {
      setSubmitError("El teléfono es obligatorio.")
      return
    }
    setLoading(true)
    try {
      await createCustomerAdmin({
        phone: trimmed,
        ...(name.trim() && { name: name.trim() }),
        ...(lastName.trim() && { lastName: lastName.trim() }),
        ...(email.trim() && { email: email.trim() }),
        ...(assignUserId && { user: assignUserId }),
      })
      setSubmitOk(true)
      setPhone("")
      setName("")
      setLastName("")
      setEmail("")
      setAssignUserId("")
    } catch (err: unknown) {
      let message = "No se pudo crear el cliente."
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string | string[] }
        if (Array.isArray(data?.message)) {
          message = data.message.join(", ")
        } else if (typeof data?.message === "string") {
          message = data.message
        } else if (err.message) {
          message = err.message
        }
      }
      setSubmitError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
      <Typography variant="h4" component="h1">
        Clientes V2
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
        sx={{ cursor: "pointer" }}
      >
        Nuevo cliente
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo cliente</DialogTitle>
        <DialogContent>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          {submitOk && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Cliente creado correctamente.
            </Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              required
              label="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="dense"
            />
            <AssignUserAutocompleteCP
              users={users}
              value={assignUserId}
              onChange={setAssignUserId}
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading} sx={{ cursor: "pointer" }}>
            Cerrar
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            variant="contained"
            disabled={loading}
            sx={{ cursor: "pointer" }}
          >
            {loading ? "Guardando…" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
