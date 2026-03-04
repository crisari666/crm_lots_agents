import CustomerCenterFilter from "../features/customers-center/components/customer-center-filter";
import CustomerCenterTableContent from "../features/customers-center/components/customer-center-table";
import DialogChangeCustomerUser from "../features/customers-center/components/dialog-change-customer-user";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";
import DialogCustomerStep from "../features/customers/customers-list/components/dialog-customer-step";

export default function CustomerCenterView() {
  return (
    <>
      <DialogCustomerStep />
      <CustomerResumeDialog />
      <CustomerCenterFilter/>
      <DialogChangeCustomerUser/>
      <CustomerCenterTableContent />
    </>
  )
}