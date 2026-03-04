import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import { CustomerResumeHistorialAssignation } from "../../../../../app/models/customer-resume-model";
import { dateUTCToFriendly } from "../../../../../utils/date.utils";

export default function CustomerAssigned({assigneds} : {assigneds: CustomerResumeHistorialAssignation[]}) {
  return (
    <>
      <Stepper orientation="vertical">
        {assigneds.map((assigned) => {
          return (
            <Step key={assigned._id}>
              <StepLabel>
                { dateUTCToFriendly(assigned.date)} 
                <Typography variant="h6">
                  {assigned.user.length > 0 ? `${assigned.user[0].name} [${assigned.user[0].lastName}]` : '--'}
                </Typography>
              </StepLabel>
            </Step>  
          )
        })} 
      </Stepper>
    </>
  )
}