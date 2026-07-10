import UserInterface from "../../../app/models/user-interface"
import { leadFieldToId, officeFieldToId } from "../../handle-user/user-field-ids"

export type CustomerListScopeInput = {
  currentUser: UserInterface | undefined
  officeId: string
  users: UserInterface[]
}

const ADMIN_OR_COORDINATOR_LEVELS = new Set([0, 1])
const LEAD_LEVEL = 3

function isAdminOrCoordinator(level: number | undefined): boolean {
  return level !== undefined && ADMIN_OR_COORDINATOR_LEVELS.has(level)
}

function isLeadLevel(level: number | undefined): boolean {
  return level === LEAD_LEVEL
}

function filterUsersInOffice(users: UserInterface[], officeId: string): UserInterface[] {
  if (officeId.trim() === "") {
    return users
  }
  return users.filter((user) => officeFieldToId(user.office) === officeId)
}

function filterUsersForLeadTeam(
  users: UserInterface[],
  currentUser: UserInterface,
): UserInterface[] {
  const leadId = currentUser._id ?? ""
  const officeId = officeFieldToId(currentUser.office)
  if (leadId === "" || officeId === "") {
    return []
  }
  return users.filter((user) => {
    if (!user._id) {
      return false
    }
    if (officeFieldToId(user.office) !== officeId) {
      return false
    }
    return leadFieldToId(user.lead) === leadId || user._id === leadId
  })
}

/**
 * Users shown in assignee/creator pickers for the customer list filters.
 */
export function filterUsersForCustomerListPickers(
  users: UserInterface[],
  input: CustomerListScopeInput,
): UserInterface[] {
  const level = input.currentUser?.level
  if (isLeadLevel(level) && input.currentUser) {
    return filterUsersForLeadTeam(users, input.currentUser)
  }
  if (isAdminOrCoordinator(level)) {
    return filterUsersInOffice(users, input.officeId)
  }
  return users
}

/**
 * Office/team user ids sent as `assignedToIn` when no single assignee is selected.
 */
export function resolveCustomerListScopeUserIds(
  input: CustomerListScopeInput,
): string[] {
  const level = input.currentUser?.level
  if (isLeadLevel(level) && input.currentUser) {
    return filterUsersForLeadTeam(input.users, input.currentUser)
      .map((user) => user._id)
      .filter((id): id is string => Boolean(id))
  }
  if (isAdminOrCoordinator(level) && input.officeId.trim() !== "") {
    return filterUsersInOffice(input.users, input.officeId)
      .map((user) => user._id)
      .filter((id): id is string => Boolean(id))
  }
  return []
}

export function shouldShowCustomerListOfficeFilter(
  currentUser: UserInterface | undefined,
): boolean {
  return isAdminOrCoordinator(currentUser?.level)
}
