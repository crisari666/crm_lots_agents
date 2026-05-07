import type {
  ProjectIngestionDocType,
  ProjectIngestionDocumentRow
} from "../types/project-document-ingestion.types"

export const MIN_LONG_MEDIA_DESCRIPTION = 200

export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function fileIsPdfOrWordUpload(file?: File): boolean {
  if (!file) return false
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()
  if (mime === "application/pdf" || mime === "application/x-pdf") return true
  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return true
  }
  if (mime === "application/msword") return true
  if (name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc")) return true
  return false
}

export function docTypeNeedsLongDescription(docType: ProjectIngestionDocType): boolean {
  return (
    docType === "images" ||
    docType === "reellVideo" ||
    docType === "plane" ||
    docType === "brochure"
  )
}

export function ingestionRowMeetsDescriptionRules(row: ProjectIngestionDocumentRow): boolean {
  const raw = row.rawText.trim()
  if (row.docType === "other" && row.documentKeyName.trim().length === 0) return false
  if (row.sourceMode === "upload") {
    if (!row.file) return false
    if (fileIsPdfOrWordUpload(row.file)) {
      return true
    }
    if (docTypeNeedsLongDescription(row.docType)) {
      return raw.length >= MIN_LONG_MEDIA_DESCRIPTION
    }
    return raw.length > 0
  }
  if (!isValidHttpUrl(row.externalUrl)) return false
  if (docTypeNeedsLongDescription(row.docType)) {
    return raw.length >= MIN_LONG_MEDIA_DESCRIPTION
  }
  return raw.length > 0
}
