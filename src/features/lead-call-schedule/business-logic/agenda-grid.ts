import type { LeadCallItem, LeadCallPeriod } from "../types/lead-call-schedule.types"
import { getBogotaDayKey, getBogotaMinuteOfDay } from "./bogota-time"

const SLOT_MINUTES = 30
const MINUTES_PER_HOUR = 60

export type AgendaPeriodKey = LeadCallPeriod | "other"

export type AgendaPeriod = {
  key: AgendaPeriodKey
  slotMinutes: number[]
}

const PERIOD_WINDOWS: ReadonlyArray<{ key: LeadCallPeriod; startHour: number; endHour: number }> = [
  { key: "morning", startHour: 9, endHour: 12 },
  { key: "afternoon", startHour: 14, endHour: 17 },
  { key: "night", startHour: 18, endHour: 21 },
]

const buildSlotMinutes = (startHour: number, endHour: number): number[] => {
  const count = ((endHour - startHour) * MINUTES_PER_HOUR) / SLOT_MINUTES
  return Array.from({ length: count }, (_unused, index) => startHour * MINUTES_PER_HOUR + index * SLOT_MINUTES)
}

/** Morning / afternoon / night rows of 30-minute slots, matching the WhatsApp bot windows. */
export const AGENDA_PERIODS: AgendaPeriod[] = PERIOD_WINDOWS.map((window) => ({
  key: window.key,
  slotMinutes: buildSlotMinutes(window.startHour, window.endHour),
}))

const WINDOW_SLOT_MINUTES = new Set(AGENDA_PERIODS.flatMap((period) => period.slotMinutes))

export const OTHER_SLOT_MINUTE = -1

/** Cell key `YYYY-MM-DD|minuteOfDay`; calls outside the bot windows land in `OTHER_SLOT_MINUTE`. */
export const buildCellKey = (dayKey: string, slotMinute: number): string => `${dayKey}|${slotMinute}`

const resolveSlotMinute = (iso: string): number => {
  const minuteOfDay = getBogotaMinuteOfDay(new Date(iso))
  const slotMinute = minuteOfDay - (minuteOfDay % SLOT_MINUTES)
  return WINDOW_SLOT_MINUTES.has(slotMinute) ? slotMinute : OTHER_SLOT_MINUTE
}

export const groupCallsByCell = (items: LeadCallItem[]): Map<string, LeadCallItem[]> => {
  const cells = new Map<string, LeadCallItem[]>()
  const sorted = [...items].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))
  sorted.forEach((item) => {
    const key = buildCellKey(getBogotaDayKey(new Date(item.scheduledAt)), resolveSlotMinute(item.scheduledAt))
    cells.set(key, [...(cells.get(key) ?? []), item])
  })
  return cells
}

export const groupCallsByDay = (items: LeadCallItem[]): Map<string, LeadCallItem[]> => {
  const days = new Map<string, LeadCallItem[]>()
  const sorted = [...items].sort((left, right) => left.scheduledAt.localeCompare(right.scheduledAt))
  sorted.forEach((item) => {
    const key = getBogotaDayKey(new Date(item.scheduledAt))
    days.set(key, [...(days.get(key) ?? []), item])
  })
  return days
}
