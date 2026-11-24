import LeadAssistantBootstrapCP from "../components/shared/lead-assistant-bootstrap.cp"
import LeadAssistantLayoutCP from "../components/shared/lead-assistant-layout.cp"
import LeadAssistantNoticeCP from "../components/shared/lead-assistant-notice.cp"
import SimulatorDialogCP from "../components/simulator/simulator-dialog.cp"

/** Route shell: composition only (no Redux, no state). */
export default function LeadAssistantPage() {
  return (
    <>
      <LeadAssistantBootstrapCP />
      <LeadAssistantLayoutCP />
      <SimulatorDialogCP />
      <LeadAssistantNoticeCP />
    </>
  )
}
