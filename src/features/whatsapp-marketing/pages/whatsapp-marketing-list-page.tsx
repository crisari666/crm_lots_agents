import { useEffect } from "react"
import { useAppDispatch } from "../../../app/hooks"
import WhatsappMarketingListCP from "../components/whatsapp-marketing-list.cp"
import { fetchWhatsappMarketingCampaignsThunk } from "../slice/whatsapp-marketing.slice"

export default function WhatsappMarketingListPage() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    void dispatch(fetchWhatsappMarketingCampaignsThunk())
  }, [dispatch])
  return <WhatsappMarketingListCP />
}
