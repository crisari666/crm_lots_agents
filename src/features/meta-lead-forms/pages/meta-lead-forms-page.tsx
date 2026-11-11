import { Box } from "@mui/material"
import MetaLeadAdEditorPanelCP from "../components/meta-lead-ad-editor-panel.cp"
import MetaLeadFormEditorPanelCP from "../components/meta-lead-form-editor-panel.cp"
import MetaLeadFormsBootstrapCP from "../components/meta-lead-forms-bootstrap.cp"
import MetaLeadFormsHeaderCP from "../components/meta-lead-forms-header.cp"
import MetaLeadFormsNoticeCP from "../components/meta-lead-forms-notice.cp"
import MetaLeadFormsTabsCP from "../components/meta-lead-forms-tabs.cp"

export default function MetaLeadFormsPage() {
  return (
    <Box sx={{ p: 3, maxWidth: 880 }}>
      <MetaLeadFormsBootstrapCP />
      <MetaLeadFormsHeaderCP />
      <MetaLeadFormsTabsCP />
      <MetaLeadFormEditorPanelCP />
      <MetaLeadAdEditorPanelCP />
      <MetaLeadFormsNoticeCP />
    </Box>
  )
}
