import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";
import UserLeaveDate from "./user-leave-date";
import UserGoal from "./user-goal";
export default function UserTools() {
  return (
    <>
      <Accordion sx={{marginTop: 2}}>
        <AccordionSummary expandIcon={<ArrowDropDown/>}>
          Opciones 
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <UserLeaveDate/>
            </Grid>
            <Grid item xs={6}>
              <UserGoal/>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  )
}