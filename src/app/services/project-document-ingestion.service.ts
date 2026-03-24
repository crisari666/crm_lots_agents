import { AxiosError } from "axios"
import { RagApi } from "../axios"

const PROJECT_RAG_INGESTION_PATH = "rag/ingestion"
const PROJECT_RAG_INGESTION_DOCUMENTS_PATH = "rag/ingestion/documents"

export type VectorizedDocumentChunk = {
  id: string
  text: string
  projectId: string
  docType: string
  source: string
}

function parseVectorizedDocuments(data: unknown): VectorizedDocumentChunk[] {
  if (!Array.isArray(data)) return []
  const out: VectorizedDocumentChunk[] = []
  for (const item of data) {
    if (!item || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    if (typeof o.docType !== "string" || typeof o.text !== "string") continue
    out.push({
      id: typeof o.id === "string" ? o.id : "",
      text: o.text,
      projectId: typeof o.projectId === "string" ? o.projectId : "",
      docType: o.docType,
      source: typeof o.source === "string" ? o.source : ""
    })
  }
  return out
}

export async function fetchIngestedDocumentsByProjectReq(
  projectId: string
): Promise<VectorizedDocumentChunk[]> {
  const api = RagApi.getInstance()
  const data = await api.get({
    path: PROJECT_RAG_INGESTION_DOCUMENTS_PATH,
    data: { projectId }
  })
  return parseVectorizedDocuments(data)
}

export type IngestProjectDocumentResponse = {
  message: string
  chunks: number
  projectId?: string
}

export async function ingestProjectDocumentJsonReq(payload: {
  projectId: string
  docType: string
  externalUrl: string
  rawText: string
  source?: string
}): Promise<IngestProjectDocumentResponse> {
  const api = RagApi.getInstance()
  return api.post({ path: PROJECT_RAG_INGESTION_PATH, data: payload })
}

export async function ingestProjectDocumentMultipartReq(params: {
  projectId: string
  docType: string
  file: File
  rawText: string
  source?: string
}): Promise<IngestProjectDocumentResponse> {
  const api = RagApi.getInstance()
  const formData = new FormData()
  formData.append("projectId", params.projectId)
  formData.append("docType", params.docType)
  formData.append("file", params.file)
  formData.append("rawText", params.rawText.trim())
  if (params.source?.trim()) {
    formData.append("source", params.source.trim())
  }
  return api.post({
    path: PROJECT_RAG_INGESTION_PATH,
    data: formData,
    isFormData: true
  })
}

export function getRagIngestionErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ message?: string }>
  const msg = err.response?.data?.message
  if (typeof msg === "string" && msg.length > 0) return msg
  if (err.message) return err.message
  return "Error"
}
