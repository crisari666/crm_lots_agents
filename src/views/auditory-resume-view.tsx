import AuditResumeFilter from "../features/auditory-resume/components/audit-filter.cp";
import AuditResumeTable from "../features/auditory-resume/components/audit-resume-table";
import AuditUserResumeDialog from "../features/auditory-resume/components/audit-user-resume-dialog";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";
import DialogCustomerCallActions from "../features/customers/customer-view/components/dialog-customer-call-actions";

export default function AuditResumeView() {
  return (
    <div>
      <h1>Auditory Resume</h1>
      <AuditResumeFilter />
      <AuditResumeTable />
      <DialogCustomerCallActions/>
      <AuditUserResumeDialog/>
      <CustomerResumeDialog/>
    </div>
  );
} 