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
  Grid,
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
  const [projectId, setProjectId] = useState("")
  const [note, setNote] = useState("")
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
        ...(projectId.trim() && { projectId: projectId.trim() }),
        ...(note.trim() && { note: note.trim() }),
      })
      setSubmitOk(true)
      setPhone("")
      setName("")
      setLastName("")
      setEmail("")
      setAssignUserId("")
      setProjectId("")
      setNote("")
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
        <DialogTitle sx={{ pb: 0.5 }}>Nuevo cliente</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ mb: 1 }} onClose={() => setSubmitError(null)}>
              {submitError}
            </Alert>
          )}
          {submitOk && (
            <Alert severity="success" sx={{ mb: 1 }}>
              Cliente creado correctamente.
            </Alert>
          )}
          <Grid container spacing={1} sx={{ pt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                size="small"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                size="small"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                size="small"
                margin="none"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Proyecto (id)"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                fullWidth
                size="small"
                margin="none"
                placeholder="Opcional"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <AssignUserAutocompleteCP
                users={users}
                value={assignUserId}
                onChange={setAssignUserId}
                disabled={loading}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nota / descripción"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                size="small"
                margin="none"
                multiline
                minRows={2}
                maxRows={6}
                placeholder="Opcional — queda en historial CRM"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading} sx={{ cursor: "pointer" }} size="small">
            Cerrar
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            variant="contained"
            disabled={loading}
            sx={{ cursor: "pointer" }}
            size="small"
          >
            {loading ? "Guardando…" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
