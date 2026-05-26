import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Box, Button, Typography } from "@mui/material"
import { CheckUserAllowedComponent } from "../../../app/components/check-user-allowed-component"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import LeadCandidatesFiltersCp from "../components/lead-candidates-filters.cp"
import LeadCandidatesTableCp from "../components/lead-candidates-table.cp"
import LeadCandidatesAddDialogCp from "../components/lead-candidates-add-dialog.cp"
import LeadCandidatesDetailDialogCp from "../components/lead-candidates-detail-dialog.cp"
import {
  clearLeadCandidatesErrorAct,
  fetchLeadCandidatesThunk,
  selectLeadCandidatesState,
} from "../slice/lead-candidates.slice"
import { leadCandidatesStrings as s } from "../../../i18n/locales/lead-candidates.strings"

export default function LeadCandidatesPage(): React.ReactElement {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { error, detailRow } = useAppSelector(selectLeadCandidatesState)
  const [addDialogOpen, setAddDialogOpen] = React.useState<boolean>(false)

  const reloadList = React.useCallback(() => {
    void dispatch(fetchLeadCandidatesThunk())
  }, [dispatch])

  React.useEffect(() => {
    reloadList()
  }, [reloadList])

  const notAllowed = (allowed: boolean): void => {
    if (!allowed) {
      navigate("/dashboard")
    }
  }

  return (
    <CheckUserAllowedComponent checkIfAdmin onCheckPermission={notAllowed}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography variant="h5">{s.pageTitle}</Typography>
          <Button
            variant="contained"
            onClick={() => setAddDialogOpen(true)}
            sx={{ cursor: "pointer" }}
          >
            {s.addButton}
          </Button>
        </Box>
        {error != null && error !== "" ? (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => dispatch(clearLeadCandidatesErrorAct())}
          >
            {s.loadError} {error}
          </Alert>
        ) : null}
        <LeadCandidatesFiltersCp />
        <LeadCandidatesTableCp />
        <LeadCandidatesAddDialogCp
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          onCreated={reloadList}
        />
        <LeadCandidatesDetailDialogCp
          open={detailRow != null}
          onUpdated={reloadList}
        />
      </Box>
    </CheckUserAllowedComponent>
  )
}
