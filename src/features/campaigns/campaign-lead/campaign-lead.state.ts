import { CampaignInterface } from "../../../app/models/campaign.interface";
import { OfficeCampaignInterface } from "../../../app/models/office-campaign.interface";
import UserInterface from "../../../app/models/user-interface";

export interface CampaignLeadState {
  campaign?: CampaignInterface
  officeCampaign?: OfficeCampaignInterface
  loading: boolean
  campaigGot: boolean
  usersChose: string[]
  userChoseDatabase: string[]
  officeUsers: UserInterface[]
  showAlertSureSaveCampaign: boolean
  showAlertSureSaveCampaignDatabase: boolean
}