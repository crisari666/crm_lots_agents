import { Circle } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

export default function UserCustomersResumeN() {
  const { resumeUsers } = useAppSelector((state) => state.userCustomer)
  return (
    <Grid container padding={1} alignItems={'center'}>
      <Grid item xs={3}>
        <Typography variant="body1">
          <Circle color="success"/> {resumeUsers.success}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1">
          <Circle color="info"/> {resumeUsers.actives}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1">
          <Circle color="warning"/> {resumeUsers.pendings}
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body1">
          <Circle color="disabled"/> {resumeUsers.actives + resumeUsers.pendings + resumeUsers.success}
        </Typography>
      </Grid>
    </Grid>
  )
}