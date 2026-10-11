export const PROJECT_FORM_SECTION_IDS = [
  "general",
  "location",
  "sales",
  "amenities",
  "images",
  "videos",
  "documents",
  "legal"
] as const

export type ProjectFormSectionId = (typeof PROJECT_FORM_SECTION_IDS)[number]

export type ProjectFormSectionToggleProps = {
  isExpanded: (id: ProjectFormSectionId) => boolean
  onToggle: (id: string) => void
}
