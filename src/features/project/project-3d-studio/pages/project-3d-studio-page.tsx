import React from "react"
import { useParams } from "react-router-dom"
import StudioShellCP from "../components/studio-shell.cp"

export default function Project3dStudioPage() {
  const { projectId } = useParams<{ projectId: string }>()
  if (!projectId) {
    return null
  }
  return <StudioShellCP projectId={projectId} />
}
