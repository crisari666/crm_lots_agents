import { CampaignInterface } from "../../../app/models/campaign.interface"
import { LeadNumbersPreviewInterface } from "../../../app/models/lead-numbers-preview.interface"
import { LeadsWithUsers } from "../../../app/models/leads-users-customer.interface"
import { CustomerRowCSVI } from "../../../app/models/customer-row-csv"
import { OfficeCampaignInterface } from "../../../app/models/office-campaign.interface"
import UserInterface from "../../../app/models/user-interface"

export interface ImportNumbersState {
  loading: boolean
  successDataImported: boolean
  showDialogWithNumbersPreview: boolean
  leads: UserInterface[]
  recalculateData: boolean
  mapLeadUserId: {[leadId: string]: string}
  leadsId: {[user: string] : UserInterface}
  uploadedData: LeadNumbersPreviewInterface[]
  dataRow: CustomerRowCSVI[],
  leadUsersMap: {[leadId: string]: LeadsWithUsers}
  currentCampaign?: CampaignInterface
  officesCampaigns: OfficeCampaignInterface[]
  currentCampaignGot: boolean
}