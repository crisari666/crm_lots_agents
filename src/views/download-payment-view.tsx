import DonwloadPaymentControls from "../features/download-payment/components/download-payment-controls";
import DownloadPaymentForm from "../features/download-payment/components/download-payment-form";
import DownloadPaymentRoute from "../features/download-payment/components/download-payment-route";
import PickPercentageForDownloadPaymentDialog from "../features/download-payment/components/payment-route/pick-percentage-for-download-payment";
import SearchPaymentForDownloadDialog from "../features/download-payment/components/search-payment-for-download-dialog";

export default function DownloadPaymentView() {
  return (
    <> 
      <SearchPaymentForDownloadDialog/>
      <PickPercentageForDownloadPaymentDialog/>
      <DonwloadPaymentControls/>
      <DownloadPaymentForm/>
      <DownloadPaymentRoute/>
    </>
  )
}