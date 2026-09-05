import DownloadIcon from "@mui/icons-material/Download"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { webinarStrings as s } from "../../../i18n/locales/webinar.strings"
import {
  clearWebinarImportFeedback,
  fetchWebinarLeadsThunk,
  importWebinarLeadsThunk,
  selectWebinarState,
} from "../slice/webinar.slice"
import {
  downloadWebinarLeadsImportTemplate,
  mapValidPreviewRowsToImportBody,
  parseWebinarLeadsImportFile,
  type WebinarImportPreviewRow,
} from "../utils/parse-webinar-leads-import-file"

type WebinarLeadsImportDialogProps = {
  readonly open: boolean
  readonly onClose: () => void
  readonly webinarEventId: string
}

export default function WebinarLeadsImportDialog({
  open,
  onClose,
  webinarEventId,
}: WebinarLeadsImportDialogProps) {
  const dispatch = useAppDispatch()
  const { importSubmitting, importError, leadsStatusFilter } =
    useAppSelector(selectWebinarState)
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [previewRows, setPreviewRows] = useState<WebinarImportPreviewRow[]>([])
  const [isParsing, setIsParsing] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    setFileName(null)
    setParseError(null)
    setPreviewRows([])
    setIsParsing(false)
    dispatch(clearWebinarImportFeedback())
    if (inputRef.current != null) {
      inputRef.current.value = ""
    }
  }, [dispatch, open])

  const validCount = useMemo(
    () => previewRows.filter((row) => row.isValid).length,
    [previewRows]
  )
  const invalidCount = previewRows.length - validCount

  const handleFile = async (file: File | null) => {
    if (file == null) {
      return
    }
    setFileName(file.name)
    setParseError(null)
    setIsParsing(true)
    try {
      const rows = await parseWebinarLeadsImportFile(file)
      if (rows.length === 0) {
        setPreviewRows([])
        setParseError(s.importColumnsError)
        return
      }
      setPreviewRows(rows)
    } catch (err: unknown) {
      setPreviewRows([])
      setParseError(err instanceof Error ? err.message : s.importParseError)
    } finally {
      setIsParsing(false)
    }
  }

  const handleImport = async () => {
    const leads = mapValidPreviewRowsToImportBody(previewRows)
    if (leads.length === 0) {
      return
    }
    const result = await dispatch(
      importWebinarLeadsThunk({
        webinarEventId,
        leads,
        sendNotification: true,
      })
    )
    if (!importWebinarLeadsThunk.fulfilled.match(result)) {
      return
    }
    void dispatch(
      fetchWebinarLeadsThunk({
        webinarEventId,
        status: leadsStatusFilter,
      })
    )
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{s.importLeadsTitle}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          {s.importLeadsHint}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon fontSize="small" />}
            onClick={downloadWebinarLeadsImportTemplate}
          >
            {s.importDownloadTemplate}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<UploadFileIcon fontSize="small" />}
            onClick={() => inputRef.current?.click()}
            disabled={importSubmitting || isParsing}
          >
            {s.importSelectFile}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={(event) => {
              void handleFile(event.target.files?.[0] ?? null)
            }}
          />
        </Stack>
        {fileName != null ? (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
            {fileName}
          </Typography>
        ) : null}
        {isParsing ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={22} />
          </Box>
        ) : null}
        {parseError != null ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {parseError}
          </Alert>
        ) : null}
        {importError != null ? (
          <Alert severity="error" sx={{ mb: 1 }}>
            {importError}
          </Alert>
        ) : null}
        {previewRows.length > 0 ? (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
              <Chip size="small" color="success" label={`${validCount} ${s.importValid}`} />
              {invalidCount > 0 ? (
                <Chip size="small" color="error" label={`${invalidCount} ${s.importInvalid}`} />
              ) : null}
            </Stack>
            <Box sx={{ maxHeight: 320, overflow: "auto", border: 1, borderColor: "divider" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ py: 0.75 }}>#</TableCell>
                    <TableCell sx={{ py: 0.75 }}>{s.fieldName}</TableCell>
                    <TableCell sx={{ py: 0.75 }}>{s.fieldLastName}</TableCell>
                    <TableCell sx={{ py: 0.75 }}>{s.fieldPhone}</TableCell>
                    <TableCell sx={{ py: 0.75 }}>{s.fieldEmail}</TableCell>
                    <TableCell sx={{ py: 0.75 }}>{s.importValidation}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewRows.map((row) => (
                    <TableRow key={`${row.rowNumber}-${row.phone}`}>
                      <TableCell sx={{ py: 0.5 }}>{row.rowNumber}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{row.name || "—"}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{row.lastName || "—"}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{row.phone || "—"}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>{row.email || "—"}</TableCell>
                      <TableCell sx={{ py: 0.5 }}>
                        {row.isValid ? (
                          <Chip size="small" color="success" label={s.importOk} sx={{ height: 22 }} />
                        ) : (
                          <Chip
                            size="small"
                            color="error"
                            label={row.errors.join("; ")}
                            sx={{ height: 22, maxWidth: 220 }}
                            title={row.errors.join("; ")}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 1.5 }}>
        <Button size="small" onClick={onClose} disabled={importSubmitting}>
          {s.cancel}
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={validCount === 0 || importSubmitting}
          onClick={() => void handleImport()}
          startIcon={
            importSubmitting ? <CircularProgress size={14} color="inherit" /> : undefined
          }
        >
          {importSubmitting
            ? s.importing
            : `${s.importConfirm} (${validCount})`}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
