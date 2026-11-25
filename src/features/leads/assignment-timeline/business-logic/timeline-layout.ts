import type {
  AssignmentTimelineClockMode,
  AssignmentTimelineEvent,
} from "../types/assignment-timeline.types"

/** Width of one event time column on the discrete X-axis. */
export const TIMELINE_COLUMN_WIDTH = 140
export const TIMELINE_LANE_HEIGHT = 56
export const TIMELINE_LABEL_WIDTH = 160
export const TIMELINE_RULER_HEIGHT = 36
export const TIMELINE_CHIP_WIDTH = 120
export const TIMELINE_CHIP_HEIGHT = 36

const MINUTE_MS = 60 * 1000

export type TimelineEventColumn = {
  readonly ms: number
  readonly index: number
}

export type TimelineEventColumns = {
  readonly columns: readonly TimelineEventColumn[]
  readonly widthPx: number
}

export type TimelineTick = {
  readonly ms: number
  readonly label: string
  readonly leftPx: number
}

export function eventAnchorIso(
  event: AssignmentTimelineEvent,
  clockMode: AssignmentTimelineClockMode
): string {
  return clockMode === "arrivedAt" ? event.arrivedAt : event.assignedAt
}

function floorToMinuteMs(ms: number): number {
  return Math.floor(ms / MINUTE_MS) * MINUTE_MS
}

function formatTickLabel(ms: number): string {
  return new Date(ms).toLocaleString("es-CO", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * Builds evenly spaced columns from unique event anchor minutes (clock mode).
 * Empty time gaps are collapsed — only arrival/assignment times appear.
 */
export function buildEventColumns(
  events: readonly AssignmentTimelineEvent[],
  clockMode: AssignmentTimelineClockMode
): TimelineEventColumns {
  const uniqueMs = new Set<number>()
  for (const event of events) {
    const ms = new Date(eventAnchorIso(event, clockMode)).getTime()
    if (!Number.isNaN(ms)) {
      uniqueMs.add(floorToMinuteMs(ms))
    }
  }
  const sortedMs = Array.from(uniqueMs).sort((a, b) => a - b)
  const columns: TimelineEventColumn[] = sortedMs.map((ms, index) => ({ ms, index }))
  const widthPx = Math.max(columns.length * TIMELINE_COLUMN_WIDTH, TIMELINE_COLUMN_WIDTH)
  return { columns, widthPx }
}

export function eventColumnOffsetPx(iso: string, layout: TimelineEventColumns): number {
  const ms = new Date(iso).getTime()
  if (Number.isNaN(ms) || layout.columns.length === 0) {
    return TIMELINE_COLUMN_WIDTH / 2
  }
  const bucketMs = floorToMinuteMs(ms)
  const exact = layout.columns.find((column) => column.ms === bucketMs)
  if (exact) {
    return exact.index * TIMELINE_COLUMN_WIDTH + TIMELINE_COLUMN_WIDTH / 2
  }
  let nearest = layout.columns[0]
  let nearestDelta = Math.abs(nearest.ms - bucketMs)
  for (const column of layout.columns) {
    const delta = Math.abs(column.ms - bucketMs)
    if (delta < nearestDelta) {
      nearest = column
      nearestDelta = delta
    }
  }
  return nearest.index * TIMELINE_COLUMN_WIDTH + TIMELINE_COLUMN_WIDTH / 2
}

export function buildEventTicks(layout: TimelineEventColumns): readonly TimelineTick[] {
  return layout.columns.map((column) => ({
    ms: column.ms,
    label: formatTickLabel(column.ms),
    leftPx: column.index * TIMELINE_COLUMN_WIDTH + TIMELINE_COLUMN_WIDTH / 2,
  }))
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

export function formatEventLabel(event: AssignmentTimelineEvent): string {
  const name = `${event.customerName ?? ""} ${event.customerLastName ?? ""}`.trim()
  if (name.length > 0) {
    return name
  }
  return event.customerPhone?.trim() || event.customerId.slice(-6)
}
