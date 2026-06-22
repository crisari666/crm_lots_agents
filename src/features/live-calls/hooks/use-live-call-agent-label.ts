import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import { resolveCallAuditUserLabel } from "../../customer-v2/components/call-audit/call-audit-user-label.util"

export function useLiveCallAgentLabel(agentExternalRef?: string): string {
  const usersOriginal = useAppSelector((s) => s.users.usersOriginal)
  return useMemo(() => {
    if (!agentExternalRef) return "—"
    return resolveCallAuditUserLabel(agentExternalRef, usersOriginal)
  }, [agentExternalRef, usersOriginal])
}
