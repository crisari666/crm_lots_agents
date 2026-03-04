import { Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { CampaignInterface } from "../../../../app/models/campaign.interface";
import { useAppDispatch } from "../../../../app/hooks";
import { switchCurrentCampaignThunk, toggleCampaignDatabaseThunk } from "../current-campaign.slice";

export default function CampaignControls({currentCampaign} : {currentCampaign: CampaignInterface }) {
  const dispatch = useAppDispatch()
  const switchEnable = ({checked} : {checked: boolean}) => {
    dispatch(switchCurrentCampaignThunk({enable: checked}))
  }
  const switchEnableDatabase = ({checked} : {checked: boolean}) => {
    dispatch(toggleCampaignDatabaseThunk({campaignGlobalId: currentCampaign._id, enable: checked}))
  }
  return(
    <>
      <Paper sx={{padding: 2}} elevation={4}>
        <Typography variant="h6"> Controles de campaña </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center"> OFF/ON </TableCell>
                <TableCell align="center"> Database campaign </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  <Tooltip title="Permitir asignar o no usuarios en la campaña actual">
                    <Switch checked={currentCampaign.enable} onChange={(e, checked)=> switchEnable({checked})}/> 
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="habilitar deshabilitar campana de base de datos">
                    <Switch checked={currentCampaign.enableDatabase} onChange={(e, checked)=> switchEnableDatabase({checked})}/> 
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}