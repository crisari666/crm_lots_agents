export function formatSectionSummary(template: string, count: number): string {
  return template.replace("{count}", String(count))
}
