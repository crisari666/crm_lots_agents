import React, { useCallback } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import moment from "moment"
import UserInterface from "../../../app/models/user-interface"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { CustomerAdminDetail, UpdateCustomerAdminBody } from "../services/customers-ms.service"
import {
  closeCustomerDetailDialogAct,
  fetchCustomerListAdminThunk,
  setCustomerDetailFormAct,
  setCustomerDetailInterestedProjectsAct,
  updateCustomerAdminThunk,
} from "../redux/customer-v2.slice"
import AssignUserAutocompleteCP from "./assign-user-autocomplete.cp"

function buildUpdateBody(form: CustomerAdminDetail): UpdateCustomerAdminBody {
  const interestedProjects = form.interestedProjects
    .filter((p) => p.projectId.trim() !== "")
    .map((p) => ({
      projectId: p.projectId.trim(),
      date: p.date,
    }))
  return {
    name: form.name?.trim() || undefined,
    lastName: form.lastName?.trim() || undefined,
    phone: form.phone.trim(),
    whatsapp: form.whatsapp?.trim() || undefined,
    email: form.email?.trim() || undefined,
    documentType: form.documentType,
    document: form.document?.trim() || undefined,
    interestedProjects,
    assignedTo: form.assignedTo ?? "",
    enabled: form.enabled,
  }
}

export type CustomerDetailDialogCPProps = {
  users: UserInterface[]
}

