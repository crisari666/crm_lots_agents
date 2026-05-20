/** Aligns with customers-ms `normalizeCustomerPhone` for result merge keys. */
export function normalizeImportPhone(value: string): string {
  return value.trim().replace(/[+\s]+/g, '')
}
