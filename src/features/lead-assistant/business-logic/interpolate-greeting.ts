export const GREETING_VARIABLES = ["customerName", "businessName", "assistantName"] as const

export type GreetingVariable = (typeof GREETING_VARIABLES)[number]

export type GreetingValues = Readonly<Record<GreetingVariable, string>>

const GREETING_PATTERN = /\{\{\s*(customerName|businessName|assistantName)\s*\}\}/g

/** Replaces the greeting variables with sample values; empty values keep the placeholder visible. */
export function interpolateGreeting(greeting: string, values: GreetingValues): string {
  return greeting.replace(GREETING_PATTERN, (match, name: GreetingVariable) => {
    const value = values[name].trim()
    return value.length > 0 ? value : match
  })
}

export type InsertionResult = {
  readonly text: string
  readonly caret: number
}

/** Inserts `{{variable}}` at the current selection (replacing it) and returns the new caret. */
export function insertVariableAtSelection(
  text: string,
  variable: GreetingVariable,
  selectionStart: number | null,
  selectionEnd: number | null,
): InsertionResult {
  const token = `{{${variable}}}`
  const start = selectionStart ?? text.length
  const end = selectionEnd ?? start
  return {
    text: `${text.slice(0, start)}${token}${text.slice(end)}`,
    caret: start + token.length,
  }
}
