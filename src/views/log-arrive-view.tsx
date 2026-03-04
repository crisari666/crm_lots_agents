import { Paper, Typography } from "@mui/material";
import CamFaceId from "../features/log-arrive/components/cam-face-id";
import DialogNotRegisteredFaceId from "../features/log-arrive/components/dialog-not-registered-face-id";
import DialogSucessFaceAuth from "../features/log-arrive/components/dialog-success-face-auth";

export default function LogArriveView() {
  return (
    <> 
      <DialogNotRegisteredFaceId/>
      <DialogSucessFaceAuth/>
      <Paper sx={{padding: 2, marginBottom: 2}}>
        <Typography variant="h6" fontWeight={'bold'}>
          Registro de llegada con Face ID
        </Typography>
      </Paper>
      <CamFaceId/>
    </>
  )
}