export const RECOVERY_WINDOW_CLOSE_HOURS = 24
export const RECOVERY_MIN_AXIS_HOURS = 168
const AXIS_PADDING_RATIO = 1.08
const HOURS_PER_DAY = 24
const CROWDING_THRESHOLD_PERCENT = 7

export type RecoveryAxisInput = {
  readonly key: string
  readonly offsetHours: number
}

export type RecoveryAxisNode = {
  readonly key: string
  readonly offsetHours: number
  readonly leftPercent: number
  /** 0 = label above the axis, 1 = label below (avoids overlapping neighbours). */
  readonly row: 0 | 1
}

export type RecoveryAxisTick = {
  readonly hours: number
  readonly leftPercent: number
}

export type RecoveryAxisLayout = {
  readonly maxHours: number
  readonly nodes: readonly RecoveryAxisNode[]
  readonly ticks: readonly RecoveryAxisTick[]
  readonly windowCloseLeftPercent: number
}

function toPercent(hours: number, maxHours: number): number {
  return Math.min(100, Math.max(0, (hours / maxHours) * 100))
}

/** Steps ordered by offset (the sequence order is always derived from the offset). */
export function sortByOffset<T extends { readonly offsetHours: number }>(steps: readonly T[]): T[] {
  return [...steps].sort((first, second) => first.offsetHours - second.offsetHours)
}

function buildNodes(
  steps: readonly RecoveryAxisInput[],
  maxHours: number,
): RecoveryAxisNode[] {
  const ordered = sortByOffset(steps)
  const nodes: RecoveryAxisNode[] = []
  ordered.forEach((step, index) => {
    const leftPercent = toPercent(step.offsetHours, maxHours)
    const previous = nodes[index - 1]
    const isCrowded =
      previous != null && leftPercent - previous.leftPercent < CROWDING_THRESHOLD_PERCENT
    nodes.push({
      key: step.key,
      offsetHours: step.offsetHours,
      leftPercent,
      row: isCrowded && previous.row === 0 ? 1 : 0,
    })
  })
  return nodes
}

function buildTicks(maxHours: number): RecoveryAxisTick[] {
  const totalDays = Math.floor(maxHours / HOURS_PER_DAY)
  const dayStep = totalDays > 14 ? 7 : totalDays > 8 ? 2 : 1
  const ticks: RecoveryAxisTick[] = []
  for (let day = 0; day <= totalDays; day += dayStep) {
    ticks.push({ hours: day * HOURS_PER_DAY, leftPercent: toPercent(day * HOURS_PER_DAY, maxHours) })
  }
  return ticks
}

/** Positions the recovery steps on a horizontal day axis with the 24h window-close marker. */
export function layoutRecoveryAxis(steps: readonly RecoveryAxisInput[]): RecoveryAxisLayout {
  const lastOffset = steps.reduce((max, step) => Math.max(max, step.offsetHours), 0)
  const maxHours = Math.max(RECOVERY_MIN_AXIS_HOURS, Math.ceil(lastOffset * AXIS_PADDING_RATIO))
  return {
    maxHours,
    nodes: buildNodes(steps, maxHours),
    ticks: buildTicks(maxHours),
    windowCloseLeftPercent: toPercent(RECOVERY_WINDOW_CLOSE_HOURS, maxHours),
  }
}

export type OffsetParts = {
  readonly days: number
  readonly hours: number
}

export function splitOffsetHours(offsetHours: number): OffsetParts {
  return {
    days: Math.floor(offsetHours / HOURS_PER_DAY),
    hours: offsetHours % HOURS_PER_DAY,
  }
}

/** "48 h" below one day or when not a whole number of days, otherwise "2 días". */
export function formatOffsetHours(offsetHours: number): string {
  const { days, hours } = splitOffsetHours(offsetHours)
  if (days === 0) {
    return `${hours} h`
  }
  if (hours === 0) {
    return days === 1 ? "1 día" : `${days} días`
  }
  return `${days} d ${hours} h`
}

export const HOURS_IN_DAY = HOURS_PER_DAY
