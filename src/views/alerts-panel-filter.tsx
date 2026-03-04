import { useEffect } from "react"
import { Box, IconButton, Paper, Typography } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import AppSelector from "../app/components/app-select"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { getOfficesThunk } from "../features/offices/offices-list/offices-list.slice"
import {
  getAuditorAlertsPanelThunk,
  setAlertsPanelOfficeIdAct,
} from "../features/alerts/alerts.slice"

export default function AlertsPanelFilter() {
  const dispatch = useAppDispatch()
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const alertsPanelOfficeId = useAppSelector(
    (state) => state.alerts.alertsPanelOfficeId
  )

  useEffect(() => {
    if (!gotOffices) {
      dispatch(getOfficesThunk())
    }
  }, [dispatch, gotOffices])

  const handleChange = ({ name, val }: { name: string; val: string }) => {
    dispatch(setAlertsPanelOfficeIdAct(val))
  }

  const officeOptions = offices.map((office) => ({
    _id: office._id ?? "",
    name: office.name ?? office._id ?? "",
  }));

  const selectedOffice = officeOptions.find(
    (o) => o._id === alertsPanelOfficeId
  );
  const filteredOfficeName = selectedOffice?.name ?? alertsPanelOfficeId ?? "";

  const handleRefresh = () => {
    dispatch(getAuditorAlertsPanelThunk())
  }

  return (
    <Paper sx={{ padding: 2, marginBottom: 2 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
        {filteredOfficeName && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
            Filtrando por oficina: <strong>{filteredOfficeName}</strong>
          </Typography>
        )}
        <IconButton
          onClick={handleRefresh}
          size="medium"
          color="primary"
          aria-label="Actualizar"
        >
          <RefreshIcon />
        </IconButton>
        <AppSelector
          name="office"
          label="Oficina"
          options={officeOptions}
          value={alertsPanelOfficeId}
          onChange={handleChange}
        />
      </Box>
    </Paper>
  )
}
