import React from "react"
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import moment from "moment"
import UserInterface from "../../../../app/models/user-interface"
import type { CustomerAdminDetail } from "../../services/customers-ms.service"
import type { AppDispatch } from "../../../../app/store"
import {
  setCustomerDetailFormAct,
  setCustomerDetailInterestedProjectsAct,
} from "../../redux/customer-v2.slice"
import AssignUserAutocompleteCP from "../assign-user-autocomplete.cp"

export type CustomerDetailFormTabCPProps = {
  form: CustomerAdminDetail
  users: UserInterface[]
  detailSaving: boolean
  dispatch: AppDispatch
}

export default function CustomerDetailFormTabCP({
  form,
  users,
  detailSaving,
  dispatch,
}: CustomerDetailFormTabCPProps) {
  return (
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
                    e.target.value === "" ? undefined : (e.target.value as "cc" | "passport"),
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
          <Stack
            key={`${row.projectId}-${index}`}
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems="flex-start"
          >
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
      <Typography variant="caption" color="text.secondary">
        Creado: {moment(form.createdAt).format("DD/MM/YYYY HH:mm")} · creado por {form.createdBy}
        {form.updatedAt !== undefined ? ` · actualizado ${moment(form.updatedAt).format("DD/MM/YYYY HH:mm")}` : ""}
      </Typography>
    </Stack>
  )
}
