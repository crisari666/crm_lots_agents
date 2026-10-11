import type { ProjectType } from "../types/project.types"

export function hasProjectLegalDocuments(
  project: Pick<
    ProjectType,
    "legalRut" | "legalBusinessRegistration" | "legalBankCertificate" | "legalLibertarianCertificate"
  >
): boolean {
  return [
    project.legalRut,
    project.legalBusinessRegistration,
    project.legalBankCertificate,
    project.legalLibertarianCertificate
  ].some((name) => (name ?? "").trim().length > 0)
}
