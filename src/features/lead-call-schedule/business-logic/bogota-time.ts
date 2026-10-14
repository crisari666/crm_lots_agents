const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000
const DAY_MS = 24 * 60 * 60 * 1000
const DAYS_PER_WEEK = 7
const MINUTES_PER_HOUR = 60
export const BOGOTA_TIME_ZONE = "America/Bogota"

/** Bogota has no DST: shifting by -5h and reading UTC fields yields its wall clock. */
const toBogotaWallClock = (date: Date): Date => new Date(date.getTime() + BOGOTA_OFFSET_MS)

const toDayKey = (wallClock: Date): string => wallClock.toISOString().slice(0, 10)

const parseDayKey = (dayKey: string): Date => new Date(`${dayKey}T00:00:00.000Z`)

export const getBogotaDayKey = (date: Date): string => toDayKey(toBogotaWallClock(date))

export const getBogotaMinuteOfDay = (date: Date): number => {
  const wallClock = toBogotaWallClock(date)
  return wallClock.getUTCHours() * MINUTES_PER_HOUR + wallClock.getUTCMinutes()
}

export const addDaysToKey = (dayKey: string, days: number): string =>
  toDayKey(new Date(parseDayKey(dayKey).getTime() + days * DAY_MS))

/** Monday of the week containing `dayKey`. */
export const getWeekStartKey = (dayKey: string): string => {
  const weekday = parseDayKey(dayKey).getUTCDay()
  const daysSinceMonday = (weekday + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK
  return addDaysToKey(dayKey, -daysSinceMonday)
}

export const buildWeekDayKeys = (weekStartKey: string): string[] =>
  Array.from({ length: DAYS_PER_WEEK }, (_unused, index) => addDaysToKey(weekStartKey, index))

const dayKeyFormatter = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-CO", { ...options, timeZone: "UTC" })

const weekdayShortFormatter = dayKeyFormatter({ weekday: "short" })
const dayMonthFormatter = dayKeyFormatter({ day: "numeric", month: "short" })
const longDayFormatter = dayKeyFormatter({ weekday: "long", day: "numeric", month: "long" })

export const formatWeekdayShort = (dayKey: string): string => weekdayShortFormatter.format(parseDayKey(dayKey))

export const formatDayMonth = (dayKey: string): string => dayMonthFormatter.format(parseDayKey(dayKey))

export const formatLongDay = (dayKey: string): string => longDayFormatter.format(parseDayKey(dayKey))

const dateTimeFormatter = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
  timeZone: BOGOTA_TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat("es-CO", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: BOGOTA_TIME_ZONE,
})

export const formatCallDateTime = (iso: string): string => dateTimeFormatter.format(new Date(iso))

export const formatCallTime = (iso: string): string => timeFormatter.format(new Date(iso))

export const formatMinuteOfDay = (minuteOfDay: number): string => {
  const hours = Math.floor(minuteOfDay / MINUTES_PER_HOUR)
  const minutes = minuteOfDay % MINUTES_PER_HOUR
  const suffix = hours < 12 ? "a. m." : "p. m."
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`
}
