import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import {  Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, Paper } from "@mui/material"
import { getLeadUsersThunk } from "../../../users-list/slice/user-list.slice";
import { chooseUseToCampaignrAct, chooseUserToCombineDatabaseAdsAct, removeUserFromCampaignAct, removeUserFromCompileDatabaseAppsAct, showAlertSureSaveCampaignAct, showAlertSureSaveCampaignDatabaseAct } from "../campaign-lead.slice";
import DialogSureSaveCampaign from "./dialog-sure-save-campaign";
import CampaignAbailavilityAlert from "./campaign-availability-alert";
import { ArrowDownward } from "@mui/icons-material";
import DialogSureSaveCampaignDatabase from "./dialog-sure-save-campaign-database";

export default function ConfigureCampaignCP() {
  const {officeCampaign, campaigGot, campaign, usersChose, userChoseDatabase} = useAppSelector((state) => state.officeCampaign)
  const {users, gotUsers} = useAppSelector((state) => state.users)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(gotUsers === false) {
      dispatch(getLeadUsersThunk())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  } ,[])

  const changeCheckbox = ({userId, checked} : {userId: string, checked: boolean}) => {
    if(checked) {
      dispatch(chooseUseToCampaignrAct(userId))
    }else{
      dispatch(removeUserFromCampaignAct(userId))
    }
  }
  const changeCheckboxDatabase = ({userId, checked} : {userId: string, checked: boolean}) => {
    if(checked) {
      dispatch(chooseUserToCombineDatabaseAdsAct(userId))
    }else{
      dispatch(removeUserFromCompileDatabaseAppsAct(userId))
    }
  }

  const showAlertSureSaveCampaign = () => {
    dispatch(showAlertSureSaveCampaignAct(true))
  }
  
  const showAlertSureSaveCampaignDatabase = () => {
    dispatch(showAlertSureSaveCampaignDatabaseAct(true))
  }

  return(
    <>  
      <DialogSureSaveCampaign />
      <DialogSureSaveCampaignDatabase />
      {campaigGot === true &&officeCampaign !== undefined && campaign !== undefined && <>
        <CampaignAbailavilityAlert/>
        <Paper sx={{padding: 2, marginTop: 2}} elevation={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Accordion>
                <AccordionSummary  expandIcon={<ArrowDownward />}>
                  <ListSubheader> Usuarios en campaña </ListSubheader>
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {users.map((user) => (
                      <ListItem disablePadding key={"campaignId"+user._id!}>
                        <ListItemText primary={`[${user.email}]  ${user.name} ${user.lastName}`} />
                        <ListItemSecondaryAction> 
                        {((campaign.enable && officeCampaign.allow === true) || officeCampaign.users.length === 0) && 
                          <Checkbox 
                            checked={usersChose.indexOf(user._id!) !== -1} onChange={(e, checked) => changeCheckbox({userId: user._id!, checked})} 


                          /> 
                        }
                        {officeCampaign.users.length !== 0  && officeCampaign.allow === false && <Checkbox checked={(officeCampaign.users as string[]).indexOf(user._id!) !== -1} disabled/> }
                        </ ListItemSecondaryAction>
                        
                      </ListItem>
                    ))}
                    <ListItem>
                      <Button variant="contained" disabled={!campaign.enable || !officeCampaign.allow} fullWidth color="warning" onClick={showAlertSureSaveCampaign}> GUARDAR CAMPAÑA</Button>
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
            <Grid item xs={6}>
              <Accordion>
                <AccordionSummary  expandIcon={<ArrowDownward />}>
                  <ListSubheader> Campaña base de datos</ListSubheader>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {users.map((user) => (
                      <ListItem disablePadding key={"campaignId"+user._id!}>
                        <ListItemText primary={`[${user.email}]  ${user.name} ${user.lastName}`} />
                        <ListItemSecondaryAction> 
                        {((campaign.enableDatabase && officeCampaign.allowDatabase === true) || officeCampaign.usersDatabase.length === 0) && 
                          <Checkbox 
                            checked={userChoseDatabase.indexOf(user._id!) !== -1} onChange={(e, checked) => changeCheckboxDatabase({userId: user._id!, checked})} 
                          /> 
                        }
                        {officeCampaign.usersDatabase.length !== 0  && officeCampaign.allowDatabase === false && <Checkbox checked={(officeCampaign.usersDatabase as string[]).indexOf(user._id!) !== -1} disabled/> }
                        </ ListItemSecondaryAction>
                        
                      </ListItem>
                    ))}
                    <ListItem>
                      <Button variant="contained" disabled={!campaign.enableDatabase || !officeCampaign.allowDatabase} fullWidth color="warning" onClick={showAlertSureSaveCampaignDatabase}> GUARDAR CAMPAÑA BASE DE DATOS</Button>
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
        </Paper>
      </>}
    </>
  )
}