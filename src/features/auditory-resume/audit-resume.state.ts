import { CustomerCallActionsInterface } from "../../app/models/customer-call-actions.interface";
import { AuditResumeItem } from "../../app/models/audit-resume-item";
import { AuditUserResume } from "../../app/models/audit-user-resume-item";

export type AuditResumeState = {
  loading: boolean;
  auditResume: AuditResumeItem[];
  currentResumeDate: { startDate: string; endDate: string };
  auditFormFilter: AuditResumeFilter;
  auditUserResume?: AuditUserResume[];
  auditCustomerCallActions: CustomerCallActionsInterface[];
  auditCustomerResume: unknown | undefined;
};

export type AuditResumeFilter = {
  startDate: string
  endDate: string
  officeId: string
  userId: string
  excludeDate: boolean
  [key: string]: any
}

