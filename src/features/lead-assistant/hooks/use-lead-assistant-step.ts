import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"
import { parseLeadAssistantStep } from "../business-logic/lead-assistant-steps"
import type { LeadAssistantStepKey } from "../types/lead-assistant.types"

export type LeadAssistantStepControls = {
  readonly step: LeadAssistantStepKey
  readonly setStep: (step: LeadAssistantStepKey) => void
}

/** Active setup step, deep-linked through `?step=`. */
export function useLeadAssistantStep(): LeadAssistantStepControls {
  const [searchParams, setSearchParams] = useSearchParams()
  const step = parseLeadAssistantStep(searchParams.get("step"))
  const setStep = useCallback(
    (next: LeadAssistantStepKey) => {
      setSearchParams(
        (previous) => {
          const params = new URLSearchParams(previous)
          params.set("step", next)
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )
  return { step, setStep }
}
