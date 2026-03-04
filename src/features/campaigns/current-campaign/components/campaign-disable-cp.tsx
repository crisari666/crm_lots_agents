import { Info } from "@mui/icons-material";
import { Alert, AlertTitle, Button, Paper } from "@mui/material";
import { useAppDispatch } from "../../../../app/hooks";
import { createCampaignThunk } from "../current-campaign.slice";

export default function CurrentCampaignDisableCp() {
  const dispatch = useAppDispatch()
  return (
    <Paper sx={{padding: 2, marginBottom: 2}}>
      <Alert severity="warning" icon={<Info/>}>
        <AlertTitle> ALERTA DE CAMPAÑA</AlertTitle>
        No hay una campaña activa, no se pueden asignar clientes
      </Alert>
      <Button sx={{marginTop: 2}} variant="contained" onClick={() => dispatch(createCampaignThunk())}>CREAR CAMPAÑA</Button>
    </Paper>
  )
}