import React, { useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography
} from "@mui/material"
import { UploadFile as UploadIcon, Download as DownloadIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { RootState } from "../../../../app/store"
import {
  clearImportResultAct,
  fetchProjectLotsThunk,
  importProjectLotsExcelThunk
} from "../slice/lot-inventory.slice"
import { lotInventoryStrings as s } from "../../../../i18n/locales/lot-inventory.strings"

function downloadTemplate(): void {
  const csv =
    "nLots,area,price,ventor,status\n1,200,450000000,,\n2,200,450000000,Juan,V\n3,180,420000000,,S\n"
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "lot-inventory-template.csv"
  a.click()
  URL.revokeObjectURL(url)
}

export default function LotInventoryExcelImportCP() {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)
  const { projectId, kindFilter, actionLoading, importResult } = useAppSelector(
    (state: RootState) => state.lotInventory
  )
  const [fileName, setFileName] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const onFile = (file: File | null) => {
    if (!file) return
    setPendingFile(file)
    setFileName(file.name)
    dispatch(clearImportResultAct())
  }

  const runImport = async () => {
    if (!projectId || !pendingFile) return
    await dispatch(
      importProjectLotsExcelThunk({
        projectId,
        file: pendingFile,
        kind: kindFilter
      })
    )
    void dispatch(fetchProjectLotsThunk({ projectId }))
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        {s.excelTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {s.excelHint}
      </Typography>
      <Box
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0] ?? null
          onFile(file)
        }}
        onClick={() => inputRef.current?.click()}
        sx={{
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
          cursor: "pointer",
          mb: 1.5,
          transition: "border-color 200ms",
          "&:hover": { borderColor: "primary.main" }
        }}
      >
        <UploadIcon color="action" />
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {fileName ?? s.excelDrop}
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          hidden
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </Box>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button
          variant="contained"
          disabled={!pendingFile || actionLoading || !projectId}
          onClick={() => void runImport()}
        >
          {s.excelImport}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={downloadTemplate}
        >
          {s.excelTemplate}
        </Button>
      </Stack>
      {importResult && (
        <Alert
          severity={importResult.errors.length ? "warning" : "success"}
          sx={{ mt: 1.5 }}
          onClose={() => dispatch(clearImportResultAct())}
        >
          {s.excelResult}: {importResult.created} {s.excelCreated},{" "}
          {importResult.updated} {s.excelUpdated}
          {importResult.errors.length > 0 &&
            ` — ${importResult.errors.length} ${s.excelErrors}: ${importResult.errors.slice(0, 3).join("; ")}`}
        </Alert>
      )}
    </Paper>
  )
}
