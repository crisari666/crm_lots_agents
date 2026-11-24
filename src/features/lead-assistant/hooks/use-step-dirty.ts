import { useAppSelector } from "../../../app/hooks"
import { selectIsRecoveryDirty } from "../slice/lead-assistant-recovery.slice"
import {
  selectIsActivationDirty,
  selectIsIdentityDirty,
} from "../slice/lead-assistant-settings.slice"
import type { LeadAssistantStepKey } from "../types/lead-assistant.types"

export type StepDirtyMap = Readonly<Record<LeadAssistantStepKey, boolean>>

/** Which steps hold changes that are not saved yet. */
export function useStepDirtyMap(): StepDirtyMap {
  const identity = useAppSelector(selectIsIdentityDirty)
  const activation = useAppSelector(selectIsActivationDirty)
  const recovery = useAppSelector(selectIsRecoveryDirty)
  return { connection: false, identity, knowledge: false, recovery, activation }
}

export function useHasUnsavedChanges(): boolean {
  const map = useStepDirtyMap()
  return Object.values(map).some(Boolean)
}
