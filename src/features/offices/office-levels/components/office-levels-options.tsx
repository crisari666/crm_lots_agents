import { Grid, IconButton, Paper } from "@mui/material"
import { ArrowCircleLeft } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

export default function OfficeLevelsOptions() {
  
  const navigate = useNavigate()


  return (
    <Paper sx={{padding: 1, marginBottom: 2}} elevation={5}>
      <Grid container>
        <Grid item>
          <IconButton color="info" onClick={() => navigate(-1)}> <ArrowCircleLeft/> </IconButton>
        </Grid>
      </Grid>
    </Paper>
  )
}