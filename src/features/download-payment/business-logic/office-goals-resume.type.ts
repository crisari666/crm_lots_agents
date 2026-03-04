/**
 * Represents the resume of office goals and customers for a campaign office.
 */
export type OfficeGoalsResumeType = {
  _id: string;
  officeId: string;
  rent?: number;
  officeName: string;
  totalGoal: number;
  customersCreated: number;
}; 