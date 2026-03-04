import DialogStepForm from "../features/steps/components/dialog-step-form";
import StepsControl from "../features/steps/components/steps-controls";
import StepsList from "../features/steps/components/steps-list";

export default function StepsView() {
  return (
    <>
      <DialogStepForm/>
      <StepsControl />
      <StepsList />
    </>
  )
}