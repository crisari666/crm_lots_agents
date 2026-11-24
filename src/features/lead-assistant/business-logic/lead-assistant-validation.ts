import type { LeadFaqCategory } from "../types/lead-assistant.types"

export const RECOVERY_MIN_OFFSET_HOURS = 1
export const RECOVERY_MAX_OFFSET_HOURS = 720

export type ValidationErrors<Field extends string> = Partial<Record<Field, string>>

export type FaqDraftFields = {
  readonly question: string
  readonly category: LeadFaqCategory | ""
  readonly defaultAnswer: string
  readonly projectAnswers: Readonly<Record<string, string>>
}

export type FaqField = "question" | "category" | "answer"

export type FaqValidationMessages = {
  readonly questionRequired: string
  readonly categoryRequired: string
  readonly answerRequired: string
}

export function validateFaqDraft(
  draft: FaqDraftFields,
  messages: FaqValidationMessages,
): ValidationErrors<FaqField> {
  const errors: ValidationErrors<FaqField> = {}
  if (draft.question.trim().length === 0) {
    errors.question = messages.questionRequired
  }
  if (draft.category === "") {
    errors.category = messages.categoryRequired
  }
  const hasProjectAnswer = Object.values(draft.projectAnswers).some(
    (answer) => answer.trim().length > 0,
  )
  if (draft.defaultAnswer.trim().length === 0 && !hasProjectAnswer) {
    errors.answer = messages.answerRequired
  }
  return errors
}

export type IdentityDraftFields = {
  readonly assistantName: string
  readonly businessName: string
  readonly greeting: string
}

export type IdentityField = "assistantName" | "businessName" | "greeting"

export type IdentityValidationMessages = {
  readonly assistantNameRequired: string
  readonly businessNameRequired: string
  readonly greetingRequired: string
}

export function validateIdentityDraft(
  draft: IdentityDraftFields,
  messages: IdentityValidationMessages,
): ValidationErrors<IdentityField> {
  const errors: ValidationErrors<IdentityField> = {}
  if (draft.assistantName.trim().length === 0) {
    errors.assistantName = messages.assistantNameRequired
  }
  if (draft.businessName.trim().length === 0) {
    errors.businessName = messages.businessNameRequired
  }
  if (draft.greeting.trim().length === 0) {
    errors.greeting = messages.greetingRequired
  }
  return errors
}

export type RecoveryStepFields = {
  readonly label: string
  readonly offsetHours: number
}

export type RecoveryStepField = "label" | "offset"

export type RecoveryValidationMessages = {
  readonly labelRequired: string
  readonly offsetInvalid: string
}

export function validateRecoveryStep(
  step: RecoveryStepFields,
  messages: RecoveryValidationMessages,
): ValidationErrors<RecoveryStepField> {
  const errors: ValidationErrors<RecoveryStepField> = {}
  if (step.label.trim().length === 0) {
    errors.label = messages.labelRequired
  }
  const isValidOffset =
    Number.isInteger(step.offsetHours) &&
    step.offsetHours >= RECOVERY_MIN_OFFSET_HOURS &&
    step.offsetHours <= RECOVERY_MAX_OFFSET_HOURS
  if (!isValidOffset) {
    errors.offset = messages.offsetInvalid
  }
  return errors
}

/** The backend rejects two steps with the same offset. */
export function hasOffsetConflict(
  steps: readonly { readonly key: string; readonly offsetHours: number }[],
  candidate: { readonly key: string; readonly offsetHours: number },
): boolean {
  return steps.some(
    (step) => step.key !== candidate.key && step.offsetHours === candidate.offsetHours,
  )
}
