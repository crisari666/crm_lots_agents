import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  MenuItem,
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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { fetchProjectsThunk } from "../../../project/slice/projects.slice"
import {
  addCustomerPaymentFeeThunk,
  clearCustomerPaymentsAct,
  createCustomerDownPaymentThunk,
  fetchDownPaymentsByCustomerThunk,
} from "../../../customer-payment/slice/customer-payments.slice"
import CustomerPaymentFilePreviewDialogCP from "../../../customer-payment/components/customer-payment-file-preview-dialog.cp"
import {
  fetchDownPaymentContractBlob,
  fetchFeeEvidenceBlob,
} from "../../services/customer-payments-ms.http"
import type { ProjectType } from "../../../project/types/project.types"
import { customerPaymentStrings as payS } from "../../../../i18n/locales/customer-payment.strings"

type CustomerPaymentTabProps = {
  customerId: string
  customerName?: string
}

const INITIAL_CREATE = {
  expectedValue: "",
  firstPaymentValue: "",
  lotNumber: "",
  datePayment: "",
  receiptNumber: "",
  paymentMethod: "",
  notes: "",
}

const INITIAL_FEE = {
  paymentValue: "",
  datePayment: "",
  receiptNumber: "",
  paymentMethod: "",
  notes: "",
}

const FILE_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf"

const PAYMENT_METHODS = [
  "Tarjeta de Credito",
  "Transferencia Bancaria",
  "Efectivo",
] as const

