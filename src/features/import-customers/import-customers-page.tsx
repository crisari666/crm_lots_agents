import { Divider, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import ImportCustomersCsvDropZone from "./components/csv-drop-zone"
import ImportCustomersControls from "./components/import-customers-controls"
import ImportCustomersPreviewTable from "./components/import-customers-preview-table"
import { importCustomersStrings as s } from "../../i18n/locales/import-customers.strings"

export default function ImportCustomersPage() {
  const navigate = useNavigate()
  const notAllowed = (allowed: boolean) => {
    if (!allowed) {
      navigate("/dashboard")
    }
  }

  return (
    <CheckUserAllowedComponent checkIfAdmin={false} onCheckPermission={notAllowed}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {s.pageTitle}
      </Typography>
      <ImportCustomersCsvDropZone />
      <ImportCustomersControls />
      <ImportCustomersPreviewTable />
      <Divider sx={{ marginBlock: 2 }} />
    </CheckUserAllowedComponent>
  )
}
