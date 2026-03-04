import { OfficeCampaignInterface } from "./office-campaign.interface"
import { OfficeLevelType } from "./office-level.type"

export interface OfficeLeadsWithUsers {
  name: string
  _id: string
  leads: OfficeLeadI[]
  enable: boolean
}

export interface OfficeLeadI {
  name: string
  lastName: string
  email: string
  users: LeadUsersI[]
  officeCampaign: OfficeCampaignInterface[]
  _id: string
}

export interface LeadUsersI {
  _id: string
  name: string
  lastName: string
  email: string
  rank: OfficeLevelType
}

export interface OfficeLeadCampaignI {

}