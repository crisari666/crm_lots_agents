import * as XLSX from "xlsx"
import type { CreateWebinarLeadBody } from "../types/webinar.types"

export type WebinarImportPreviewRow = {
  readonly rowNumber: number
  readonly name: string
  readonly lastName: string
  readonly phone: string
  readonly email: string
  readonly errors: readonly string[]
  readonly isValid: boolean
}

const TEMPLATE_HEADERS = ["name", "lastName", "phone", "email"] as const

function normalizeHeader(header: string): string {
  return (header || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase()
}

function isLikelyEmail(value: string): boolean {
  if (value.length === 0) {
    return true
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validateRow(input: {
  readonly rowNumber: number
  readonly name: string
  readonly lastName: string
  readonly phone: string
  readonly email: string
  readonly seenPhones: Set<string>
}): WebinarImportPreviewRow {
  const errors: string[] = []
  if (input.name.trim().length === 0) {
    errors.push("Nombre requerido")
  }
  const phoneDigits = input.phone.replace(/\D/g, "")
  if (phoneDigits.length < 7) {
    errors.push("Teléfono inválido")
  } else if (input.seenPhones.has(phoneDigits)) {
    errors.push("Teléfono duplicado en el archivo")
  } else {
    input.seenPhones.add(phoneDigits)
  }
  if (!isLikelyEmail(input.email.trim())) {
    errors.push("Email inválido")
  }
  return {
    rowNumber: input.rowNumber,
    name: input.name.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    errors,
    isValid: errors.length === 0,
  }
}

function parseMatrix(rows: unknown[][]): WebinarImportPreviewRow[] {
  if (rows.length < 2) {
    return []
  }
  const headerRow = rows[0].map((cell) => normalizeHeader(String(cell ?? "")))
  const nameIdx = headerRow.findIndex((h) => h === "name" || h === "nombre")
  const lastNameIdx = headerRow.findIndex(
    (h) => h === "lastname" || h === "apellido" || h === "apellidos"
  )
  const phoneIdx = headerRow.findIndex(
    (h) => h === "phone" || h === "telefono" || h === "whatsapp" || h === "celular"
  )
  const emailIdx = headerRow.findIndex((h) => h === "email" || h === "correo")
  if (nameIdx < 0 || phoneIdx < 0) {
    return []
  }
  const seenPhones = new Set<string>()
  const preview: WebinarImportPreviewRow[] = []
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i] ?? []
    const name = String(row[nameIdx] ?? "").trim()
    const lastName =
      lastNameIdx >= 0 ? String(row[lastNameIdx] ?? "").trim() : ""
    const phone = String(row[phoneIdx] ?? "").trim()
    const email = emailIdx >= 0 ? String(row[emailIdx] ?? "").trim() : ""
    if (name.length === 0 && phone.length === 0 && email.length === 0) {
      continue
    }
    preview.push(
      validateRow({
        rowNumber: i + 1,
        name,
        lastName,
        phone,
        email,
        seenPhones,
      })
    )
  }
  return preview
}

function parseCsvText(text: string): unknown[][] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  return lines.map((line) => {
    const parts: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if ((char === "," || char === ";") && !inQuotes) {
        parts.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    parts.push(current.trim())
    return parts
  })
}

/**
 * Parses CSV or Excel (.xlsx) into validated preview rows for webinar import.
 */
export async function parseWebinarLeadsImportFile(
  file: File
): Promise<WebinarImportPreviewRow[]> {
  const lowerName = file.name.toLowerCase()
  if (lowerName.endsWith(".csv") || file.type.includes("csv")) {
    const text = await file.text()
    return parseMatrix(parseCsvText(text))
  }
  if (
    lowerName.endsWith(".xlsx") ||
    lowerName.endsWith(".xls") ||
    file.type.includes("sheet") ||
    file.type.includes("excel")
  ) {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array" })
    const firstSheetName = workbook.SheetNames[0]
    if (firstSheetName == null) {
      return []
    }
    const sheet = workbook.Sheets[firstSheetName]
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: "",
      raw: false,
    })
    return parseMatrix(rows)
  }
  throw new Error("Formato no soportado. Usa CSV o Excel (.xlsx)")
}

export function downloadWebinarLeadsImportTemplate(): void {
  const csv = `${TEMPLATE_HEADERS.join(",")}\nJuan,Perez,573001112233,juan@email.com\nMaria,Lopez,573004445566,\n`
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = "webinar-leads-template.csv"
  anchor.click()
  URL.revokeObjectURL(url)
}

export function mapValidPreviewRowsToImportBody(
  rows: readonly WebinarImportPreviewRow[]
): Array<Pick<CreateWebinarLeadBody, "name" | "lastName" | "email" | "phone">> {
  return rows
    .filter((row) => row.isValid)
    .map((row) => ({
      name: row.name,
      ...(row.lastName.length > 0 ? { lastName: row.lastName } : {}),
      ...(row.email.length > 0 ? { email: row.email } : {}),
      phone: row.phone,
    }))
}
