import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import UserInterface from "../../app/models/user-interface"

export const selectImportCustomersState = (state: RootState) => state.importCustomers

export const selectPhysicalUsersForImport = createSelector(
  (state: RootState) => state.users.usersOriginal,
  (usersOriginal): UserInterface[] =>
    usersOriginal.filter((user) => user._id && user.physical === true),
)

export const selectDistributePreviewCounts = createSelector(
  selectImportCustomersState,
  (importState): { userId: string; count: number }[] => {
    const pool = importState.distributeUserIds
    const rowCount = importState.previewRows.length
    if (pool.length === 0 || rowCount === 0) {
      return pool.map((userId) => ({ userId, count: 0 }))
    }
    const counts = new Map<string, number>()
    for (const userId of pool) {
      counts.set(userId, 0)
    }
    for (let i = 0; i < rowCount; i += 1) {
      const userId = pool[i % pool.length]
      counts.set(userId, (counts.get(userId) ?? 0) + 1)
    }
    return pool.map((userId) => ({ userId, count: counts.get(userId) ?? 0 }))
  },
)
