const OBJECT_ID_HEX_PATTERN = /^[a-f0-9]{24}$/i

export function isMarkableContractId(id: string): boolean {
  if (id.startsWith("group:")) {
    return false
  }
  return OBJECT_ID_HEX_PATTERN.test(id)
}
