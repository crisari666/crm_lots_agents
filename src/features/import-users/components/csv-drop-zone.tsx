import { useCallback, useState } from "react"
import { Box, Button, Paper, Typography } from "@mui/material"
import CloudUpload from "@mui/icons-material/CloudUpload"
import CSVReader from "react-csv-reader"
import { useAppDispatch } from "../../../app/hooks"
import { setPreviewRowsAct } from "../import-users.slice"
import type { ImportUserRowPreview } from "../import-users.state"

const CSV_ACCEPT = ".csv"
const INPUT_ID = "import-users-csv-input"

function normalizeHeader(h: string): string {
  return (h || "")
    .trim()
    .normalize("NFD")
    .replace(/\u0301/g, "")
    .replace(/\s/g, "")
}

function parseCsvRows(rows: string[][]): ImportUserRowPreview[] {
  console.log({rows})
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => normalizeHeader(h))
  console.log({headers})
  const firstNameIdx = headers.indexOf("firstName")
  const lastNameIdx = headers.indexOf("lastName")
  const phoneIdx = headers.indexOf("phone")
  const emailIdx = headers.indexOf("email")
  if ([firstNameIdx, lastNameIdx, phoneIdx, emailIdx].some((i) => i === -1)) {
    return []
  }
  const result: ImportUserRowPreview[] = []
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const name = (row[firstNameIdx] ?? "").trim()
    const lastName = (row[lastNameIdx] ?? "").trim()
    const phone = (row[phoneIdx] ?? "").trim()
    const email = (row[emailIdx] ?? "").trim()
    if (!email) continue
    result.push({ name, lastName, phone, email })
  }
  return result
}

function parseCsvText(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  return lines.map((line) => {
    const parts: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') {
        inQuotes = !inQuotes
      } else if ((c === "," || c === ";") && !inQuotes) {
        parts.push(current.trim())
        current = ""
      } else {
        current += c
      }
    }
    parts.push(current.trim())
    return parts
  })
}

export default function CsvDropZone() {
  const dispatch = useAppDispatch()
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processCsvData = useCallback(
    (data: string[][]) => {
      setError(null)
      console.log({data})
      const parsed = parseCsvRows(data)
      if (parsed.length === 0) {
        setError("El CSV debe tener columnas: firstName, lastName, phone, email")
        return
      }
      dispatch(setPreviewRowsAct(parsed))
    },
    [dispatch]
  )

  const handleCsvReaderLoaded = useCallback(
    (data: Array<unknown>) => {
      processCsvData(data as string[][])
    },
    [processCsvData]
  )

  const handleCsvReaderError = useCallback((err: Error) => {
    setError(err.message ?? "Error al leer el CSV")
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      const file = e.dataTransfer?.files?.[0]
      if (!file || !file.name.toLowerCase().endsWith(".csv")) {
        setError("Suelta un archivo CSV")
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        const rows = parseCsvText(reader.result as string)
        processCsvData(rows)
      }
      reader.readAsText(file, "UTF-8")
    },
    [processCsvData]
  )

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        border: "2px dashed",
        borderColor: dragOver ? "primary.main" : "divider",
        bgcolor: dragOver ? "action.hover" : "background.paper",
        transition: "background-color 0.2s, border-color 0.2s"
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <CloudUpload sx={{ fontSize: 48, color: "text.secondary" }} />
        <Typography variant="body1" color="text.secondary">
          Arrastra un archivo CSV aquí o selecciona uno
        </Typography>
        <Button component="label" variant="outlined" size="small" htmlFor={INPUT_ID}>
          Seleccionar archivo CSV
        </Button>
        <Box
          sx={{
            "& input": {
              position: "absolute",
              width: 0,
              height: 0,
              opacity: 0,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)"
            }
          }}
        >
          <CSVReader
            inputId={INPUT_ID}
            accept={CSV_ACCEPT}
            parserOptions={{ header: false }}
            onFileLoaded={handleCsvReaderLoaded}
            onError={handleCsvReaderError}
            fileEncoding="UTF-8"
          />
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Paper>
  )
}
