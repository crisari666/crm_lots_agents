import { Accordion, AccordionSummary, Grid, List, ListItem, ListItemText, ListSubheader, Paper, Typography } from "@mui/material"
import { useAppSelector } from "../../../../app/hooks"
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import React from "react";
import UserInterface from "../../../../app/models/user-interface";


export default function UsersAvailableForCampaigns() {
  const { officesCampaigns, leadsId, leadUsersMap  } = useAppSelector(state => state.importNumbers) 

  const copyRowsToClipboard = ({nCustomers, leadUser} : {nCustomers: number, leadUser: string}) => {
    let rows = []
    for (let i = 0; i < nCustomers; i++) {
      rows.push(leadUser)
    }
    navigator.clipboard.writeText(rows.join('\n'))
  }

  return (

    <>
        {Object.keys(leadUsersMap).length > 0 && <Grid container spacing={2}>
          {officesCampaigns.map(officeCampaign => {
            const leadId = (officeCampaign.user as any)._id
            const leadUser = (officeCampaign.user as any).email
            const key = `officeCampaign${officeCampaign._id}`
            const expectedNumbers = leadsId[leadId] ? (officeCampaign.users as UserInterface[]).reduce((acc: number, el: UserInterface) => Number(acc) + Number(el.rank?.nCustomers ?? 0), 0) : 0
            return (
              leadsId[leadId] !== undefined  ? <Grid item xs={12} md={6} lg={4} key={key} marginTop={2}>
                <List component={Paper} elevation={4} subheader={<ListSubheader> 
                  <Typography 
                    onClick={() => copyRowsToClipboard({nCustomers: expectedNumbers, leadUser })} 
                    style={{cursor: 'pointer'}}
                  >{leadsId[leadId].name!} ({leadUser}) [{expectedNumbers}]</Typography> </ListSubheader>}>
                  {officeCampaign.users.map(el => {
                    const user = el as UserInterface                    
                    return (
                      <ListItem key={`${user._id}at_campaign`}>
                        <Accordion sx={{width: "100%"}} disabled={!leadUsersMap[leadId].users[user._id as string] === undefined && leadUsersMap[leadId].users[user._id as string].customers.length === 0}>
                          
                          <AccordionSummary expandIcon={<ReduceCapacityIcon/>}>{user.name}({user.email})[{user.rank?.nCustomers ?? '--'}]</AccordionSummary>
                          <List>
                            {leadUsersMap[leadId].users[user._id as string] && leadUsersMap[leadId].users[user._id as string].customers.map((customer, i) => (
                              <ListItem key={customer.customer!._id}>
                                <ListItemText primary={customer.name} /> 
                                <ListItemText primary={customer.phone} /> 
                              </ListItem>
                            ))}
                          </List>
                        </Accordion>
                      </ListItem>
                    )
                  })}
                </List>
              </Grid> : <React.Fragment key={key}></React.Fragment>
            )
          })}
        </Grid>}
    </>
  )
}