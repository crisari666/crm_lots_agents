import { project3dStudioStrings as s } from "../../../../i18n/locales/project-3d-studio.strings"
import type {
  ProjectLocationCategory,
  ProjectLocationImportance
} from "../types/project-experience.types"

export function getCategoryLabel(category: ProjectLocationCategory): string {
  const map: Record<ProjectLocationCategory, string> = {
    hospital: s.categoryHospital,
    education: s.categoryEducation,
    shopping: s.categoryShopping,
    tourism: s.categoryTourism,
    nature: s.categoryNature,
    transport: s.categoryTransport,
    road: s.categoryRoad,
    town: s.categoryTown,
    services: s.categoryServices,
    other: s.categoryOther
  }
  return map[category]
}

export function getImportanceLabel(
  importance: ProjectLocationImportance
): string {
  const map: Record<ProjectLocationImportance, string> = {
    low: s.importanceLow,
    medium: s.importanceMedium,
    high: s.importanceHigh,
    featured: s.importanceFeatured
  }
  return map[importance]
}

export function isStaleVerification(verifiedAt: string | null): boolean {
  if (!verifiedAt) return false
  const ms = Date.now() - new Date(verifiedAt).getTime()
  return ms > 182 * 24 * 60 * 60 * 1000
}
