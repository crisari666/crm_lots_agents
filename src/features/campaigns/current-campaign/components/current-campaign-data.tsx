import { Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { dateUTCToFriendly } from "../../../../utils/date.utils";
import CampaignControls from "./campaign-controls";

export default function CurrentCampaignData() {
  const {currentCampaign, officesCampaigns} = useAppSelector((state: RootState) => state.currentCampaign)
  const determineActivedStep  =() :number => {
    if(currentCampaign !== undefined) {
      if(officesCampaigns.length === 0){
        return 0
      } else if(officesCampaigns.length > 0) {
        return 1
      } else {
        return 2
      }
      
    } else {
      return 0
    }
  }
  return (
    <>
      {currentCampaign !== undefined && <>
      <Paper sx={{padding: 2, marginBottom: 2}} elevation={4}>
        <Typography variant="h6" marginBottom={2} > Estado de campaña </Typography>
        <Stepper activeStep={determineActivedStep()}>
          <Step > <StepLabel> Activacion {dateUTCToFriendly(currentCampaign.date)} </StepLabel> </Step>
          <Step > <StepLabel> Asignacion de clientes </StepLabel> </Step>
          <Step > <StepLabel> Finalizacion {dateUTCToFriendly(currentCampaign.dateEnd)} </StepLabel> </Step>
        </Stepper>
      </Paper>
      <CampaignControls currentCampaign={currentCampaign}/>
      </>}
    </>
  )
}