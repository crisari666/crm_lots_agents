import { OfficesUtlityData } from "../../features/download-payment/business-logic/download-payment-history.state";
import { MultiplePercentageType } from "../../features/download-payment/business-logic/download-payment.state";

export type CampaignInterface = {
    _id: string;
    name: string;
    user: string;
    users: string[];
    dateStart: string;
    dateEnd: string;
    date: string;
    enable: boolean;
    enableDatabase: boolean;
    createdAt: string;
    updatedAt: string;
    downloaded: boolean
    mainUtility: number
    partners: MultiplePercentageType
    platform: number
    negativeValue: number
    utilityLeads: number
    officesUtility: OfficesUtlityData
    __v: number;
}