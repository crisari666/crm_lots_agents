import type { LeadAssistantProject, LeadFaq, LeadFaqCategory } from "../types/lead-assistant.types"

export const FAQ_CATEGORY_ORDER: readonly LeadFaqCategory[] = [
  "price",
  "financing",
  "legal",
  "services",
  "location",
  "process",
  "other",
] as const

export type CoverageCellState = "general" | "own" | "missing"

export type CoverageRow = {
  readonly faq: LeadFaq
  readonly cells: Readonly<Record<string, CoverageCellState>>
  readonly coveredCount: number
  readonly totalProjects: number
}

export type CoverageGroup = {
  readonly category: LeadFaqCategory
  readonly rows: readonly CoverageRow[]
}

function hasText(value: string | undefined): boolean {
  return value != null && value.trim().length > 0
}

export function getCoverageCellState(faq: LeadFaq, projectId: string): CoverageCellState {
  const ownAnswer = faq.projectAnswers.find((answer) => answer.projectId === projectId)
  if (ownAnswer != null && hasText(ownAnswer.answer)) {
    return "own"
  }
  return hasText(faq.defaultAnswer) ? "general" : "missing"
}

/**
 * Same rule as the agent resolver: project override wins, else general answer.
 * Empty string when neither applies.
 */
export function resolveFaqAnswer(faq: LeadFaq, projectId?: string): string {
  if (projectId != null) {
    const ownAnswer = faq.projectAnswers.find((answer) => answer.projectId === projectId)
    if (ownAnswer != null && hasText(ownAnswer.answer)) {
      return ownAnswer.answer.trim()
    }
  }
  return hasText(faq.defaultAnswer) ? faq.defaultAnswer!.trim() : ""
}

function buildCoverageRow(faq: LeadFaq, projects: readonly LeadAssistantProject[]): CoverageRow {
  const cells = Object.fromEntries(
    projects.map((project) => [project.id, getCoverageCellState(faq, project.id)] as const),
  )
  return {
    faq,
    cells,
    coveredCount: Object.values(cells).filter((state) => state !== "missing").length,
    totalProjects: projects.length,
  }
}

/** Questions grouped by category (fixed order), each with its answer state per project. */
export function buildFaqCoverage(
  faqs: readonly LeadFaq[],
  projects: readonly LeadAssistantProject[],
): CoverageGroup[] {
  return FAQ_CATEGORY_ORDER.map((category) => ({
    category,
    rows: faqs
      .filter((faq) => faq.category === category)
      .map((faq) => buildCoverageRow(faq, projects)),
  })).filter((group) => group.rows.length > 0)
}
