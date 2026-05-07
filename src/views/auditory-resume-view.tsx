import AuditLegacyCallActionsDialog from "../features/auditory-resume/components/audit-legacy-call-actions-dialog";
import AuditLegacyCustomerResumeDialog from "../features/auditory-resume/components/audit-legacy-customer-resume-dialog";
import AuditResumeFilter from "../features/auditory-resume/components/audit-filter.cp";
import AuditResumeTable from "../features/auditory-resume/components/audit-resume-table";
import AuditUserResumeDialog from "../features/auditory-resume/components/audit-user-resume-dialog";

export default function AuditResumeView() {
  return (
    <div>
      <h1>Auditory Resume</h1>
      <AuditResumeFilter />
      <AuditResumeTable />
      <AuditLegacyCallActionsDialog />
      <AuditUserResumeDialog />
      <AuditLegacyCustomerResumeDialog />
    </div>
  );
} 