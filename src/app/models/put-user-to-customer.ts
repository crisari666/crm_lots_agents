export type PutUserToCustomerInterface = {
  userId: string;
  customerId: string;
  leadId: string;
  office: string
  campaignId: string;
  officeCampaignId: string;
  projectId?: string;
}