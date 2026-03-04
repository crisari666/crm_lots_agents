import { LeadChecksResumeDialogI } from "../../app/models/leads-checks-resume-row";

export interface LeadsAuditoryState {
  loading: boolean
  rows: LeadPendingChecksRow[],
  filterDate: {
    startDate: Date,
    endDate: Date
  },
  leadResumeDetail: LeadChecksResumeDialogI | null
}

export interface LeadPendingChecksRow {
  _id: {
    _id: string;
    name: string;
    lastName: string;
    level: number;
    office: string;
  };
  situations: Array<{
    total: number;
  }>;
  payments: Array<{
    _id: string;
    total: number;
  }>;
}