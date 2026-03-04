import { Button, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { showModalAddCustomersAct, showRecycledCustomersModalAct } from "../redux/campaign-customers-slice";
import { Recycling } from "@mui/icons-material";
export default function CampaignCustomersControls() {
  const dispatch = useAppDispatch()
  const { currentCampaign } = useAppSelector((state) => state.currentCampaign) 
  return (
    <Paper sx={{p:2, marginBottom: 1}}>
      {currentCampaign !== undefined && <>
        <Button onClick={() => dispatch(showModalAddCustomersAct(true))} variant="outlined"> Agregar Clientes </Button>
        <Button onClick={() => dispatch(showRecycledCustomersModalAct(true))} variant="outlined" color="secondary" endIcon={<Recycling/>}> Clientes reciclado </Button>
      </>
       }
    </Paper>
  )
}