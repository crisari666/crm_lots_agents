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
import { Add as AddIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { projectStrings as s } from "../../../i18n/locales/project.strings"
import {
  fetchIngestedDocumentsByProjectReq,
  ingestProjectDocumentJsonReq,
  ingestProjectDocumentMultipartReq,
  getRagIngestionErrorMessage,
  updateProjectDocumentJsonReq,
  updateProjectDocumentMultipartReq
} from "../../../app/services/project-document-ingestion.service"
import ProjectDocumentIngestionCardCP, { rowReadyForIngest } from "./project-document-ingestion-card.cp"
import { STANDARD_PROJECT_DOC_TYPES } from "../types/project-document-ingestion.types"
import type { ProjectIngestionDocumentRow } from "../types/project-document-ingestion.types"
import {
  createEmptyIngestionRow,
  rowsFromIngestedChunks
} from "../utils/project-document-ingestion-load.utils"

function formatCount(template: string, count: number) {
  return template.replace(/\{\{count\}\}/g, String(count))
}

function initialEmptyRows(): ProjectIngestionDocumentRow[] {
  return STANDARD_PROJECT_DOC_TYPES.map((dt) => createEmptyIngestionRow(dt))
}

type Props = {
  open: boolean
  onClose: () => void
  projectId: string
}

export default function ProjectDocumentIngestionDialogCP({ open, onClose, projectId }: Props) {
  const [rows, setRows] = useState<ProjectIngestionDocumentRow[]>(initialEmptyRows)
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(() => new Set())
  const [submitting, setSubmitting] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)
  const [banner, setBanner] = useState<{
    severity: "success" | "error" | "info" | "warning"
    text: string
  } | null>(null)

  const resetState = useCallback(() => {
    setRows(initialEmptyRows())
    setSubmittedIds(new Set())
    setBanner(null)
    setListError(null)
    setListLoading(false)
  }, [])

  const refreshIngestedRows = useCallback(
    async (opts: { showLoading?: boolean } = {}) => {
      const showLoading = opts.showLoading !== false
      if (showLoading) {
        setListLoading(true)
        setListError(null)
      }
      try {
        const chunks = await fetchIngestedDocumentsByProjectReq(projectId)
        const { rows: nextRows, submittedIds: nextSubmitted } = rowsFromIngestedChunks(chunks)
        setRows(nextRows)
        setSubmittedIds(nextSubmitted)
        if (showLoading) setListError(null)
      } catch (e) {
        if (showLoading) {
          setListError(`${s.documentIngestionLoadError} ${getRagIngestionErrorMessage(e)}`)
          setRows(initialEmptyRows())
          setSubmittedIds(new Set())
        }
      } finally {
        if (showLoading) setListLoading(false)
      }
    },
    [projectId]
  )

  useEffect(() => {
    if (!open || !projectId) return
    let cancelled = false
    ;(async () => {
      setListLoading(true)
      setListError(null)
      try {
        const chunks = await fetchIngestedDocumentsByProjectReq(projectId)
        if (cancelled) return
        const { rows: nextRows, submittedIds: nextSubmitted } = rowsFromIngestedChunks(chunks)
        setRows(nextRows)
        setSubmittedIds(nextSubmitted)
      } catch (e) {
        if (cancelled) return
        setListError(`${s.documentIngestionLoadError} ${getRagIngestionErrorMessage(e)}`)
        setRows(initialEmptyRows())
        setSubmittedIds(new Set())
      } finally {
        if (!cancelled) setListLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, projectId])

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

  const addOther = useCallback(() => {
    setRows((prev) => [...prev, createEmptyIngestionRow("other")])
  }, [])

  const toIngest = useMemo(
    () =>
      rows.filter(
        (r) => rowReadyForIngest(r) && (!submittedIds.has(r.id) || r.isEdited)
      ),
    [rows, submittedIds]
  )

  const ingestOne = async (row: ProjectIngestionDocumentRow) => {
    const rawText = row.rawText.trim()
    const newSource =
      row.docType === "other" ? row.documentKeyName.trim() || undefined : undefined
    const isUpdate = submittedIds.has(row.id)
    if (isUpdate && row.currentDocType !== undefined && row.currentSource !== undefined) {
      if (row.sourceMode === "upload" && row.file) {
        return updateProjectDocumentMultipartReq({
          projectId,
          currentDocType: row.currentDocType,
          currentSource: row.currentSource,
          newDocType: row.docType,
          newSource: newSource ?? "",
          file: row.file,
          rawText
        })
      }
      return updateProjectDocumentJsonReq({
        projectId,
        currentDocType: row.currentDocType,
        currentSource: row.currentSource,
        newDocType: row.docType,
        newSource: newSource ?? "",
        externalUrl: row.externalUrl.trim(),
        rawText
      })
    }
    if (row.sourceMode === "upload" && row.file) {
      return ingestProjectDocumentMultipartReq({
        projectId,
        docType: row.docType,
        file: row.file,
        rawText,
        source: newSource
      })
    }
    return ingestProjectDocumentJsonReq({
      projectId,
      docType: row.docType,
      externalUrl: row.externalUrl.trim(),
      rawText,
      source: newSource
    })
  }

  const handleIngest = async () => {
    if (toIngest.length === 0) {
      setBanner({ severity: "info", text: s.documentIngestionNothingToSend })
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
        setSubmittedIds((prev) => {
          const n = new Set(prev)
          succeeded.forEach((id) => n.add(id))
          return n
        })
        setRows((prev) =>
          prev.map((r) =>
            succeeded.includes(r.id) ? { ...r, isEdited: false } : r
          )
        )
        setBanner({
          severity: failed > 0 ? "warning" : "success",
          text:
            formatCount(s.documentIngestionSuccess, succeeded.length) +
            (failed > 0 ? ` ${formatCount(s.documentIngestionPartialFailure, failed)}` : "")
        })
        await refreshIngestedRows({ showLoading: false })
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

  const standardRows = rows.filter((r) => r.docType !== "other")
  const otherRows = rows.filter((r) => r.docType === "other")

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle>{s.documentIngestionDialogTitle}</DialogTitle>
      <DialogContent dividers>
        {listLoading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {s.documentIngestionLoadingDocuments}
            </Typography>
            <LinearProgress />
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {s.documentIngestionDialogDescription}
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
          {s.documentIngestionStandardSection}
        </Typography>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          {standardRows.map((row) => (
            <ProjectDocumentIngestionCardCP
              key={row.id}
              row={row}
              isSubmitted={submittedIds.has(row.id) && !row.isEdited}
              onUpdate={updateRow}
            />
          ))}
        </Stack>
        {otherRows.length > 0 && (
          <>
            <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1 }}>
              {s.documentIngestionAdditionalSection}
            </Typography>
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {otherRows.map((row) => (
                <ProjectDocumentIngestionCardCP
                  key={row.id}
                  row={row}
                  isSubmitted={submittedIds.has(row.id) && !row.isEdited}
                  onUpdate={updateRow}
                  onRemove={removeRow}
                />
              ))}
            </Stack>
          </>
        )}
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={addOther}
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
            : formatCount(s.documentIngestionSendCount, toIngest.length)}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
