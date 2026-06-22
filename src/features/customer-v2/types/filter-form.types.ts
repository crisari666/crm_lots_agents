import type { Moment } from "moment"

export type FilterFormState = {
  /** When true, date range is not sent (`omitDateRange`); dates pickers disabled. */
  excludeFecha: boolean
  /** When true and no assignee selected, API returns only customers without `assignedTo`. */
  unassignedOnly: boolean
  /** When true, API filters `enabled !== false` (active customers). */
  enabledOnly: boolean
  /** When true, API filters `isReferral === true` (referral customers only). */
  referralOnly: boolean
  createdFrom: Moment | null
  createdTo: Moment | null
  assignedTo: string
  /** Office user id who created the customer; empty = all creators. */
  createdBy: string
  search: string
  /** Empty = all steps; otherwise Mongo id of catalog step. */
  customerStepId: string
}

export function emptyFilters(): FilterFormState {
  return {
    excludeFecha: true,
    unassignedOnly: true,
    enabledOnly: false,
    referralOnly: false,
    createdFrom: null,
    createdTo: null,
    assignedTo: "",
    createdBy: "",
    search: "",
    customerStepId: "",
  }
}
