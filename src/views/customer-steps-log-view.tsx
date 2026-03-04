import CustomerStepsLogForm from "../features/customer-steps-log/components/customer-steps-log-form";
import CustomerStepsResultForm from "../features/customer-steps-log/components/customer-steps-result-form";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";

export default function CustomerStepsLogView() {
  return (
    <>
      <h1>Customer step</h1>
      <CustomerResumeDialog />
      <CustomerStepsLogForm />
      <CustomerStepsResultForm/>
    </>
  )
}