import { useAppSelector } from "../../../app/hooks"
import LoadingIndicator from "../../../app/components/loading-indicator"
import { RootState } from "../../../app/store"
import { Button, Card, Grid, Paper, Typography } from "@mui/material"
import OfficesTableList from "./components/offices-table-list"
import UsersForOfficeDialog from "./components/users-for-office-modal"
import { Add, AssessmentOutlined } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

export default function OfficesListView(){
  const loading = useAppSelector((state: RootState) => state.offices.loading)
  const navigate = useNavigate()
  
  return (
    <>
      <LoadingIndicator open={loading}  />
      <UsersForOfficeDialog/>
      <Paper>
        
        <Card sx={{padding: 1}}>
          <Typography variant="h6" marginBottom={2}>Campuses</Typography>
          <Grid container spacing={1}>
            <Grid item>
              <Button size="small" variant="contained" onClick={() => navigate("/dashboard/handle-office")} endIcon={<Add/>}>Add Campus </Button>
            </Grid>
            <Grid item>
              <Button size="small" color="secondary" variant="contained" onClick={() => navigate("/dashboard/office-levels")} endIcon={<AssessmentOutlined fontSize="small"/>}>Niveles oficina </Button>
            </Grid>
          </Grid>
        </Card>
        <Card sx={{padding: 1}}>
          <OfficesTableList/>
        </Card>

      </Paper>
    </>
  )
}