import type { ProjectType } from "../types/project.types"

export type AudienceChannel = "la-ceiba" | "external"

/**
 * Resolves La Ceiba visibility. Legacy docs without `laCeibaDistribution` are La Ceiba
 * unless they were marked external-only (`externalDistribution: true`).
 */
export function isLaCeibaDistribution(project: ProjectType): boolean {
  if (project.laCeibaDistribution !== undefined) {
    return project.laCeibaDistribution === true
  }
  return project.externalDistribution !== true
}

export function isExternalDistribution(project: ProjectType): boolean {
  return project.externalDistribution === true
}

export function audienceChannelsFromProject(project: ProjectType): AudienceChannel[] {
  const channels: AudienceChannel[] = []
  if (isLaCeibaDistribution(project)) channels.push("la-ceiba")
  if (isExternalDistribution(project)) channels.push("external")
  return channels.length > 0 ? channels : ["la-ceiba"]
}
