import { ArrowDropDown } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";

import { useEffect } from "react";
import { getUserResumeCustomersThunk } from "../user-customer.slice";
import { useParams } from "react-router-dom";
import UserCustomersResumeN from "./user-customers-resume-n";
import UserCustomersResumeDetail from "./user-customers-resume-detail";
import UserPaymentsResume from "./user-payments-resume";

export default function UserResumeComponent() {
  const dispatch = useAppDispatch()


  const {userId} = useParams()

  useEffect(() => {
    if(userId) dispatch(getUserResumeCustomersThunk(userId))
  }, [])

  return (
    <>
      <Paper sx={{marginBottom: 2}}>
        <Box padding={2}>
          <Typography variant="body1">
            User resume
          </Typography>
        </Box>
      </Paper>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} md={6}> 
          <Accordion>
            <AccordionSummary expandIcon={<ArrowDropDown/>}>
              <UserCustomersResumeN />
            </AccordionSummary>
            <AccordionDetails>
              <UserCustomersResumeDetail />
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12} md={6}>
          <UserPaymentsResume/>
        </Grid>
      </Grid>
    </>
  ) 
}