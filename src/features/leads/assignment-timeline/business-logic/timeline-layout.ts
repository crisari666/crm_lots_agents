import type {
  AssignmentTimelineClockMode,
  AssignmentTimelineEvent,
} from "../types/assignment-timeline.types"

/** Pixels per hour on the horizontal axis. */
export const TIMELINE_PX_PER_HOUR = 48
export const TIMELINE_LANE_HEIGHT = 56
export const TIMELINE_LABEL_WIDTH = 160
export const TIMELINE_RULER_HEIGHT = 36
export const TIMELINE_CHIP_WIDTH = 120
export const TIMELINE_CHIP_HEIGHT = 36

export type TimelineExtent = {
  readonly minMs: number
  readonly maxMs: number
  readonly widthPx: number
}

export function eventAnchorIso(
  event: AssignmentTimelineEvent,
  clockMode: AssignmentTimelineClockMode
): string {
  return clockMode === "arrivedAt" ? event.arrivedAt : event.assignedAt
}

export function buildTimelineExtent(
  events: readonly AssignmentTimelineEvent[],
  clockMode: AssignmentTimelineClockMode,
  windowFromIso: string,
  windowToIso: string
): TimelineExtent {
  let minMs = new Date(windowFromIso).getTime()
  let maxMs = new Date(windowToIso).getTime()
  for (const event of events) {
    const ms = new Date(eventAnchorIso(event, clockMode)).getTime()
    if (!Number.isNaN(ms)) {
      minMs = Math.min(minMs, ms)
      maxMs = Math.max(maxMs, ms)
    }
  }
  if (!(maxMs > minMs)) {
    maxMs = minMs + 24 * 60 * 60 * 1000
  }
  const padMs = 60 * 60 * 1000
  minMs -= padMs
  maxMs += padMs
  const hours = (maxMs - minMs) / (60 * 60 * 1000)
  return {
    minMs,
    maxMs,
    widthPx: Math.max(Math.ceil(hours * TIMELINE_PX_PER_HOUR), 640),
  }
}

export function timeToOffsetPx(iso: string, extent: TimelineExtent): number {
  const ms = new Date(iso).getTime()
  if (Number.isNaN(ms)) {
    return 0
  }
  const ratio = (ms - extent.minMs) / (extent.maxMs - extent.minMs)
  return Math.max(0, Math.min(1, ratio)) * extent.widthPx
}

export function listVentorIds(events: readonly AssignmentTimelineEvent[]): string[] {
  const ids = new Set<string>()
  for (const event of events) {
    const id = event.ventorId.trim()
    if (id.length > 0) {
      ids.add(id)
    }
  }
  return Array.from(ids).sort((a, b) => a.localeCompare(b))
}

export function buildHourTicks(extent: TimelineExtent): readonly { ms: number; label: string }[] {
  const hourMs = 60 * 60 * 1000
  const startHour = Math.floor(extent.minMs / hourMs) * hourMs
  const ticks: { ms: number; label: string }[] = []
  for (let ms = startHour; ms <= extent.maxMs; ms += hourMs) {
    if (ms < extent.minMs) {
      continue
    }
    const date = new Date(ms)
    const label = date.toLocaleString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    ticks.push({ ms, label })
  }
  return ticks
}

export function formatEventLabel(event: AssignmentTimelineEvent): string {
  const name = `${event.customerName ?? ""} ${event.customerLastName ?? ""}`.trim()
  if (name.length > 0) {
    return name
  }
  return event.customerPhone?.trim() || event.customerId.slice(-6)
}
