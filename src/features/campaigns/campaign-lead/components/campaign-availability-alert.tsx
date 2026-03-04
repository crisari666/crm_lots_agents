import { Alert, AlertTitle, Paper } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";

export default function CampaignAbailavilityAlert( ){
  const { campaign, officeCampaign} = useAppSelector((state) => state.officeCampaign)
  return (
    <Paper sx={{padding: 2}} elevation={4}>
      {campaign!.enable && officeCampaign!.users.length === 0 && <Alert severity="success" variant="outlined">
        <AlertTitle> Configuracion de Campaña </AlertTitle>
        Selecciona los usuarios disponibles para la campaña
      </Alert>}
      {(!campaign!.enable || officeCampaign!.users.length > 0) && <Alert severity="warning" variant="outlined">
        <AlertTitle> Configuracion de Campaña inhabilitidad </AlertTitle>
        No es posible configurar la campaña actualmente, contacta a tu superior.
      </Alert>}
    </Paper>
  )
}