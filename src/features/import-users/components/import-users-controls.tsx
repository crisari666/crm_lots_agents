import { useState } from "react"
import { Button, Paper } from "@mui/material"
import CloudUpload from "@mui/icons-material/CloudUpload"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { UserImportFirstStepType } from "../../../app/services/users.service"
import { importUsersThunk, clearPreviewAct } from "../import-users.slice"
import LoadingIndicator from "../../../app/components/loading-indicator"
import ImportUsersFirstStepSelect from "./import-users-first-step-select"

export default function ImportUsersControls() {
  const dispatch = useAppDispatch()
  const { previewRows, loading } = useAppSelector((state: RootState) => state.importUsers)
  const [importFirstStep, setImportFirstStep] = useState<UserImportFirstStepType | "">("")

  const canImport =
    importFirstStep !== "" &&
    previewRows.length > 0 &&
    previewRows.every((r) => r.name?.trim() && r.email?.trim())

  const handleImport = () => {
    if (importFirstStep === "") return

    const users = previewRows.map(({ name, lastName, phone, email }) => ({
      name: name.trim(),
      lastName: (lastName ?? "").trim(),
      phone: (phone ?? "").trim(),
      email: email.trim()
    }))
    dispatch(importUsersThunk({ users, importFirstStep }))
  }

  const handleClear = () => {
    dispatch(clearPreviewAct())
    setImportFirstStep("")
  }

  if (previewRows.length === 0) return null

  return (
    <>
      <LoadingIndicator open={loading} />
      <Paper sx={{ p: 2, mt: 2 }} elevation={2}>
        <ImportUsersFirstStepSelect
          value={importFirstStep}
          onChange={setImportFirstStep}
          disabled={loading}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          disabled={!canImport || loading}
          onClick={handleImport}
          sx={{ mr: 1 }}
        >
          Importar usuarios
        </Button>
        <Button variant="outlined" disabled={loading} onClick={handleClear}>
          Limpiar
        </Button>
      </Paper>
    </>
  )
}
