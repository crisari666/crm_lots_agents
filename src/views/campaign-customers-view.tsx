import CampaignCustomersControls from "../features/campaigns/campaign-customers/components/campaign-customers-controls"
import CustomersCampaignList from "../features/campaigns/campaign-customers/components/customers-campaign-list"
import ModalAddCustomers from "../features/campaigns/campaign-customers/components/modal-add-customer"
import RecycleCustomersDialog from "../features/campaigns/campaign-customers/components/recycled-customers-modal"

export default function CampaignCustomersView() {
  return (
    <>
     <CampaignCustomersControls />
      <CustomersCampaignList />
      <ModalAddCustomers />
      <RecycleCustomersDialog />
    </>
  )
}