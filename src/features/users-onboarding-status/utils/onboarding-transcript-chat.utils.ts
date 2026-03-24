export type TranscriptChatSpeakerType = "assistant" | "user"

export type TranscriptChatMessageType = {
  speaker: TranscriptChatSpeakerType
  content: string
}

export const CALL_TRANSCRIPT_COMPLETE_EVENT = "call.transcript_complete"

export const TRANSCRIPT_CHAT_OMIT_DETAIL_KEYS = ["transcript", "segments"] as const

function normalizeTranscriptSpeaker(role: string): TranscriptChatSpeakerType {
  const r = role.trim().toLowerCase()
  if (["assistant", "agent", "system"].includes(r)) {
    return "assistant"
  }
  if (["user", "customer", "caller", "human"].includes(r)) {
    return "user"
  }
  return "assistant"
}

function messagesFromSegmentArray(raw: unknown): TranscriptChatMessageType[] | null {
  if (!Array.isArray(raw) || raw.length === 0) {
    return null
  }
  const out: TranscriptChatMessageType[] = []
  for (const item of raw) {
    if (item == null || typeof item !== "object") {
      continue
    }
    const o = item as Record<string, unknown>
    const role = typeof o.role === "string" ? o.role : "unknown"
    const contentRaw = o.content
    const content =
      typeof contentRaw === "string" ? contentRaw.trim() : String(contentRaw ?? "").trim()
    if (content.length === 0) {
      continue
    }
    out.push({ speaker: normalizeTranscriptSpeaker(role), content })
  }
  return out.length > 0 ? out : null
}

/** Plain text from voice agent: `role: text` blocks separated by blank lines */
function messagesFromPlainTranscript(transcript: string): TranscriptChatMessageType[] | null {
  const blocks = transcript
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
  const out: TranscriptChatMessageType[] = []
  for (const block of blocks) {
    const idx = block.indexOf(":")
    if (idx <= 0) {
      continue
    }
    const role = block.slice(0, idx).trim()
    const content = block.slice(idx + 1).trim()
    if (content.length === 0) {
      continue
    }
    out.push({ speaker: normalizeTranscriptSpeaker(role), content })
  }
  return out.length > 0 ? out : null
}

/**
 * Voice agent stores ordered `{ role, content }[]` in `segments` and a joined `transcript`.
 * Prefer `segments` for chat UI; fall back to parsing `transcript` when segments are absent.
 */
export function getCallTranscriptChatMessages(
  eventKey: string,
  details: Record<string, unknown> | undefined
): TranscriptChatMessageType[] | null {
  if (eventKey !== CALL_TRANSCRIPT_COMPLETE_EVENT || details == null) {
    return null
  }
  const fromSegments = messagesFromSegmentArray(details.segments)
  if (fromSegments != null) {
    return fromSegments
  }
  const tr = details.transcript
  if (typeof tr === "string" && tr.trim().length > 0) {
    return messagesFromPlainTranscript(tr.trim())
  }
  return null
}
