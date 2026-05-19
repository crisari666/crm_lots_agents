import UserInterface from '../../../app/models/user-interface'

function resolveOfficeId(office: UserInterface['office']): string {
  if (office == null) {
    return ''
  }
  if (typeof office === 'string') {
    return office
  }
  if (typeof office === 'object' && '_id' in office) {
    return String((office as { _id: string })._id)
  }
  return String(office)
}

/** Matches former GET users/leads/:officeId — commercial directors and leads for an office. */
export function filterLeadsForOffice(
  users: UserInterface[],
  officeId: string,
): UserInterface[] {
  return users.filter(
    (user) =>
      resolveOfficeId(user.office) === officeId &&
      (user.level === 2 || user.level === 3),
  )
}
