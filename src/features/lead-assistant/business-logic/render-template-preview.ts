import type {
  LeadTemplateBinding,
  LeadTemplateBindingSource,
  LeadTemplateRef,
  LeadTemplateRenderContext,
  LeadWhatsappTemplate,
} from "../types/lead-assistant.types"

const PLACEHOLDER_PATTERN = /\{\{\s*([A-Za-z0-9_]+)\s*\}\}/g
const EMPTY_VALUE = "-"
const DEFAULT_FIRST_NAME = "Cliente"

export function buildTemplateKey(name: string, language: string): string {
  return `${name}::${language}`
}

function resolveRawValue(binding: LeadTemplateBinding, context: LeadTemplateRenderContext): string {
  switch (binding.source) {
    case "customer_first_name":
      return context.firstName.trim() || DEFAULT_FIRST_NAME
    case "assistant_name":
      return context.assistantName
    case "business_name":
      return context.businessName
    case "project_title":
      return context.projectTitle.trim() || context.businessName
    case "static":
      return binding.staticValue ?? ""
  }
}

/** Mirrors the backend renderer: whitespace collapsed, empty values become `-`. */
export function resolveBindingValue(
  binding: LeadTemplateBinding,
  context: LeadTemplateRenderContext,
): string {
  const value = resolveRawValue(binding, context).replace(/\s+/g, " ").trim()
  return value.length > 0 ? value : EMPTY_VALUE
}

/** Renders the template body the way the customer would read it, using sample context values. */
export function renderTemplatePreview(
  template: LeadTemplateRef,
  context: LeadTemplateRenderContext,
): string {
  const values = new Map(
    template.bindings
      .filter((binding) => binding.component === "body")
      .map((binding) => [binding.variable, resolveBindingValue(binding, context)] as const),
  )
  return template.bodyText.replace(
    PLACEHOLDER_PATTERN,
    (match, variable: string) => values.get(variable) ?? match,
  )
}

function suggestSource(variableName: string): LeadTemplateBindingSource {
  const name = variableName.toLowerCase()
  if (/(assistant|asistente|agent)/.test(name)) {
    return "assistant_name"
  }
  if (/(business|empresa|negocio|company)/.test(name)) {
    return "business_name"
  }
  if (/(project|proyecto)/.test(name)) {
    return "project_title"
  }
  if (/(customer|client|cliente|nombre|name)/.test(name)) {
    return "customer_first_name"
  }
  return "static"
}

/** Starts a template reference with a best-guess binding per variable (unknown ones stay static/empty). */
export function buildTemplateRef(template: LeadWhatsappTemplate): LeadTemplateRef {
  return {
    name: template.name,
    language: template.language,
    bodyText: template.bodyText,
    bindings: template.variables.map((variable) => ({
      variable: variable.name,
      component: variable.component,
      format: variable.format,
      source: suggestSource(variable.name),
      ...(suggestSource(variable.name) === "static" ? { staticValue: "" } : {}),
    })),
  }
}

function isBindingEmpty(binding: LeadTemplateBinding | undefined): boolean {
  if (binding == null) {
    return true
  }
  return binding.source === "static" && (binding.staticValue ?? "").trim().length === 0
}

/** Variables of the template that have no usable value source yet. */
export function findUnmappedVariables(
  template: LeadWhatsappTemplate | undefined,
  ref: LeadTemplateRef,
): string[] {
  if (template == null) {
    return ref.bindings.filter((binding) => isBindingEmpty(binding)).map((binding) => binding.variable)
  }
  return template.variables
    .filter((variable) =>
      isBindingEmpty(
        ref.bindings.find(
          (binding) => binding.variable === variable.name && binding.component === variable.component,
        ),
      ),
    )
    .map((variable) => variable.name)
}

export function isTemplateRefComplete(ref: LeadTemplateRef | null | undefined): ref is LeadTemplateRef {
  return ref != null && ref.name.trim().length > 0 && ref.language.trim().length > 0
}

export function findApprovedTemplate(
  templates: readonly LeadWhatsappTemplate[],
  ref: Pick<LeadTemplateRef, "name" | "language">,
): LeadWhatsappTemplate | undefined {
  return templates.find(
    (template) => template.name === ref.name && template.language === ref.language,
  )
}

export type TemplateRefIssues = {
  readonly isMissing: boolean
  readonly isUnapproved: boolean
  readonly unmappedVariables: readonly string[]
}

/** Problems of a template reference against the approved list (unapproved is unknown until loaded). */
export function evaluateTemplateRefIssues(
  ref: LeadTemplateRef | null,
  approvedTemplates: readonly LeadWhatsappTemplate[] | null,
): TemplateRefIssues {
  if (!isTemplateRefComplete(ref)) {
    return { isMissing: true, isUnapproved: false, unmappedVariables: [] }
  }
  const approved = approvedTemplates == null ? undefined : findApprovedTemplate(approvedTemplates, ref)
  return {
    isMissing: false,
    isUnapproved: approvedTemplates != null && approved == null,
    unmappedVariables: findUnmappedVariables(approved, ref),
  }
}
