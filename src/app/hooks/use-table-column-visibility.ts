import { useCallback, useMemo, useState } from "react"

export type TableColumnVisibility = Record<string, boolean>

export type UseTableColumnVisibilityParams = {
  readonly storageKey: string
  readonly defaultVisibility: TableColumnVisibility
  /** Column ids that must stay visible (ignored in toggle / always true). */
  readonly lockedIds?: readonly string[]
}

function readStoredVisibility(storageKey: string): TableColumnVisibility | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === null || raw === "") {
      return null
    }
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null
    }
    const result: TableColumnVisibility = {}
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      if (value === true || value === false) {
        result[key] = value
      }
    }
    return result
  } catch {
    return null
  }
}

function writeStoredVisibility(storageKey: string, visibility: TableColumnVisibility): void {
  localStorage.setItem(storageKey, JSON.stringify(visibility))
}

function mergeVisibility(
  defaults: TableColumnVisibility,
  stored: TableColumnVisibility | null,
  lockedIds: readonly string[]
): TableColumnVisibility {
  const next: TableColumnVisibility = { ...defaults }
  if (stored !== null) {
    for (const key of Object.keys(defaults)) {
      if (stored[key] === true || stored[key] === false) {
        next[key] = stored[key]
      }
    }
  }
  for (const lockedId of lockedIds) {
    next[lockedId] = true
  }
  return next
}

/**
 * Column show/hide prefs backed by localStorage. New default keys appear as visible when prefs upgrade.
 */
export function useTableColumnVisibility({
  storageKey,
  defaultVisibility,
  lockedIds = [],
}: UseTableColumnVisibilityParams): {
  visibility: TableColumnVisibility
  isVisible: (columnId: string) => boolean
  setColumnVisible: (columnId: string, visible: boolean) => void
  visibleCount: number
} {
  const [visibility, setVisibility] = useState<TableColumnVisibility>(() =>
    mergeVisibility(defaultVisibility, readStoredVisibility(storageKey), lockedIds)
  )

  const setColumnVisible = useCallback(
    (columnId: string, visible: boolean) => {
      if (lockedIds.includes(columnId)) {
        return
      }
      setVisibility((prev) => {
        const unlockedIds = Object.keys(prev).filter((id) => !lockedIds.includes(id))
        const currentlyVisible = unlockedIds.filter((id) => prev[id] !== false)
        if (!visible && currentlyVisible.length <= 1 && currentlyVisible.includes(columnId)) {
          return prev
        }
        const next = { ...prev, [columnId]: visible }
        for (const lockedId of lockedIds) {
          next[lockedId] = true
        }
        writeStoredVisibility(storageKey, next)
        return next
      })
    },
    [lockedIds, storageKey]
  )

  const isVisible = useCallback(
    (columnId: string): boolean => visibility[columnId] !== false,
    [visibility]
  )

  const visibleCount = useMemo(
    () => Object.keys(defaultVisibility).filter((id) => visibility[id] !== false).length,
    [defaultVisibility, visibility]
  )

  return { visibility, isVisible, setColumnVisible, visibleCount }
}
