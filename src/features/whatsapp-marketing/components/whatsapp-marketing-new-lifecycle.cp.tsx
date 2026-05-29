import { useEffect } from "react"
import { useAppDispatch } from "../../../app/hooks"
import {
  fetchWhatsappMarketingNewStepsThunk,
  resetWhatsappMarketingNewWizardAct,
} from "../slice/whatsapp-marketing.slice"

/** Resets wizard form and server state when entering the new-campaign page. */
export default function WhatsappMarketingNewLifecycleCP() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(resetWhatsappMarketingNewWizardAct())
    void dispatch(fetchWhatsappMarketingNewStepsThunk())
  }, [dispatch])
  return null
}
