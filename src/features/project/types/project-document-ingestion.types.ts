export const STANDARD_PROJECT_DOC_TYPES = [
  "images",
  "plane",
  "brochure",
  "reellVideo",
  "rut",
  "business_registration",
  "bank_certificate",
  "libertarian_certificate"
] as const

export type StandardProjectDocType = (typeof STANDARD_PROJECT_DOC_TYPES)[number]
export type ProjectIngestionDocType = StandardProjectDocType | "other"

/** File upload vs external URL; text description (rawText) is always required in the UI */
export type ProjectIngestionSourceMode = "upload" | "url"

export type ProjectIngestionDocumentRow = {
  id: string
  docType: ProjectIngestionDocType
  sourceMode: ProjectIngestionSourceMode
  /** Always required: human description / context for the document */
  rawText: string
  externalUrl: string
  /** Required when docType is "other": API `source` / document key name */
  documentKeyName: string
  file?: File
  isEdited?: boolean
}
