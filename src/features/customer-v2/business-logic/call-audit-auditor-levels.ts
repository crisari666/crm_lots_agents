/** Matches `UserLevel` in omega_office_back: subadmin (coordinator), commercialDirector. */
export const CALL_AUDIT_AUDITOR_LEVELS = [1, 2] as const

export type CallAuditAuditorLevel = (typeof CALL_AUDIT_AUDITOR_LEVELS)[number]

export function isCallAuditAuditorLevel(level: number | undefined): level is CallAuditAuditorLevel {
  return level === 1 || level === 2
}
