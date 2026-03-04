import { useEffect } from "react";
import DonwloadPaysLogsControl from "../features/download-payment/components/downloaded-payments-history/donwload-pays-log-controls";
import { useAppDispatch } from "../app/hooks";
import { getCampaignsHistoryThunk } from "../features/download-payment/business-logic/download-payment-history.slice";
import DownloadedPaysLogs from "../features/download-payment/components/downloaded-payments-history/downloaded-pays-logs";
import PercentageUtility from "../features/download-payment/components/downloaded-payments-history/percentages-utility";
import DialogPartnersMain1 from "../features/download-payment/components/downloaded-payments-history/add-partnerpercentage-main1-dialog";
import PartnersMain1List from "../features/download-payment/components/downloaded-payments-history/partners-main1-list";
import UserResumeDownloadedPaysDialog from "../features/download-payment/components/downloaded-payments-history/users-resume-dialog";
import PlatformPercentages from "../features/download-payment/components/downloaded-payments-history/platform-percentage";
import DownloadPaysOfficesUtility from "../features/download-payment/components/downloaded-payments-history/download-pays-offices-utility";

export default function DownloadPayHistoryView() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getCampaignsHistoryThunk())
  }, [])

  
  return (
    <>
      <UserResumeDownloadedPaysDialog/>    
      <DonwloadPaysLogsControl />
      <DownloadedPaysLogs />  
      <DownloadPaysOfficesUtility />
      <PercentageUtility />
      <PartnersMain1List />
      <DialogPartnersMain1 />
      <PlatformPercentages />
    </>
  )
}