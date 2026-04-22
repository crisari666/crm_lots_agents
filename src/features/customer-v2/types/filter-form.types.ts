import type { Moment } from "moment"

export type FilterFormState = {
  /** When true, date range is not sent (`omitDateRange`); dates pickers disabled. */
  excludeFecha: boolean
  /** When true and no assignee selected, API returns only customers without `assignedTo`. */
  unassignedOnly: boolean
  /** When true, API filters `enabled !== false` (active customers). */
  enabledOnly: boolean
  createdFrom: Moment | null
  createdTo: Moment | null
  assignedTo: string
  search: string
  /** Empty = all steps; otherwise Mongo id of catalog step. */
  customerStepId: string
}

export function emptyFilters(): FilterFormState {
  return {
    excludeFecha: true,
    unassignedOnly: true,
    enabledOnly: false,
    createdFrom: null,
    createdTo: null,
    assignedTo: "",
    search: "",
    customerStepId: "",
  }
}
