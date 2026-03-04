import { Card, CardContent, Chip, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getOfficeActiceUserCustomersThunk, getOfficeForDashboardThunk, setCurrentOfficeDashboardAct } from "../office-dashboard.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Visibility } from "@mui/icons-material";

export default function OfficeDashboarCustomersResume() {
  const {customersResumeActive , loading, currentOffice} = useAppSelector(state => state.officeDashboard)
  const dispatch = useAppDispatch()
  const {officeId} = useParams()

  useEffect(() => {
    dispatch(getOfficeForDashboardThunk({officeId: officeId!}))
    dispatch(getOfficeActiceUserCustomersThunk({officeId: officeId!}))
    return () => {
      dispatch(setCurrentOfficeDashboardAct(undefined))
    }
  }, [])

  console.log('customersResumeActive', {currentOffice})

  return(
    <>
      <LoadingIndicator open={loading}/>
      {currentOffice && 
      <Card>
        <CardContent>
          <Typography variant="h6"></Typography>
          <List subheader={
            <>
              <Typography variant="h6">
                {currentOffice?.name}
                <Chip size="small" color="secondary" sx={{marginLeft: 1}} label={customersResumeActive.reduce((acc, customer) => acc + customer.activeCustomers, 0)} />
              </Typography>
            </>
          }>

            {customersResumeActive.map((customer) => (
              <ListItem key={customer._id}

                secondaryAction={
                  <Chip variant="outlined"  color="secondary" label={customer.activeCustomers} />
                }
                divider
              >
                <ListItemText 
                  primary={`${customer.name} | ${customer.lastName}`} 
                  secondary={`${customer.email}`} 
                  />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>}
    </>
  )
}