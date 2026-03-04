import { Grid } from "@mui/material";
import OfficeLevelsOptions from "../features/offices/office-levels/components/office-levels-options";
import OfficeLevelForm from "../features/offices/office-levels/components/office-level-form";
import OfficeLevelsList from "../features/offices/office-levels/components/office-level-list";

export default function OfficeLevelView() {
  
  return (

    <>
      <OfficeLevelsOptions/>     
      <Grid container spacing={2} marginTop={2}>
        <Grid item xs={6}>
          <OfficeLevelForm/>
        </Grid>
        <Grid item xs={6}>
          <OfficeLevelsList />
        </Grid>
      </Grid>
    </>
  )
}