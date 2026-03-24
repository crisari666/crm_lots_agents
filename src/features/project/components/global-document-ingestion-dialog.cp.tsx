import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material"
import { Add as AddIcon, CloudUpload as CloudUploadIcon, Public as PublicIcon } from "@mui/icons-material"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import {
  fetchIngestedGlobalDocumentsReq,
  ingestGlobalDocumentJsonReq,
  ingestGlobalDocumentMultipartReq,
  getRagIngestionErrorMessage
} from "../../../app/services/project-document-ingestion.service"
import GlobalDocumentIngestionCardCP, {
  globalIngestionRowReady
} from "./global-document-ingestion-card.cp"
import type { ProjectIngestionDocumentRow } from "../types/project-document-ingestion.types"
import {
  createGlobalIngestionRow,
  rowsFromGlobalIngestedChunks
} from "../utils/global-document-ingestion-load.utils"

function formatCount(template: string, count: number) {
  return template.replace(/\{\{count\}\}/g, String(count))
}

function defaultGlobalRows(): ProjectIngestionDocumentRow[] {
  return [createGlobalIngestionRow("other")]
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function GlobalDocumentIngestionDialogCP({ open, onClose }: Props) {
  const [rows, setRows] = useState<ProjectIngestionDocumentRow[]>(defaultGlobalRows)
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(() => new Set())
  const [submitting, setSubmitting] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [banner, setBanner] = useState<{
    severity: "success" | "error" | "info" | "warning"
    text: string
  } | null>(null)

  const resetState = useCallback(() => {
    setRows(defaultGlobalRows())
    setSubmittedIds(new Set())
    setBanner(null)
    setListError(null)
    setListLoading(false)
  }, [])

  const refreshGlobalRows = useCallback(
    async (opts: { showLoading?: boolean } = {}) => {
      const showLoading = opts.showLoading !== false
      if (showLoading) {
        setListLoading(true)
        setListError(null)
      }
      try {
        const chunks = await fetchIngestedGlobalDocumentsReq()
        const { rows: nextRows, submittedIds: nextSubmitted } = rowsFromGlobalIngestedChunks(chunks)
        if (nextRows.length === 0) {
          setRows(defaultGlobalRows())
          setSubmittedIds(new Set())
        } else {
          setRows(nextRows)
          setSubmittedIds(nextSubmitted)
        }
        if (showLoading) setListError(null)
      } catch (e) {
        if (showLoading) {
          setListError(`${s.globalIngestionLoadError} ${getRagIngestionErrorMessage(e)}`)
          setRows(defaultGlobalRows())
          setSubmittedIds(new Set())
        }
      } finally {
        if (showLoading) setListLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      setListLoading(true)
      setListError(null)
      try {
        const chunks = await fetchIngestedGlobalDocumentsReq()
        if (cancelled) return
        const { rows: nextRows, submittedIds: nextSubmitted } = rowsFromGlobalIngestedChunks(chunks)
        if (nextRows.length === 0) {
          setRows(defaultGlobalRows())
          setSubmittedIds(new Set())
        } else {
          setRows(nextRows)
          setSubmittedIds(nextSubmitted)
        }
      } catch (e) {
        if (cancelled) return
        setListError(`${s.globalIngestionLoadError} ${getRagIngestionErrorMessage(e)}`)
        setRows(defaultGlobalRows())
        setSubmittedIds(new Set())
      } finally {
        if (!cancelled) setListLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open])

  const handleClose = () => {
    if (!submitting) {
      resetState()
      onClose()
    }
  }

  const updateRow = useCallback(
    (id: string, patch: Partial<ProjectIngestionDocumentRow>) => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r
          const next = { ...r, ...patch }
          if (submittedIds.has(id)) {
            next.isEdited = true
          }
          return next
        })
      )
    },
    [submittedIds]
  )

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
    setSubmittedIds((prev) => {
      const n = new Set(prev)
      n.delete(id)
      return n
    })
  }, [])

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, createGlobalIngestionRow("other")])
  }, [])

  const toIngest = useMemo(
    () =>
      rows.filter(
        (r) => globalIngestionRowReady(r) && (!submittedIds.has(r.id) || r.isEdited)
      ),
    [rows, submittedIds]
  )

  const ingestOne = async (row: ProjectIngestionDocumentRow) => {
    const rawText = row.rawText.trim()
    const sourceOpt =
      row.docType === "other" ? row.documentKeyName.trim() || undefined : undefined
    if (row.sourceMode === "upload" && row.file) {
      return ingestGlobalDocumentMultipartReq({
        docType: row.docType,
        file: row.file,
        rawText,
        source: sourceOpt
      })
    }
    return ingestGlobalDocumentJsonReq({
      docType: row.docType,
      externalUrl: row.externalUrl.trim(),
      rawText,
      source: sourceOpt
    })
  }

  const handleIngest = async () => {
    if (toIngest.length === 0) {
      setBanner({ severity: "info", text: s.globalIngestionNothingToSend })
      return
    }
    setSubmitting(true)
    setBanner(null)
    try {
      const results = await Promise.allSettled(toIngest.map((row) => ingestOne(row)))
      const succeeded: string[] = []
      let failed = 0
      results.forEach((res, i) => {
        const id = toIngest[i].id
        if (res.status === "fulfilled") {
          succeeded.push(id)
        } else {
          failed += 1
        }
      })
      if (succeeded.length > 0) {
        setBanner({
          severity: failed > 0 ? "warning" : "success",
          text:
            formatCount(s.globalIngestionSuccess, succeeded.length) +
            (failed > 0 ? ` ${formatCount(s.documentIngestionPartialFailure, failed)}` : "")
        })
        await refreshGlobalRows({ showLoading: false })
      } else if (failed > 0) {
        const firstErr = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined
        const msg = firstErr ? getRagIngestionErrorMessage(firstErr.reason) : ""
        setBanner({
          severity: "error",
          text: `${formatCount(s.documentIngestionPartialFailure, failed)}${msg ? ` — ${msg}` : ""}`
        })
      }
    } catch (e) {
      setBanner({
        severity: "error",
        text: `${s.documentIngestionNetworkError} ${getRagIngestionErrorMessage(e)}`
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <PublicIcon color="primary" />
        {s.globalIngestionDialogTitle}
      </DialogTitle>
      <DialogContent dividers>
        {listLoading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {s.globalIngestionLoadingDocuments}
            </Typography>
            <LinearProgress />
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {s.globalIngestionDialogDescription}
        </Typography>
        {listError && (
          <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setListError(null)}>
            {listError}
          </Alert>
        )}
        {banner && (
          <Alert severity={banner.severity} sx={{ mb: 2 }} onClose={() => setBanner(null)}>
            {banner.text}
          </Alert>
        )}
        <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
          {s.globalIngestionDocumentsSection}
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          {rows.map((row) => (
            <GlobalDocumentIngestionCardCP
              key={row.id}
              row={row}
              isSubmitted={submittedIds.has(row.id) && !row.isEdited}
              onUpdate={updateRow}
              onRemove={removeRow}
              canRemove={rows.length > 1}
            />
          ))}
        </Stack>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={addRow}
          disabled={submitting || listLoading}
          sx={{ borderStyle: "dashed" }}
        >
          {s.documentIngestionAddOther}
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexWrap: "wrap", gap: 1 }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleClose} disabled={submitting}>
          {s.documentIngestionClose}
        </Button>
        <Button
          variant="contained"
          startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <CloudUploadIcon />}
          onClick={handleIngest}
          disabled={submitting || listLoading || toIngest.length === 0}
        >
          {submitting
            ? s.documentIngestionSubmitting
            : formatCount(s.globalIngestionSendCount, toIngest.length)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
