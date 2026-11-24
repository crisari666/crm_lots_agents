import { useMemo } from "react"
import { useAppSelector } from "../../../app/hooks"
import type { LeadAssistantProject } from "../types/lead-assistant.types"

/** Enabled, non-deleted projects the assistant can talk about. */
export function useLeadAssistantProjects(): LeadAssistantProject[] {
  const projects = useAppSelector((state) => state.projects.projects)
  return useMemo(
    () =>
      projects
        .filter((project) => project.enabled !== false && project.deleted !== true)
        .map((project) => ({ id: project._id, title: project.title })),
    [projects],
  )
}