export default function CustomerPaymentTabCP({
  customerId,
  customerName,
}: CustomerPaymentTabProps) {
  const dispatch = useAppDispatch()
  const projects = useAppSelector((s) => s.projects.projects)
  const projectsLoaded = projects.length > 0
  const downPayments = useAppSelector((s) => s.customerPayments.customerDownPayments)
  const isLoading = useAppSelector((s) => s.customerPayments.isLoading)
  const isSaving = useAppSelector((s) => s.customerPayments.isSaving)
  const error = useAppSelector((s) => s.customerPayments.error)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null)
  const [createForm, setCreateForm] = useState(INITIAL_CREATE)
  const [feeForm, setFeeForm] = useState(INITIAL_FEE)
  const [contractFile, setContractFile] = useState<File | null>(null)
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [feeEvidenceFile, setFeeEvidenceFile] = useState<File | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [feeTargetId, setFeeTargetId] = useState<string | null>(null)
  const [preview, setPreview] = useState<{
    title: string
    fetchBlob: () => Promise<Blob>
  } | null>(null)
  const contractInputRef = useRef<HTMLInputElement>(null)
  const evidenceInputRef = useRef<HTMLInputElement>(null)
  const feeEvidenceInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!projectsLoaded) {
      void dispatch(fetchProjectsThunk())
    }
  }, [dispatch, projectsLoaded])

  useEffect(() => {
    void dispatch(fetchDownPaymentsByCustomerThunk(customerId))
    return () => {
      dispatch(clearCustomerPaymentsAct())
    }
  }, [dispatch, customerId])

  useEffect(() => {
    if (!selectedProject) return
    setCreateForm((prev) => ({
      ...prev,
      expectedValue: String(selectedProject.separation ?? 0),
    }))
  }, [selectedProject?._id])

  const enabledProjects = useMemo(
    () => projects.filter((p) => p.enabled !== false && p.deleted !== true),
    [projects],
  )

  const activeForProject = useMemo(
    () =>
      selectedProject
        ? downPayments.find((d) => d.projectId === selectedProject._id) ?? null
        : null,
    [downPayments, selectedProject],
  )

  const feeTarget = useMemo(
    () => downPayments.find((d) => d.id === feeTargetId) ?? null,
    [downPayments, feeTargetId],
  )

  useEffect(() => {
    if (activeForProject && activeForProject.remaining > 0) {
      setFeeTargetId(activeForProject.id)
      return
    }
    if (activeForProject && activeForProject.remaining <= 0) {
      setFeeTargetId(null)
    }
  }, [activeForProject?.id, activeForProject?.remaining])

  const formatCurrency = (value: number): string =>
    value.toLocaleString("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 })

  const handleCreateSubmit = async () => {
    if (!selectedProject || !contractFile || !createForm.expectedValue || !createForm.firstPaymentValue) {
      return
    }
    if (!createForm.lotNumber || !createForm.datePayment) return
    const result = await dispatch(
      createCustomerDownPaymentThunk({
        body: {
          customerId,
          projectId: selectedProject._id,
          lotNumber: createForm.lotNumber.trim(),
          expectedValue: Number(createForm.expectedValue),
          firstPaymentValue: Number(createForm.firstPaymentValue),
          datePayment: `${createForm.datePayment}T12:00:00.000Z`,
          receiptNumber: createForm.receiptNumber || undefined,
          paymentMethod: createForm.paymentMethod || undefined,
          notes: createForm.notes || undefined,
          customerName: customerName || undefined,
          projectName: selectedProject.title,
        },
        contractFile,
        evidenceFile: evidenceFile ?? undefined,
      }),
    )
    if (createCustomerDownPaymentThunk.fulfilled.match(result)) {
      setCreateForm({
        ...INITIAL_CREATE,
        expectedValue: String(selectedProject.separation ?? 0),
      })
      setContractFile(null)
      setEvidenceFile(null)
      if (contractInputRef.current) contractInputRef.current.value = ""
      if (evidenceInputRef.current) evidenceInputRef.current.value = ""
    }
  }

  const handleFeeSubmit = async () => {
    if (!feeTarget || feeTarget.remaining <= 0 || !feeForm.paymentValue || !feeForm.datePayment) {
      return
    }
    const result = await dispatch(
      addCustomerPaymentFeeThunk({
        downPaymentId: feeTarget.id,
        body: {
          paymentValue: Number(feeForm.paymentValue),
          datePayment: `${feeForm.datePayment}T12:00:00.000Z`,
          receiptNumber: feeForm.receiptNumber || undefined,
          paymentMethod: feeForm.paymentMethod || undefined,
          notes: feeForm.notes || undefined,
        },
        evidenceFile: feeEvidenceFile ?? undefined,
      }),
    )
    if (addCustomerPaymentFeeThunk.fulfilled.match(result)) {
      setFeeForm(INITIAL_FEE)
      setFeeEvidenceFile(null)
      if (feeEvidenceInputRef.current) feeEvidenceInputRef.current.value = ""
      const updated = result.payload
      if (updated.remaining <= 0) {
        setFeeTargetId(null)
      }
    }
  }

  const previewFetch = useCallback(() => {
    if (!preview) return null
    return preview.fetchBlob
  }, [preview])

  return (
    <Stack spacing={2}>
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
      {selectedProject && (
        <Typography variant="caption" color="text.secondary">
          {activeForProject
            ? activeForProject.status === "completed"
              ? payS.completedBanner
              : payS.pendingFeesOnlyHint
            : payS.onePerProjectHint}
        </Typography>
      )}
      {selectedProject && !activeForProject && (
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            {payS.createDownPaymentTitle}
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              label={payS.expectedValueLabel}
              type="number"
              value={createForm.expectedValue}
              onChange={(e) => setCreateForm((p) => ({ ...p, expectedValue: e.target.value }))}
              inputProps={{ min: 1 }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label={payS.firstPaymentLabel}
              type="number"
              value={createForm.firstPaymentValue}
              onChange={(e) => setCreateForm((p) => ({ ...p, firstPaymentValue: e.target.value }))}
              inputProps={{ min: 1 }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label={payS.lotNumberLabel}
              value={createForm.lotNumber}
              onChange={(e) => setCreateForm((p) => ({ ...p, lotNumber: e.target.value }))}
              sx={{ minWidth: 140 }}
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              label="Fecha de pago"
              type="date"
              value={createForm.datePayment}
              onChange={(e) => setCreateForm((p) => ({ ...p, datePayment: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label="Número de recibo"
              value={createForm.receiptNumber}
              onChange={(e) => setCreateForm((p) => ({ ...p, receiptNumber: e.target.value }))}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              select
              label="Método de pago"
              value={createForm.paymentMethod}
              onChange={(e) => setCreateForm((p) => ({ ...p, paymentMethod: e.target.value }))}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>—</em>
              </MenuItem>
              {PAYMENT_METHODS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            size="small"
            label="Notas"
            multiline
            minRows={2}
            value={createForm.notes}
            onChange={(e) => setCreateForm((p) => ({ ...p, notes: e.target.value }))}
          />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {payS.attachContractLabel}
            </Typography>
            <Button component="label" variant="outlined" size="small" sx={{ cursor: "pointer", mr: 1 }}>
              {payS.chooseContractFile}
              <input
                ref={contractInputRef}
                type="file"
                accept={FILE_ACCEPT}
                hidden
                onChange={(e) => {
                  setContractFile(e.target.files?.[0] ?? null)
                  e.target.value = ""
                }}
              />
            </Button>
            {contractFile && (
              <Typography variant="caption" color="text.secondary" component="span">
                {contractFile.name}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {payS.attachEvidenceLabel}
            </Typography>
            <Button component="label" variant="outlined" size="small" sx={{ cursor: "pointer", mr: 1 }}>
              {payS.chooseEvidenceFile}
              <input
                ref={evidenceInputRef}
                type="file"
                accept={FILE_ACCEPT}
                hidden
                onChange={(e) => {
                  setEvidenceFile(e.target.files?.[0] ?? null)
                  e.target.value = ""
                }}
              />
            </Button>
            {evidenceFile && (
              <Typography variant="caption" color="text.secondary" component="span">
                {evidenceFile.name}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            onClick={() => void handleCreateSubmit()}
            disabled={
              isSaving ||
              !contractFile ||
              !createForm.expectedValue ||
              !createForm.firstPaymentValue ||
              !createForm.lotNumber ||
              !createForm.datePayment
            }
            sx={{ cursor: "pointer", alignSelf: "flex-start", minWidth: 180 }}
          >
            {isSaving ? <CircularProgress size={20} color="inherit" /> : "Crear separación"}
          </Button>
        </Stack>
      )}
      {feeTarget && feeTarget.remaining > 0 && (
        <Stack spacing={1.5}>
          <Typography variant="subtitle1" fontWeight={600}>
            {payS.addFeeTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(feeTarget.projectName ??
              projects.find((p) => p._id === feeTarget.projectId)?.title ??
              feeTarget.projectId)}{" "}
            · Lote {feeTarget.lotNumber}
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              {payS.expectedLabel}: <strong>{formatCurrency(feeTarget.expectedValue)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {payS.paidLabel}: <strong>{formatCurrency(feeTarget.totalPaid)}</strong>
            </Typography>
            <Typography variant="body2" color="warning.main">
              {payS.remainingLabel}: <strong>{formatCurrency(feeTarget.remaining)}</strong>
            </Typography>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              size="small"
              label={payS.feePaymentLabel}
              type="number"
              value={feeForm.paymentValue}
              onChange={(e) => setFeeForm((p) => ({ ...p, paymentValue: e.target.value }))}
              inputProps={{ min: 1, max: feeTarget.remaining }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label="Fecha de pago"
              type="date"
              value={feeForm.datePayment}
              onChange={(e) => setFeeForm((p) => ({ ...p, datePayment: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label="Número de recibo"
              value={feeForm.receiptNumber}
              onChange={(e) => setFeeForm((p) => ({ ...p, receiptNumber: e.target.value }))}
              sx={{ minWidth: 140 }}
            />
            <TextField
              size="small"
              select
              label="Método de pago"
              value={feeForm.paymentMethod}
              onChange={(e) => setFeeForm((p) => ({ ...p, paymentMethod: e.target.value }))}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">
                <em>—</em>
              </MenuItem>
              {PAYMENT_METHODS.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            size="small"
            label="Notas"
            multiline
            minRows={2}
            value={feeForm.notes}
            onChange={(e) => setFeeForm((p) => ({ ...p, notes: e.target.value }))}
          />
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
              {payS.attachEvidenceLabel}
            </Typography>
            <Button component="label" variant="outlined" size="small" sx={{ cursor: "pointer", mr: 1 }}>
              {payS.chooseEvidenceFile}
              <input
                ref={feeEvidenceInputRef}
                type="file"
                accept={FILE_ACCEPT}
                hidden
                onChange={(e) => {
                  setFeeEvidenceFile(e.target.files?.[0] ?? null)
                  e.target.value = ""
                }}
              />
            </Button>
            {feeEvidenceFile && (
              <Typography variant="caption" color="text.secondary" component="span">
                {feeEvidenceFile.name}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={() => void handleFeeSubmit()}
              disabled={isSaving || !feeForm.paymentValue || !feeForm.datePayment}
              sx={{ cursor: "pointer", minWidth: 160 }}
            >
              {isSaving ? <CircularProgress size={20} color="inherit" /> : payS.addFeeTitle}
            </Button>
            <Button
              variant="text"
              onClick={() => setFeeTargetId(null)}
              sx={{ cursor: "pointer" }}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      )}
      {selectedProject && activeForProject && activeForProject.remaining <= 0 && (
        <Alert severity="success">{payS.completedBanner}</Alert>
      )}
      <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
        {payS.historyTitle}
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={28} />
        </Box>
      ) : downPayments.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No hay separaciones registradas para este cliente.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>Proyecto</TableCell>
                <TableCell>Lote</TableCell>
                <TableCell align="right">Esperado</TableCell>
                <TableCell align="right">Pagado</TableCell>
                <TableCell align="right">Restante</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>{payS.contractColumn}</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {downPayments.map((dp) => {
                const proj = projects.find((pr) => pr._id === dp.projectId)
                const open = expandedId === dp.id
                const canAddFee = dp.remaining > 0
                return (
                  <React.Fragment key={dp.id}>
                    <TableRow hover>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => setExpandedId(open ? null : dp.id)}
                          sx={{
                            cursor: "pointer",
                            transform: open ? "rotate(180deg)" : "none",
                            transition: "transform 150ms",
                          }}
                        >
                          <ExpandMoreIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell>{dp.projectName ?? proj?.title ?? dp.projectId}</TableCell>
                      <TableCell>{dp.lotNumber}</TableCell>
                      <TableCell align="right">{formatCurrency(dp.expectedValue)}</TableCell>
                      <TableCell align="right">{formatCurrency(dp.totalPaid)}</TableCell>
                      <TableCell align="right">{formatCurrency(dp.remaining)}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={
                            dp.remaining > 0 ? payS.statusPending : payS.statusCompleted
                          }
                          color={dp.remaining > 0 ? "warning" : "success"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {dp.hasContract ? (
                          <IconButton
                            size="small"
                            aria-label={payS.previewContractAria}
                            onClick={() =>
                              setPreview({
                                title: payS.previewContractTitle,
                                fetchBlob: () => fetchDownPaymentContractBlob(dp.id),
                              })
                            }
                            sx={{ cursor: "pointer" }}
                          >
                            <DescriptionOutlinedIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          payS.noEvidenceDash
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {canAddFee ? (
                          <Button
                            size="small"
                            variant={feeTargetId === dp.id ? "contained" : "outlined"}
                            onClick={() => {
                              setFeeTargetId(dp.id)
                              setExpandedId(dp.id)
                            }}
                            sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
                          >
                            {payS.addFeeTitle}
                          </Button>
                        ) : (
                          payS.noEvidenceDash
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={9} sx={{ py: 0, border: 0 }}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                          <Box sx={{ py: 1.5, pl: 4 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              Abonos
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha</TableCell>
                                  <TableCell align="right">Valor</TableCell>
                                  <TableCell>Recibo</TableCell>
                                  <TableCell>Método</TableCell>
                                  <TableCell>Notas</TableCell>
                                  <TableCell>{payS.evidenceColumn}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(dp.fees ?? []).map((fee) => (
                                  <TableRow key={fee.id}>
                                    <TableCell>
                                      {new Date(fee.datePayment).toLocaleDateString("es-CO")}
                                    </TableCell>
                                    <TableCell align="right">
                                      {formatCurrency(fee.paymentValue)}
                                    </TableCell>
                                    <TableCell>{fee.receiptNumber ?? "-"}</TableCell>
                                    <TableCell>{fee.paymentMethod ?? "-"}</TableCell>
                                    <TableCell
                                      sx={{
                                        maxWidth: 180,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {fee.notes ?? "-"}
                                    </TableCell>
                                    <TableCell align="center">
                                      {fee.hasEvidence ? (
                                        <IconButton
                                          size="small"
                                          aria-label={payS.previewEvidenceAria}
                                          onClick={() =>
                                            setPreview({
                                              title: payS.previewDialogTitle,
                                              fetchBlob: () => fetchFeeEvidenceBlob(fee.id),
                                            })
                                          }
                                          sx={{ cursor: "pointer" }}
                                        >
                                          <ImageOutlinedIcon fontSize="small" />
                                        </IconButton>
                                      ) : (
                                        payS.noEvidenceDash
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <CustomerPaymentFilePreviewDialogCP
        open={preview !== null}
        title={preview?.title}
        fetchBlob={previewFetch()}
        onClose={() => setPreview(null)}
      />
    </Stack>
  )
}
