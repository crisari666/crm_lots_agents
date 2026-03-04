import { Accordion, AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Switch, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { ArrowDropDown, ExpandMore } from "@mui/icons-material";
import { blue, orange } from "@mui/material/colors";
import { toggleAllowModifyOfficeCampaingDatabaseThunk, toggleAllowModifyOfficeCampaingThunk, toggleAutomaticModeThunk, toggleUserFromCampaignDatabaseThunk, toggleUserFromCampaignThunk } from "../current-campaign.slice";
import { OfficeLeadI } from "../../../../app/models/office-leads-with-users.interface";
import React from "react";

export default function OfficesLeadsUsersCP() {
  const { offices } = useAppSelector((state: RootState) => state.currentCampaign)
  const dispatch = useAppDispatch()


  const toggleUserFromCampaign = ({ userId, index, officeCampaignId }: { userId: string, officeCampaignId: string, index: number }) => {
    dispatch(toggleUserFromCampaignThunk({ userId, officeCampaignId, index }))
  }
  const toggleUserFromCampaignDatabase = ({ userId, index, officeCampaignId }: { userId: string, officeCampaignId: string, index: number }) => {
    dispatch(toggleUserFromCampaignDatabaseThunk({ userId, officeCampaignId, index }))
  }

  const toggleAutomaticMode = ({ officeId, automaticMode, officeIndex }: { officeId: string, automaticMode: boolean, officeIndex: number }) => {
    dispatch(toggleAutomaticModeThunk({ officeId, automaticMode, officeIndex }))
  }

  const resolveTotalUserPerOffice = (officeLead: OfficeLeadI): number => {
    if (officeLead.officeCampaign.length === 0) return 0
    return officeLead.officeCampaign[0].users.length
  }
  return (
    <>
      <Paper sx={{ padding: 2, marginTop: 2 }} elevation={4}>
        <Typography variant="h6"> Usuarios para campaña </Typography>
        {offices.map((office, i) => office.enable ? (
          <Accordion key={`officeList${office._id}`}>
            <AccordionSummary color={blue[500]} expandIcon={<ExpandMore color={"primary"} />} disabled={office.leads.length === 0}> {office.name}</AccordionSummary>
            {office.leads.map((lead, i2) => (
              <Accordion key={`leadOffice${office._id}_${lead._id}`} sx={{ paddingLeft: 2 }}>
                <AccordionSummary color={orange[500]} disabled={lead.users.length === 0} expandIcon={<ArrowDropDown />}>
                  <Grid container>
                    <Grid item xs={6}>
                      {lead.name} | {lead.lastName} | ({lead.email}) [{resolveTotalUserPerOffice(lead)}]
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        label="Modo automático"
                        labelPlacement="end"
                        control={
                          <Switch
                            checked={lead.officeCampaign.length > 0 && (lead.officeCampaign[0].automaticMode === true)}
                            onChange={(e, checked) => toggleAutomaticMode({ officeId: office._id, automaticMode: checked, officeIndex: i })}
                          />
                        }
                      />
                      <FormControlLabel
                        label="Modificar campaña"
                        labelPlacement="end"
                        control={
                          <Switch
                            checked={lead.officeCampaign.length > 0 && lead.officeCampaign[0].allow === true}
                            onChange={(e, checked) => dispatch(toggleAllowModifyOfficeCampaingThunk({ officeId: office._id, allow: checked, officeIndex: i }))}
                          />
                        }
                      />
                      <FormControlLabel
                        label="Modificar campaña base de datos"
                        labelPlacement="end"
                        control={
                          <Switch
                            checked={lead.officeCampaign.length > 0 && lead.officeCampaign[0].allowDatabase === true}
                            onChange={(e, checked) => dispatch(toggleAllowModifyOfficeCampaingDatabaseThunk({ officeId: office._id, allow: checked, officeIndex: i }))}
                          />
                        }
                      />
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container>
                    <Grid item xs={6}>
                      <List sx={{ paddingLeft: 2 }}>
                        {lead.users.map((user, i3) => (
                          <ListItem key={user._id}>
                            <ListItemText
                              primary={`${user.name} ${user.lastName}`}
                              secondary={`${user.email} [${user.rank?.nCustomers ?? '--'}]`}
                            />
                            <ListItemSecondaryAction>
                              {lead.officeCampaign.length > 0 && <Checkbox
                                checked={(lead.officeCampaign[0].users as string[]).indexOf((user._id)) !== -1}
                                onChange={(e, checked) => toggleUserFromCampaign({ userId: user._id, officeCampaignId: lead.officeCampaign[0]._id, index: i })}
                              />}
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={6}>
                      <List sx={{ paddingLeft: 2 }}>
                        {lead.users.map((user, i3) => (
                          <ListItem key={user._id}>
                            <ListItemText
                              primary={`${user.name} ${user.lastName}`}
                              secondary={`${user.email} [${user.rank?.nCustomersDatabase ?? '--'}]`}
                            />
                            <ListItemSecondaryAction>
                              {lead.officeCampaign.length > 0 && <Checkbox
                                checked={(lead.officeCampaign[0].usersDatabase as string[]).indexOf((user._id)) !== -1}
                                onChange={(e, checked) => toggleUserFromCampaignDatabase({ userId: user._id, officeCampaignId: lead.officeCampaign[0]._id, index: i })}
                              />}
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

            ))}
          </Accordion>
        ) : <React.Fragment key={i}></React.Fragment>)}
      </Paper>
    </>
  )
}