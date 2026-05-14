import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchProjectsThunk } from "../../../project/slice/projects.slice"
import {
  clearCustomerPaymentsAct,
  createCustomerPaymentThunk,
  fetchPaymentsByCustomerThunk,
  fetchPaymentSummaryByCustomerThunk,
} from "../../../customer-payment/slice/customer-payments.slice"
import CustomerPaymentEvidencePreviewDialogCP from "../../../customer-payment/components/customer-payment-evidence-preview-dialog.cp"
import type { ProjectType } from "../../../project/types/project.types"
import { customerPaymentStrings as payS } from "../../../../i18n/locales/customer-payment.strings"

type CustomerPaymentTabProps = {
  customerId: string
}

const INITIAL_FORM = {
  paymentValue: "",
  datePayment: "",
  receiptNumber: "",
  paymentMethod: "",
  notes: "",
}

export default function CustomerPaymentTabCP({ customerId }: CustomerPaymentTabProps) {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((s) => s.projects.projects)
  const projectsLoaded = projects.length > 0
  const customerPayments = useAppSelector((s) => s.customerPayments.customerPayments)
  const summaries = useAppSelector((s) => s.customerPayments.summaries)
  const isLoading = useAppSelector((s) => s.customerPayments.isLoading)
  const isSaving = useAppSelector((s) => s.customerPayments.isSaving)
  const error = useAppSelector((s) => s.customerPayments.error)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [previewPaymentId, setPreviewPaymentId] = useState<string | null>(null)
  const evidenceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!projectsLoaded) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projectsLoaded])

  useEffect(() => {
    void dispatch(fetchPaymentsByCustomerThunk(customerId))
    void dispatch(fetchPaymentSummaryByCustomerThunk(customerId))
    return () => {
      dispatch(clearCustomerPaymentsAct())
    }
  }, [dispatch, customerId])

  const enabledProjects = useMemo(
    () => projects.filter((p) => p.enabled !== false && p.deleted !== true),
    [projects],
  )

  const selectedSummary = useMemo(
    () => summaries.find((s) => s.projectId === selectedProject?._id) ?? null,
    [summaries, selectedProject],
  )

  const separationValue = selectedProject?.separation ?? 0
  const totalPaid = selectedSummary?.totalPaid ?? 0
  const remaining = Math.max(separationValue - totalPaid, 0)

  const handleFieldChange = useCallback(
    (field: keyof typeof INITIAL_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  )

  const handleEvidenceFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.files?.[0] ?? null
      setEvidenceFile(next)
      e.target.value = ""
    },
    [],
  )

  const handleSubmit = async () => {
    if (!selectedProject || !form.paymentValue || !form.datePayment) return
    const result = await dispatch(
      createCustomerPaymentThunk({
        body: {
          customerId,
          projectId: selectedProject._id,
          paymentValue: Number(form.paymentValue),
          datePayment: `${form.datePayment}T12:00:00.000Z`,
          receiptNumber: form.receiptNumber || undefined,
          paymentMethod: form.paymentMethod || undefined,
          notes: form.notes || undefined,
        },
        evidenceFile: evidenceFile ?? undefined,
      }),
    )
    if (createCustomerPaymentThunk.fulfilled.match(result)) {
      setForm(INITIAL_FORM)
      setEvidenceFile(null)
      if (evidenceInputRef.current) {
        evidenceInputRef.current.value = ""
      }
      void dispatch(fetchPaymentSummaryByCustomerThunk(customerId))
    }
  }

  const formatCurrency = (value: number): string =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={600}>
        Registrar pago
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <Autocomplete
        size="small"
        options={enabledProjects}
        value={selectedProject}
        onChange={(_, value) => setSelectedProject(value)}
        getOptionLabel={(option) => option.title}
        isOptionEqualToValue={(a, b) => a._id === b._id}
        renderInput={(params) => <TextField {...params} label="Proyecto" />}
      />
      {selectedProject && separationValue > 0 && (
        <Stack direction="row" spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Separación: <strong>{formatCurrency(separationValue)}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pagado: <strong>{formatCurrency(totalPaid)}</strong>
          </Typography>
          <Typography variant="body2" color={remaining > 0 ? "warning.main" : "success.main"}>
            Restante: <strong>{formatCurrency(remaining)}</strong>
          </Typography>
        </Stack>
      )}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          size="small"
          label="Valor del pago"
          type="number"
          value={form.paymentValue}
          onChange={handleFieldChange("paymentValue")}
          inputProps={{ min: 1 }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          label="Fecha de pago"
          type="date"
          value={form.datePayment}
          onChange={handleFieldChange("datePayment")}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          size="small"
          label="Número de recibo"
          value={form.receiptNumber}
          onChange={handleFieldChange("receiptNumber")}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          label="Método de pago"
          value={form.paymentMethod}
          onChange={handleFieldChange("paymentMethod")}
          sx={{ minWidth: 160 }}
        />
      </Stack>
      <TextField
        size="small"
        label="Notas"
        multiline
        minRows={2}
        maxRows={4}
        value={form.notes}
        onChange={handleFieldChange("notes")}
      />
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          {payS.attachEvidenceLabel}
        </Typography>
        <Button component="label" variant="outlined" size="small" sx={{ cursor: "pointer", mr: 1 }}>
          {payS.chooseEvidenceFile}
          <input
            ref={evidenceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleEvidenceFileChange}
          />
        </Button>
        {evidenceFile && (
          <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
            {evidenceFile.name}
          </Typography>
        )}
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={isSaving || !selectedProject || !form.paymentValue || !form.datePayment}
          sx={{ cursor: "pointer", minWidth: 140 }}
        >
          {isSaving ? <CircularProgress size={20} color="inherit" /> : "Registrar pago"}
        </Button>
      </Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>
        Historial de pagos
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={28} />
        </Box>
      ) : customerPayments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay pagos registrados para este cliente.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Proyecto</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell>Recibo</TableCell>
                <TableCell>Método</TableCell>
                <TableCell>Notas</TableCell>
                <TableCell>{payS.evidenceColumn}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerPayments.map((p) => {
                const proj = projects.find((pr) => pr._id === p.projectId)
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      {new Date(p.datePayment).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>{proj?.title ?? p.projectId}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(p.paymentValue)}
                    </TableCell>
                    <TableCell>{p.receiptNumber ?? "-"}</TableCell>
                    <TableCell>{p.paymentMethod ?? "-"}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.notes ?? "-"}
                    </TableCell>
                    <TableCell align="center" sx={{ width: 72 }}>
                      {p.hasEvidence ? (
                        <IconButton
                          size="small"
                          aria-label={payS.previewEvidenceAria}
                          onClick={() => setPreviewPaymentId(p.id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <ImageOutlinedIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" color="text.disabled" component="span">
                          {payS.noEvidenceDash}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <CustomerPaymentEvidencePreviewDialogCP
        open={previewPaymentId !== null}
        paymentId={previewPaymentId}
        onClose={() => setPreviewPaymentId(null)}
      />
    </Stack>
  )
}
