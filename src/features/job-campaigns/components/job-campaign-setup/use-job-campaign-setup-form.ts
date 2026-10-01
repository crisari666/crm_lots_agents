import { useEffect, useMemo, useState } from "react"
import type { JobCampaignAdminItem } from "../../types/job-campaign.types"
import {
  JOB_CAMPAIGN_SETUP_STEPS,
  buildInitialSetupForm,
  isStepInvalid,
  validateSetupForm,
} from "./job-campaign-setup-form.util"
import type {
  JobCampaignSetupErrors,
  JobCampaignSetupForm,
  JobCampaignSetupFormPatch,
} from "./job-campaign-setup.types"

type UseJobCampaignSetupFormInput = {
  readonly open: boolean
  readonly mode: "create" | "edit"
  readonly campaign: JobCampaignAdminItem | null
  readonly lastCampaign: JobCampaignAdminItem | null
}

type UseJobCampaignSetupFormResult = {
  readonly form: JobCampaignSetupForm
  readonly activeStep: number
  readonly isLastStep: boolean
  readonly visibleErrors: JobCampaignSetupErrors
  readonly hasErrors: boolean
  readonly isStepFlagged: (index: number) => boolean
  readonly updateForm: (patch: JobCampaignSetupFormPatch) => void
  readonly goToStep: (index: number) => void
  /** Reveals every error and jumps to the first invalid step; returns true when the form is valid. */
  readonly revealErrors: () => boolean
}

/**
 * Local draft state for the campaign setup stepper. Errors of a step become visible once the
 * user leaves it or tries to submit.
 */
export function useJobCampaignSetupForm(
  input: UseJobCampaignSetupFormInput,
): UseJobCampaignSetupFormResult {
  const [form, setForm] = useState<JobCampaignSetupForm>(() =>
    buildInitialSetupForm(input),
  )
  const [activeStep, setActiveStep] = useState(0)
  const [leftSteps, setLeftSteps] = useState<ReadonlySet<number>>(new Set())
  useEffect(() => {
    if (!input.open) return
    setForm(buildInitialSetupForm(input))
    setActiveStep(0)
    setLeftSteps(new Set())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.open, input.mode, input.campaign, input.lastCampaign])
  const errors = useMemo(() => validateSetupForm(form), [form])
  const isStepFlagged = (index: number): boolean =>
    leftSteps.has(index) && isStepInvalid(JOB_CAMPAIGN_SETUP_STEPS[index].id, errors)
  const visibleErrors = useMemo<JobCampaignSetupErrors>(() => {
    const visibleFields = JOB_CAMPAIGN_SETUP_STEPS.filter((_, index) =>
      leftSteps.has(index),
    ).flatMap((step) => step.fields)
    return Object.fromEntries(
      visibleFields
        .filter((field) => errors[field] != null)
        .map((field) => [field, errors[field]]),
    )
  }, [errors, leftSteps])
  const goToStep = (index: number): void => {
    setLeftSteps((prev) => new Set(prev).add(activeStep))
    setActiveStep(index)
  }
  const revealErrors = (): boolean => {
    setLeftSteps(new Set(JOB_CAMPAIGN_SETUP_STEPS.map((_, index) => index)))
    const firstInvalid = JOB_CAMPAIGN_SETUP_STEPS.findIndex((step) =>
      isStepInvalid(step.id, errors),
    )
    if (firstInvalid >= 0) setActiveStep(firstInvalid)
    return firstInvalid < 0
  }
  return {
    form,
    activeStep,
    isLastStep: activeStep === JOB_CAMPAIGN_SETUP_STEPS.length - 1,
    visibleErrors,
    hasErrors: Object.keys(errors).length > 0,
    isStepFlagged,
    updateForm: (patch) => setForm((prev) => ({ ...prev, ...patch })),
    goToStep,
    revealErrors,
  }
}
