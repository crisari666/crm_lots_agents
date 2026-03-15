import { Divider, Typography } from "@mui/material"
import CsvDropZone from "./components/csv-drop-zone"
import ImportUsersPreviewTable from "./components/import-users-preview-table"
import ImportUsersControls from "./components/import-users-controls"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import { useNavigate } from "react-router-dom"

export default function ImportUsersPage() {
  const navigate = useNavigate()
  const notAllowed = (allowed: boolean) => {
    if (!allowed) navigate("/dashboard")
  }

  return (
    <CheckUserAllowedComponent checkIfAdmin={false} onCheckPermission={notAllowed}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Importar usuarios desde CSV
      </Typography>
      <CsvDropZone />
      <ImportUsersControls />
      <ImportUsersPreviewTable />
      <Divider sx={{ marginBlock: 2 }} />
    </CheckUserAllowedComponent>
  )
}
