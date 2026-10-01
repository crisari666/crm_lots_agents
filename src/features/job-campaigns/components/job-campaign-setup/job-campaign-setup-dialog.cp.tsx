import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material"
import { jobCampaignStrings as s } from "../../../../i18n/locales/job-campaigns.strings"
import type { JobCampaignAdminItem } from "../../types/job-campaign.types"
import {
  JOB_CAMPAIGN_SETUP_STEPS,
  toSetupSubmitPayload,
} from "./job-campaign-setup-form.util"
import type {
  JobCampaignSetupStepId,
  JobCampaignSetupStepProps,
  SetupSubmitPayload,
} from "./job-campaign-setup.types"
import { SetupAgentsStepCp } from "./setup-agents-step.cp"
import { SetupCaptureFieldsStepCp } from "./setup-capture-fields-step.cp"
import { SetupGeneralStepCp } from "./setup-general-step.cp"
import { SetupMeetStepCp } from "./setup-meet-step.cp"
import { SetupScreeningStepCp } from "./setup-screening-step.cp"
import { useJobCampaignSetupForm } from "./use-job-campaign-setup-form"

type Props = {
  readonly open: boolean
  readonly mode: "create" | "edit"
  readonly campaign: JobCampaignAdminItem | null
  /** Newest campaign used to seed template fields on create. */
  readonly lastCampaign: JobCampaignAdminItem | null
  readonly saving: boolean
  readonly onClose: () => void
  readonly onSubmitCreate: (
    input: SetupSubmitPayload & { readonly activate: boolean },
  ) => void
  readonly onSubmitUpdate: (input: SetupSubmitPayload) => void
}

/**
 * Campaign setup split into a non-linear stepper: every section is reachable from the step
 * header, so editing a single section does not require walking the whole form.
 */
export function JobCampaignSetupDialogCp(props: Props) {
  const setup = useJobCampaignSetupForm(props)
  const step = JOB_CAMPAIGN_SETUP_STEPS[setup.activeStep]
  const stepProps: JobCampaignSetupStepProps = {
    form: setup.form,
    errors: setup.visibleErrors,
    onChange: setup.updateForm,
  }
  const handleSubmit = (): void => {
    if (!setup.revealErrors()) return
    const payload = toSetupSubmitPayload(setup.form)
    if (props.mode === "create") {
      props.onSubmitCreate({ ...payload, activate: setup.form.activate })
      return
    }
    props.onSubmitUpdate(payload)
  }
  const renderStep = (id: JobCampaignSetupStepId) => {
    if (id === "general") {
      return <SetupGeneralStepCp {...stepProps} showActivate={props.mode === "create"} />
    }
    if (id === "agents") return <SetupAgentsStepCp {...stepProps} />
    if (id === "screening") return <SetupScreeningStepCp {...stepProps} />
    if (id === "captureFields") return <SetupCaptureFieldsStepCp {...stepProps} />
    return (
      <SetupMeetStepCp
        {...stepProps}
        googleMeetUrl={props.mode === "edit" ? props.campaign?.googleMeetUrl ?? "" : ""}
        hasSavedMeetDate={props.mode === "edit" && props.campaign?.meetScheduledAt != null}
      />
    )
  }
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>
        {props.mode === "create" ? s.newCampaign : s.setupTitle}
      </DialogTitle>
      <Box sx={{ px: 3, pb: 2 }}>
        <Stepper nonLinear activeStep={setup.activeStep}>
          {JOB_CAMPAIGN_SETUP_STEPS.map((item, index) => (
            <Step key={item.id}>
              <StepButton onClick={() => setup.goToStep(index)}>
                <StepLabel
                  error={setup.isStepFlagged(index)}
                  optional={
                    setup.isStepFlagged(index) ? (
                      <Typography variant="caption" color="error">
                        {s.stepInvalid}
                      </Typography>
                    ) : undefined
                  }
                  sx={{
                    "& .MuiStepLabel-label": {
                      display: { xs: index === setup.activeStep ? "block" : "none", sm: "block" },
                    },
                  }}
                >
                  {item.label}
                </StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>
      </Box>
      <DialogContent dividers sx={{ minHeight: { sm: 440 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {step.hint}
        </Typography>
        {renderStep(step.id)}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={props.onClose} sx={{ mr: "auto" }}>
          {s.cancel}
        </Button>
        <Button
          disabled={setup.activeStep === 0}
          onClick={() => setup.goToStep(setup.activeStep - 1)}
        >
          {s.back}
        </Button>
        {setup.isLastStep ? null : (
          <Button variant="outlined" onClick={() => setup.goToStep(setup.activeStep + 1)}>
            {s.next}
          </Button>
        )}
        <Button
          variant={setup.isLastStep || props.mode === "edit" ? "contained" : "text"}
          disabled={props.saving}
          onClick={handleSubmit}
        >
          {props.mode === "create" ? s.create : s.save}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