export default function CustomerDetailDialogCP({ users }: CustomerDetailDialogCPProps) {
  const dispatch = useAppDispatch()
  const dialogOpen = useAppSelector((s) => s.customerV2.dialogOpen)
  const detailForm = useAppSelector((s) => s.customerV2.detailForm)
  const detailLoading = useAppSelector((s) => s.customerV2.detailLoading)
  const detailSaving = useAppSelector((s) => s.customerV2.detailSaving)
  const detailError = useAppSelector((s) => s.customerV2.detailError)
  const lastListFetchParams = useAppSelector((s) => s.customerV2.lastListFetchParams)

  const handleClose = useCallback(() => {
    if (!detailSaving) {
      dispatch(closeCustomerDetailDialogAct())
    }
  }, [dispatch, detailSaving])

  const handleSave = async () => {
    if (detailForm === null) {
      return
    }
    const body = buildUpdateBody(detailForm)
    const result = await dispatch(
      updateCustomerAdminThunk({ customerId: detailForm.id, body })
    )
    if (updateCustomerAdminThunk.fulfilled.match(result) && lastListFetchParams !== null) {
      void dispatch(fetchCustomerListAdminThunk(lastListFetchParams))
    }
  }

  const form = detailForm

  return (
    <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pr: 1 }}>
        <Typography component="span" variant="h6" fontWeight={600}>
          Detalle del cliente
        </Typography>
        <IconButton aria-label="cerrar" onClick={handleClose} disabled={detailSaving} size="small" sx={{ cursor: "pointer" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {detailLoading && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        )}
        {!detailLoading && detailError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {detailError}
          </Alert>
        )}
        {!detailLoading && form && (
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Nombre"
                value={form.name ?? ""}
                onChange={(e) => dispatch(setCustomerDetailFormAct({ name: e.target.value }))}
                fullWidth
                size="small"
                disabled={detailSaving}
              />
              <TextField
                label="Apellido"
                value={form.lastName ?? ""}
                onChange={(e) => dispatch(setCustomerDetailFormAct({ lastName: e.target.value }))}
                fullWidth
                size="small"
                disabled={detailSaving}
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Teléfono"
                value={form.phone}
                onChange={(e) => dispatch(setCustomerDetailFormAct({ phone: e.target.value }))}
                fullWidth
                size="small"
                required
                disabled={detailSaving}
              />
              <TextField
                label="WhatsApp"
                value={form.whatsapp ?? ""}
                onChange={(e) => dispatch(setCustomerDetailFormAct({ whatsapp: e.target.value }))}
                fullWidth
                size="small"
                disabled={detailSaving}
              />
            </Stack>
            <TextField
              label="Email"
              value={form.email ?? ""}
              onChange={(e) => dispatch(setCustomerDetailFormAct({ email: e.target.value }))}
              fullWidth
              size="small"
              disabled={detailSaving}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl size="small" fullWidth disabled={detailSaving}>
                <InputLabel>Tipo documento</InputLabel>
                <Select
                  label="Tipo documento"
                  value={form.documentType ?? ""}
                  onChange={(e) =>
                    dispatch(
                      setCustomerDetailFormAct({
                        documentType:
                          e.target.value === ""
                            ? undefined
                            : (e.target.value as "cc" | "passport"),
                      })
                    )
                  }
                >
                  <MenuItem value="">
                    <em>Sin especificar</em>
                  </MenuItem>
                  <MenuItem value="cc">Cédula</MenuItem>
                  <MenuItem value="passport">Pasaporte</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Número documento"
                value={form.document ?? ""}
                onChange={(e) => dispatch(setCustomerDetailFormAct({ document: e.target.value }))}
                fullWidth
                size="small"
                disabled={detailSaving}
              />
            </Stack>
            <Box sx={{ minWidth: 280 }}>
              <AssignUserAutocompleteCP
                users={users}
                value={form.assignedTo ?? ""}
                onChange={(userId) => dispatch(setCustomerDetailFormAct({ assignedTo: userId || undefined }))}
                disabled={detailSaving}
                label="Usuario asignado"
                size="small"
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={form.enabled}
                  onChange={(_, v) => dispatch(setCustomerDetailFormAct({ enabled: v }))}
                  disabled={detailSaving}
                />
              }
              label="Cliente activo"
            />
            <Divider />
            <Typography variant="subtitle2" fontWeight={600}>
              Proyectos de interés
            </Typography>
            <Stack spacing={1}>
              {form.interestedProjects.map((row, index) => (
                <Stack key={`${row.projectId}-${index}`} direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="flex-start">
                  <TextField
                    label="Project ID"
                    value={row.projectId}
                    onChange={(e) => {
                      const next = [...form.interestedProjects]
                      next[index] = { ...next[index], projectId: e.target.value }
                      dispatch(setCustomerDetailInterestedProjectsAct(next))
                    }}
                    size="small"
                    fullWidth
                    disabled={detailSaving}
                  />
                  <TextField
                    label="Fecha (ISO)"
                    value={row.date}
                    onChange={(e) => {
                      const next = [...form.interestedProjects]
                      next[index] = { ...next[index], date: e.target.value }
                      dispatch(setCustomerDetailInterestedProjectsAct(next))
                    }}
                    size="small"
                    fullWidth
                    disabled={detailSaving}
                    helperText="Ej. fecha del interés"
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const next = form.interestedProjects.filter((_, i) => i !== index)
                      dispatch(setCustomerDetailInterestedProjectsAct(next))
                    }}
                    disabled={detailSaving}
                    sx={{ cursor: "pointer", mt: { xs: 0, sm: 0.5 } }}
                  >
                    Quitar
                  </Button>
                </Stack>
              ))}
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  dispatch(
                    setCustomerDetailInterestedProjectsAct([
                      ...form.interestedProjects,
                      { projectId: "", date: new Date().toISOString() },
                    ])
                  )
                }
                disabled={detailSaving}
                sx={{ cursor: "pointer", alignSelf: "flex-start" }}
              >
                Añadir proyecto
              </Button>
            </Stack>
            <Divider />
            <Typography variant="subtitle2" fontWeight={600}>
              Notas ({form.notes.length})
            </Typography>
            {form.notes.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Sin notas registradas.
              </Typography>
            ) : (
              <List dense sx={{ bgcolor: "grey.50", borderRadius: 1, maxHeight: 240, overflow: "auto" }}>
                {form.notes.map((n) => (
                  <ListItem key={n.id} sx={{ flexDirection: "column", alignItems: "stretch", borderBottom: 1, borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary">
                      {moment(n.date).format("DD/MM/YYYY HH:mm")} · usuario {n.user}
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", pt: 0.5 }}>
                      {n.description}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
            <Typography variant="caption" color="text.secondary">
              Creado: {moment(form.createdAt).format("DD/MM/YYYY HH:mm")} · creado por {form.createdBy}
              {form.updatedAt !== undefined ? ` · actualizado ${moment(form.updatedAt).format("DD/MM/YYYY HH:mm")}` : ""}
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={detailSaving} sx={{ cursor: "pointer" }}>
          Cerrar
        </Button>
        <Button
          variant="contained"
          onClick={() => void handleSave()}
          disabled={detailLoading || detailSaving || form === null}
          sx={{ cursor: "pointer", minWidth: 120 }}
        >
          {detailSaving ? <CircularProgress size={22} color="inherit" /> : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
