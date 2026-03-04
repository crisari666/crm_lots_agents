import { Step, StepLabel, Stepper, Typography } from "@mui/material";
import { CustomerResumeSituation } from "../../../../../app/models/customer-resume-model";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";

export default function CustomerSituationResume({situations} : {situations: CustomerResumeSituation[]}){
  return (
    <>
      <Stepper orientation="vertical">
        {situations.map((situation) => {
          return (
            <Step key={situation._id}>
              <StepLabel> {situation.situation.title} 
                <Typography variant="body1">
                  {situation.note} - [ {situation.user.name} | {situation.user.lastName} ]
                </Typography>
                <Typography variant="caption">
                  {dateUTCToFriendly(situation.date) }
                </Typography>
              </StepLabel>
            </Step>  
          )
        })}
      </Stepper>
    </>
  )
}