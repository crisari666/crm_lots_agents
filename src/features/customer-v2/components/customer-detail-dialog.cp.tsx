import React, { useCallback, useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import type { CustomerAdminDetail, UpdateCustomerAdminBody } from "../services/customers-ms.service"
import {
  closeCustomerDetailDialogAct,
  fetchCustomerListAdminThunk,
  updateCustomerReferralThunk,
  updateCustomerAdminThunk,
} from "../redux/customer-v2.slice"
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice"
import CustomerCallHistoryTabCP from "./customer-detail/customer-call-history-tab.cp"
import CustomerConversationsTabCP from "./customer-detail/customer-conversations-tab.cp"
import CustomerEventsTabCP from "./customer-detail/customer-events-tab.cp"
import CustomerDetailFormTabCP from "./customer-detail/customer-detail-form-tab.cp"
import CustomerDetailNotesTabCP from "./customer-detail/customer-detail-notes-tab.cp"

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

export default function CustomerDetailDialogCP() {
  const dispatch = useAppDispatch()
  const [tab, setTab] = useState(0)
  const dialogOpen = useAppSelector((s) => s.customerV2.dialogOpen)
  const detailForm = useAppSelector((s) => s.customerV2.detailForm)
  const detailLoading = useAppSelector((s) => s.customerV2.detailLoading)
  const detailSaving = useAppSelector((s) => s.customerV2.detailSaving)
  const detailError = useAppSelector((s) => s.customerV2.detailError)
  const lastListFetchParams = useAppSelector((s) => s.customerV2.lastListFetchParams)
  const users = useAppSelector((s) =>
    s.users.usersOriginal.length > 0 ? s.users.usersOriginal : s.users.users,
  )
  const gotUsers = useAppSelector((s) => s.users.gotUsers)

  useEffect(() => {
    if (!gotUsers) {
      void dispatch(fetchUsersThunk({ enable: true }))
    }
  }, [dispatch, gotUsers])

  const handleClose = useCallback(() => {
    if (!detailSaving) {
      dispatch(closeCustomerDetailDialogAct())
      setTab(0)
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

  const handleToggleReferral = async (isReferral: boolean) => {
    if (detailForm === null) {
      return
    }
    const result = await dispatch(
      updateCustomerReferralThunk({ customerId: detailForm.id, isReferral })
    )
    if (updateCustomerReferralThunk.fulfilled.match(result) && lastListFetchParams !== null) {
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
          <>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
              <Tab label="Cliente" sx={{ cursor: "pointer", textTransform: "none" }} />
              <Tab label={`Notas (${form.notes.length})`} sx={{ cursor: "pointer", textTransform: "none" }} />
              <Tab label="Llamadas" sx={{ cursor: "pointer", textTransform: "none" }} />
              <Tab label="Conversaciones" sx={{ cursor: "pointer", textTransform: "none" }} />
              <Tab label="Eventos" sx={{ cursor: "pointer", textTransform: "none" }} />
            </Tabs>
            {tab === 0 && (
              <CustomerDetailFormTabCP
                form={form}
                users={users}
                detailSaving={detailSaving}
                dispatch={dispatch}
                onToggleReferral={handleToggleReferral}
              />
            )}
            {tab === 1 && <CustomerDetailNotesTabCP notes={form.notes} />}
            {tab === 2 && <CustomerCallHistoryTabCP customerId={form.id} />}
            {tab === 3 && <CustomerConversationsTabCP />}
            {tab === 4 && <CustomerEventsTabCP customerId={form.id} />}
          </>
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
