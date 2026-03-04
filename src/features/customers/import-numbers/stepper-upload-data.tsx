import { Alert, AlertTitle, Paper, Step, Stepper } from "@mui/material";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useAppSelector } from "../../../app/hooks";
import { Warning } from "@mui/icons-material";

export default function StepperUploadData() {
  const {loading, currentCampaignGot, currentCampaign} = useAppSelector((state) => state.importNumbers)
  return(
    <> 
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 2}} elevation={4}>
        {currentCampaignGot === true && currentCampaign && <Stepper activeStep={0}>
          <Step> Inicio  </Step>
          <Step> Confirmar  </Step>
          <Step> Subir  </Step>
        </Stepper>}
        {currentCampaignGot === true && !currentCampaign &&  <Alert variant="filled" severity="warning" icon={<Warning/>}>
          <AlertTitle> No hay una campaña activa </AlertTitle>
          Activa la campaña de esta semana para poder importar numeros.
        </Alert>}
      </Paper>
    </>
  )
}