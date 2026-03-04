import { ArrowBack } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import OfficeForm from "./components/office-form";

export default function HandleOfficeView() {
  const {officeId} = useParams()
  const navigate = useNavigate()
  return (
    <> 
      <Paper sx={{padding: 3}}>
        <Button onClick={() => navigate("/dashboard/offices-list")}> <ArrowBack/> Volver a Listado  </Button>
      </Paper>
      <Paper sx={{padding: 3}}>
        <Typography variant="h6">{officeId === undefined ? "Crear Sede" : "Modificar Sede"} </Typography>
      </Paper>
      <Paper sx={{padding: 3}}>
        <OfficeForm/>
        
      </Paper>
    </>
  )
}