export function resolveCallAuditUserLabel(
  userId: string,
  users: { _id?: string; name?: string; lastName?: string }[]
): string {
  const user = users.find((u) => u._id === userId)
  if (user === undefined) {
    return userId
  }
  return [user.name, user.lastName].filter(Boolean).join(" ").trim() || userId
}
