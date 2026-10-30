import { Box } from "@mui/material"
import MetaLeadFormEditorPanelCP from "../components/meta-lead-form-editor-panel.cp"
import MetaLeadFormsBootstrapCP from "../components/meta-lead-forms-bootstrap.cp"
import MetaLeadFormsHeaderCP from "../components/meta-lead-forms-header.cp"
import MetaLeadFormsListCP from "../components/meta-lead-forms-list.cp"
import MetaLeadFormsNoticeCP from "../components/meta-lead-forms-notice.cp"
import MetaLeadFormsSettingsCP from "../components/meta-lead-forms-settings.cp"

export default function MetaLeadFormsPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 880 }}>
      <MetaLeadFormsBootstrapCP />
      <MetaLeadFormsHeaderCP />
      <MetaLeadFormsSettingsCP />
      <MetaLeadFormsListCP />
      <MetaLeadFormEditorPanelCP />
      <MetaLeadFormsNoticeCP />
    </Box>
  )
}
