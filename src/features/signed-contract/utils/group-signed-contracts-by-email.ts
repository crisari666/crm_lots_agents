import type { SignedContractListItem } from "../types/signed-contract.types"

/**
 * One row per email: latest send date, any signed → true + latest signature time, send count.
 */
export function groupSignedContractsByEmail(
  items: SignedContractListItem[],
): SignedContractListItem[] {
  const byKey = new Map<string, SignedContractListItem[]>()
  for (const it of items) {
    const k = it.userEmail.trim().toLowerCase()
    const list = byKey.get(k) ?? []
    list.push(it)
    byKey.set(k, list)
  }
  const out: SignedContractListItem[] = []
  for (const [, group] of byKey) {
    const sorted = [...group].sort(
      (a, b) =>
        new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime(),
    )
    const latest = sorted[0]
    const anySigned = sorted.some((r) => r.signed)
    const signedRows = sorted.filter((r) => r.signed)
    const signedTimes = signedRows
      .filter((r) => r.dateSigned != null && r.dateSigned !== "")
      .map((r) => new Date(r.dateSigned!).getTime())
    const maxSignedIso =
      signedTimes.length > 0
        ? new Date(Math.max(...signedTimes)).toISOString()
        : signedRows[0]?.dateSigned ?? null
    const latestSignedPdfLink =
      signedRows.find(
        (row) => row.signedPdfLink != null && row.signedPdfLink.trim() !== "",
      )?.signedPdfLink ?? null
    const bestName =
      sorted.find((r) => r.name.trim() !== "")?.name ?? latest.name
    const emailKey = latest.userEmail.trim().toLowerCase()
    out.push({
      ...latest,
      id: `group:${emailKey}`,
      name: bestName,
      signed: anySigned,
      dateSigned: anySigned ? maxSignedIso : null,
      dateSent: latest.dateSent,
      signedPdfLink: anySigned ? latestSignedPdfLink : null,
      sendCount: group.length,
    })
  }
  out.sort(
    (a, b) => new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime(),
  )
  return out
}
