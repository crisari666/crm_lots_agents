import { Box } from "@mui/material"
import MetaLeadAdEditorPanelCP from "../components/meta-lead-ad-editor-panel.cp"
import MetaLeadAdsHeaderCP from "../components/meta-lead-ads-header.cp"
import MetaLeadAdsListCP from "../components/meta-lead-ads-list.cp"
import MetaLeadAdsUnregisteredCP from "../components/meta-lead-ads-unregistered.cp"
import MetaLeadFormEditorPanelCP from "../components/meta-lead-form-editor-panel.cp"
import MetaLeadFormsBootstrapCP from "../components/meta-lead-forms-bootstrap.cp"
import MetaLeadFormsHeaderCP from "../components/meta-lead-forms-header.cp"
import MetaLeadFormsListCP from "../components/meta-lead-forms-list.cp"
import MetaLeadFormsNoticeCP from "../components/meta-lead-forms-notice.cp"
import MetaLeadFormsSettingsCP from "../components/meta-lead-forms-settings.cp"
import MetaLeadFormsUnregisteredCP from "../components/meta-lead-forms-unregistered.cp"

export default function MetaLeadFormsPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 880 }}>
      <MetaLeadFormsBootstrapCP />
      <MetaLeadFormsHeaderCP />
      <MetaLeadFormsSettingsCP />
      <MetaLeadFormsListCP />
      <MetaLeadFormsUnregisteredCP />
      <MetaLeadAdsHeaderCP />
      <MetaLeadAdsListCP />
      <MetaLeadAdsUnregisteredCP />
      <MetaLeadFormEditorPanelCP />
      <MetaLeadAdEditorPanelCP />
      <MetaLeadFormsNoticeCP />
    </Box>
  )
}
