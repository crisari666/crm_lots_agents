import UserInterface from "../../app/models/user-interface"

export function officeFieldToId(office: UserInterface["office"]): string {
  if (office == null || office === "") return ""
  if (typeof office === "string") return office
  if (typeof office === "object" && office !== null && "_id" in office) {
    return String((office as { _id: string })._id)
  }
  return ""
}

export function leadFieldToId(lead: UserInterface["lead"]): string {
  if (lead == null || lead === "") return ""
  if (typeof lead === "string") return lead
  if (typeof lead === "object" && lead !== null && "_id" in lead) {
    return String((lead as { _id: string })._id)
  }
  return ""
}

export function subadminFieldToId(subadmin: UserInterface["subadmin"]): string {
  if (subadmin == null || subadmin === "") return ""
  if (typeof subadmin === "string") return subadmin
  if (typeof subadmin === "object" && subadmin !== null && "_id" in subadmin) {
    return String((subadmin as { _id: string })._id)
  }
  return ""
}
