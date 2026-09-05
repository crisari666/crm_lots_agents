export const WEBINAR_EVENT_TIMEZONE = "America/Bogota" as const

export type WebinarTemplatePreview = {
  readonly dayLabel: string
  readonly dateText: string
  readonly timeText: string
}

function capitalizeFirst(value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return trimmed
  }
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

function readPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes
): string {
  return parts.find((part) => part.type === type)?.value ?? ""
}

/** Formats an absolute instant into WhatsApp template preview (America/Bogota). */
export function formatWebinarTemplatePreview(
  scheduledAt: Date,
  timeZone: string = WEBINAR_EVENT_TIMEZONE
): WebinarTemplatePreview {
  if (Number.isNaN(scheduledAt.getTime())) {
    return { dayLabel: "", dateText: "", timeText: "" }
  }
  const dayParts = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    weekday: "long",
  }).formatToParts(scheduledAt)
  const dateParts = new Intl.DateTimeFormat("es-CO", {
    timeZone,
    day: "numeric",
    month: "long",
  }).formatToParts(scheduledAt)
  const timeParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(scheduledAt)
  const weekday = capitalizeFirst(readPart(dayParts, "weekday"))
  const day = readPart(dateParts, "day")
  const month = capitalizeFirst(readPart(dateParts, "month"))
  const hour = readPart(timeParts, "hour")
  const minute = readPart(timeParts, "minute")
  const dayPeriod = readPart(timeParts, "dayPeriod")
    .toLowerCase()
    .replace(/\./g, "")
  return {
    dayLabel: weekday,
    dateText: `${day} de ${month}`,
    timeText: `${hour}:${minute}${dayPeriod}`,
  }
}

/**
 * Converts datetime-local wall clock (interpreted as America/Bogota, UTC-5) to ISO UTC.
 * Colombia has no DST.
 */
export function bogotaDatetimeLocalToIso(value: string): string | undefined {
  if (value.trim() === "") {
    return undefined
  }
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim())
  if (match == null) {
    return undefined
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const utcMs = Date.UTC(year, month - 1, day, hour + 5, minute, 0, 0)
  return new Date(utcMs).toISOString()
}

/** Formats ISO instant as datetime-local string in America/Bogota. */
export function isoToBogotaDatetimeLocal(iso: string | null | undefined): string {
  if (iso == null || iso.trim() === "") {
    return ""
  }
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return ""
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: WEBINAR_EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const year = readPart(parts, "year")
  const month = readPart(parts, "month")
  const day = readPart(parts, "day")
  const hour = readPart(parts, "hour")
  const minute = readPart(parts, "minute")
  return `${year}-${month}-${day}T${hour}:${minute}`
}
