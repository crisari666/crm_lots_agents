import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import { leadAssistantStrings as s } from "../../../i18n/locales/lead-assistant.strings"
import type { LeadTemplateRenderContext } from "../types/lead-assistant.types"
import { useLeadAssistantProjects } from "./use-lead-assistant-projects"

/** Sample lead (Carolina) plus the first enabled project, with the draft identity. */
export function usePreviewContext(): LeadTemplateRenderContext {
  const draft = useAppSelector((state) => state.leadAssistant.settings.draft)
  const projects = useLeadAssistantProjects()
  const assistantName = draft?.assistantName ?? ""
  const businessName = draft?.businessName ?? ""
  const projectTitle = projects[0]?.title ?? ""
  return useMemo(
    () => ({ firstName: s.previewSampleName, assistantName, businessName, projectTitle }),
    [assistantName, businessName, projectTitle],
  )
}
