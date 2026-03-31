import {
  RAG_GLOBAL_PROJECT_ID,
  type VectorizedDocumentChunk
} from "../../../app/services/project-document-ingestion.service"
import {
  STANDARD_PROJECT_DOC_TYPES,
  type ProjectIngestionDocType,
  type ProjectIngestionDocumentRow
} from "../types/project-document-ingestion.types"

const CHUNK_GROUP_SEP = "\u0000"

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim())
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export function createGlobalIngestionRow(
  docType: ProjectIngestionDocType = "other"
): ProjectIngestionDocumentRow {
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

export const ALL_INGESTION_DOC_TYPES: ProjectIngestionDocType[] = [
  ...STANDARD_PROJECT_DOC_TYPES,
  "other"
]

/** Groups Weaviate chunks for projectId GLOBAL into editor rows (one row per docType + source). */
export function rowsFromGlobalIngestedChunks(chunks: VectorizedDocumentChunk[]): {
  rows: ProjectIngestionDocumentRow[]
  submittedIds: Set<string>
} {
  const globalChunks = chunks.filter((c) => c.projectId === RAG_GLOBAL_PROJECT_ID)
  const byKey = new Map<string, VectorizedDocumentChunk[]>()
  for (const c of globalChunks) {
    const sourceNorm = (c.source ?? "").trim()
    const key = `${c.docType}${CHUNK_GROUP_SEP}${sourceNorm}`
    const list = byKey.get(key) ?? []
    list.push(c)
    byKey.set(key, list)
  }
  const rows: ProjectIngestionDocumentRow[] = []
  const submittedIds = new Set<string>()
  for (const [key, list] of byKey) {
    const sep = key.indexOf(CHUNK_GROUP_SEP)
    const docType = (sep >= 0 ? key.slice(0, sep) : "other") as ProjectIngestionDocType
    const sourcePart = sep >= 0 ? key.slice(sep + CHUNK_GROUP_SEP.length) : ""
    const r = createGlobalIngestionRow(docType)
    r.rawText = list.map((x) => x.text).join("\n\n")
    if (docType === "other") {
      r.documentKeyName = sourcePart
    }
    const src0 = list[0]?.source?.trim() ?? ""
    if (src0 && isHttpUrl(src0)) {
      r.sourceMode = "url"
      r.externalUrl = src0
    }
    r.currentDocType = docType
    r.currentSource = src0
    submittedIds.add(r.id)
    rows.push(r)
  }
  rows.sort((a, b) => {
    const ka = `${a.docType}\0${a.documentKeyName}`
    const kb = `${b.docType}\0${b.documentKeyName}`
    return ka.localeCompare(kb)
  })
  return { rows, submittedIds }
}
