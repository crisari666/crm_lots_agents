import {
  STANDARD_PROJECT_DOC_TYPES,
  type ProjectIngestionDocumentRow,
  type ProjectIngestionDocType
} from "../types/project-document-ingestion.types"
import type { VectorizedDocumentChunk } from "../../../app/services/project-document-ingestion.service"

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function createEmptyIngestionRow(docType: ProjectIngestionDocType): ProjectIngestionDocumentRow {
  return {
    id: crypto.randomUUID(),
    docType,
    currentDocType: undefined,
    sourceMode: "upload",
    rawText: "",
    externalUrl: "",
    documentKeyName: "",
    currentSource: undefined,
    isEdited: false
  }
}

/** Maps Weaviate chunks (many per logical document) into editor rows and marks which rows already have ingested data. */
export function rowsFromIngestedChunks(chunks: VectorizedDocumentChunk[]): {
  rows: ProjectIngestionDocumentRow[]
  submittedIds: Set<string>
} {
  const standardRows = STANDARD_PROJECT_DOC_TYPES.map((dt) => createEmptyIngestionRow(dt))
  const submittedIds = new Set<string>()

  const byDocType = new Map<string, VectorizedDocumentChunk[]>()
  const otherChunks: VectorizedDocumentChunk[] = []
  for (const c of chunks) {
    if (c.docType === "other") {
      otherChunks.push(c)
    } else {
      const list = byDocType.get(c.docType) ?? []
      list.push(c)
      byDocType.set(c.docType, list)
    }
  }

  const mergedStandard = standardRows.map((row) => {
    const list = byDocType.get(row.docType) ?? []
    if (list.length === 0) return row
    const rawText = list.map((x) => x.text).join("\n\n")
    const src = list[0]?.source?.trim() ?? ""
    let sourceMode: "upload" | "url" = "upload"
    let externalUrl = ""
    if (src && isHttpUrl(src)) {
      sourceMode = "url"
      externalUrl = src
    }
    submittedIds.add(row.id)
    return {
      ...row,
      rawText,
      sourceMode,
      externalUrl,
      documentKeyName: "",
      currentDocType: row.docType,
      currentSource: src,
      isEdited: false
    }
  })

  const otherBySource = new Map<string, VectorizedDocumentChunk[]>()
  for (const c of otherChunks) {
    const key = c.source?.trim() || "__empty__"
    const list = otherBySource.get(key) ?? []
    list.push(c)
    otherBySource.set(key, list)
  }

  const otherRows: ProjectIngestionDocumentRow[] = []
  for (const [sourceKey, list] of otherBySource) {
    const r = createEmptyIngestionRow("other")
    r.documentKeyName = sourceKey === "__empty__" ? "" : sourceKey
    r.rawText = list.map((x) => x.text).join("\n\n")
    const src0 = list[0]?.source?.trim() ?? ""
    if (src0 && isHttpUrl(src0)) {
      r.sourceMode = "url"
      r.externalUrl = src0
    }
    r.currentDocType = "other"
    r.currentSource = src0
    submittedIds.add(r.id)
    otherRows.push(r)
  }

  return { rows: [...mergedStandard, ...otherRows], submittedIds }
}
