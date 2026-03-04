import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel, Grid, List, ListItem, Paper, Switch, Typography, createTheme } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentCampaignThunk } from "../../campaigns/current-campaign/current-campaign.slice";
import { ThemeProvider } from "@emotion/react";
import { assignTotalExpectedNumbersAct, changeCampaignKindToAssignAct, getOfficesCampaignsDisabledThunk, toggleAddCustomerToOfficeAct } from "../slice/customers-database.slice";
import { OfficesUsers } from "../slice/customer-disabled.state";
import { DynamicFeed } from "@mui/icons-material";

const theme = createTheme({
  components: {
    MuiCardHeader: {styleOverrides: {subheader: {padding: 0},}},
    MuiAccordionSummary: {styleOverrides: {root: {padding: 0, paddingInline: 10, minHeight: 30}} },
    MuiAccordionDetails: {styleOverrides: {root: {padding: 0, paddingInline: 10},}},
    MuiButton: {styleOverrides: {root: {padding: 0, margin: 0, minHeight: 30}}},
  },
})

export default function CustomersDisabledOfficesCampaigns() {
  const dispatch = useAppDispatch()
  const { officesCampaignsWithUsersWithCustomers, userWithCustomers, expectedNumbers, normalCampaign, officesCampaigns } = useAppSelector((state) => state.customerDatabase) 
  useEffect(() => {
    dispatch(getOfficesCampaignsDisabledThunk())
    dispatch(getCurrentCampaignThunk())
  }, [])

  const calculateExpectedNumbers = (o: OfficesUsers) => {
      const users = o.users
      const total = users.reduce((acc, u) => {
        const rank = u.rank
        return acc + (normalCampaign ? (rank?.nCustomers ?? 0) : (rank?.nCustomersDatabase ?? 0) )
      }, 0)
      return total
}
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{marginTop: 2}}>
        <Box>
          <Grid container>
            <Grid item>
              <Typography sx={{padding: 1}}> Office Campaigns [{expectedNumbers}]   </Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                label={normalCampaign ? "Campaña normal" : "Campaña base de datos"}
                control={<Switch 
                  checked={normalCampaign}
                  onChange={() => dispatch(changeCampaignKindToAssignAct())} 
                />}               />
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={1}>
          {officesCampaignsWithUsersWithCustomers.map((o, i) => {
            const expectedNumbers = calculateExpectedNumbers(o)
            return (<Grid item xs={4} key={o._id}>
              <Card component={Paper}>
                <CardHeader 
                  title={<FormControlLabel
                    onChange={(e, c) => dispatch(toggleAddCustomerToOfficeAct({index: i, checked: c}))}
                    label={"Agregar numeros"}
                    control={<Checkbox />}
                  />}
                  subheader={<>
                    <div>{o.office.name} ({o.lead.email}) [{expectedNumbers}] <Button variant="outlined" size="small" onClick={() => {
                      const checked = officesCampaigns.find((c) => c._id === o._id)?.checked
                      console.log({checked});
                      
                     if( checked)  {
                      console.log("Checked");
                      
                      dispatch(assignTotalExpectedNumbersAct({index: i, expectedNumbers}))
                     }
                    }}> <DynamicFeed/> </Button></div>

                  </>}
                />
                <CardContent>
                  {
                  o.users.map((u, i) => {
                    const indexFromState = userWithCustomers.findIndex((r) => r._id === u._id)
                    const customers = indexFromState !== -1 ? userWithCustomers[indexFromState].customers : []
                    return (<Accordion key={u._id+o._id}>
                      <AccordionSummary disabled={customers.length === 0}> {u.lastName}({u.email}[{u.rank?.nCustomersDatabase ?? '--'}] </AccordionSummary>
                      <AccordionDetails>
                        <List disablePadding>
                          {customers.map((c, i) => 
                            <ListItem key={c._id} disablePadding>
                              <Typography variant="caption" >{c.name} - {c.phone}</Typography>
                            </ListItem>
                            )}

                        </List>
                      </AccordionDetails>
                    </Accordion>)
                  } 
                  )}
                </CardContent>
              </Card>
            </Grid>)
          }
          )}
        </Grid>
      </Card>
    </ThemeProvider>
  )
}