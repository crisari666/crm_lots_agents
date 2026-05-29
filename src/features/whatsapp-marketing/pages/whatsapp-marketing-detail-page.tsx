import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch } from "../../../app/hooks"
import WhatsappMarketingDetailCP from "../components/whatsapp-marketing-detail.cp"
import { clearWhatsappMarketingDetailAct } from "../slice/whatsapp-marketing.slice"

export default function WhatsappMarketingDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>()
  const dispatch = useAppDispatch()
  useEffect(() => {
    return () => {
      dispatch(clearWhatsappMarketingDetailAct())
    }
  }, [dispatch])
  if (campaignId == null) {
    return null
  }
  return <WhatsappMarketingDetailCP campaignId={campaignId} />
}
