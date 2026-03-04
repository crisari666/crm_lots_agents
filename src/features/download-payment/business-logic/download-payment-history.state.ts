import { CampaignInterface } from "../../../app/models/campaign.interface"
import { DownloadedPaymentLogItemexportType } from "../../../app/models/download-payment-log-item.type"
import { GetCampaignListType } from "../../../app/models/get-campaign-list.type"
import { MultiplePercentageType, WorkerPaymentHistoryItem } from "./download-payment.state"
import { OfficeGoalsResumeType } from "./office-goals-resume.type";

export type DownloadedPaysLogsState = {
  loading: boolean
  campaignPicked: string
  campaignsHistory: GetCampaignListType[]
  paymentsLogs: DownloadedPaymentLogItemexportType[]
  totalUtility: number,
  currentCampaign?: CampaignInterface,
  totalExpenses: number,
  officeSearch: string,
  mainExpensesPercentage: MainPartnersExpensesPercentageType,
  calculateExpenses: boolean,
  main1Pays: number
  main2Pays: number
  partnersPercentage: PartnerPercentageFromMai1Type[]
  showModalAddPartner: boolean
  userSearch: string
  userSearchTotal: number,
  showResumeDialog: boolean,
  usersResume: UserResumeType,
  usersResumeFiltered: UserResumeType,
  getUserData: boolean,
  partners: MultiplePercentageType,
  campaignDownloaded: boolean,
  officesGoalsResume: OfficeGoalsResumeType[];
  totalCustomersCreated: number;
  workerPaymentsHistory: WorkerPaymentHistoryItem[];
  officesUtility: OfficesUtlityData;
}

export type OfficesUtlityData = {
  negativeValue: number;
  utilityLeads: number;
  officesUtility: any;
}

export type UserResumeType = {
  [userId: string] : {
    userId: string
    email: string
    office: string
    total: number
  }
}

export type MainPartnersExpensesPercentageType = {
  main1: number,
  main2: number,
  expensesMain1: number,
  expensesMain2: number,
  utilityLeastExpenses: number,
  main1leastExpenses: number,
  main2leastExpenses: number,
  platformPercentage: number,
  platformPercentageUtility: number,
  platformUtility: number,
  main1PlatformPercentage: number,
  main2PlatformPercentage: number,
  main1WithoutPlatform: number,
  main2WithoutPlatform: number,
  partnersExpense: number
  main1WithoutPartners: number
  platformValue: number
}

export type PartnerPercentageFromMai1Type = {
  percentage: number,
  value: number
  user: string
  userNick: string
}


