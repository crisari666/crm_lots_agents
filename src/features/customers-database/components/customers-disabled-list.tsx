import { Button, ButtonGroup, Card, Checkbox, Grid, IconButton, TableCell, TableRow, Typography, createTheme } from "@mui/material";
import React from "react";
import { TableVirtuoso } from "react-virtuoso";
import { AddIcCall, ManageHistory, PhoneForwarded, PhoneMissed, Visibility } from "@mui/icons-material";
import { ThemeProvider } from "@emotion/react";
import { VirtuosoTableComponents } from "./virtualized-table";
import { getCustomerCallActionsThunk } from "../../customers/customers-list/customers.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import DialogCustomerCallActions from "../../customers/customer-view/components/dialog-customer-call-actions";
import { getCustomerResumeThunk } from "../../customers/customer-view/customer-view.slice";
import { UserWithCustomersDatabaseType } from "../slice/customer-disabled.state";
import { RootState } from "../../../app/store";
import { assignCustomerDatabaseToUsersThunk, checkCustomerDisabledAct } from "../slice/customers-database.slice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";




export default function CustomersDisabledList() {
  const {customers, rowCustomers, userWithCustomers, loading} = useAppSelector((state: RootState) => state.customerDatabase)
  const dispatch = useAppDispatch()  

  const theme = createTheme({
    components: {
      MuiTableCell: { styleOverrides: { root: { padding: '0px', minWidth: "30px" } }},
      MuiButtonGroup: { defaultProps: { size: 'small'}, styleOverrides: {root: { padding: '0px', minWidth: "30px" }, grouped: { minWidth: '30px' }}},
      MuiButton: { defaultProps: { size: 'small'}, styleOverrides: { root: { padding: '1px', minWidth: "30px" } }},
      MuiIconButton: { defaultProps: { size: 'small'}},
      MuiSvgIcon: { defaultProps: { fontSize: "small" } , styleOverrides: { root: { fontSize: "14px" } } },
      MuiIcon: { defaultProps: { fontSize: 'small' } }
    }
  })

  const confirmAssing = () => {
    // eslint-disable-next-line no-restricted-globals
    if(confirm("Are you sure to assign selected customers?")){
      const d: UserWithCustomersDatabaseType[] = userWithCustomers.map((u) => { 
        const customerIds = u.customers.map((c) => c._id)
        return {userId: u._id, customersId: customerIds, office: u.office}
      }).filter((u) => u.customersId.length > 0)
      dispatch(assignCustomerDatabaseToUsersThunk(d))
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
      <DialogCustomerCallActions/>
      <LoadingIndicator open={loading}/>
      <Card style={{height: 600, paddingBottom: 50}}>
        <Grid container textAlign={'right'} justifyContent={'space-around'}>
          <Grid item>
            <ButtonGroup>
              <Button> Total: {rowCustomers.length} </Button>
              <Button color="warning"> <> {rowCustomers.filter(u => u.checked === true).length} Seleccionados </>  </Button>
              <Button color="secondary"> <> Promedio: {Number(rowCustomers.filter(u => u.checked === true).length / userWithCustomers.length).toFixed(1)} </>  </Button>
            </ButtonGroup>
          </Grid>
          <Grid item>
              <Button variant="contained" onClick={confirmAssing}> ASIGNAR SELECCIONADOS </Button>
          </Grid>
        </Grid>
        <Typography variant="body1">Disabled Customers</Typography>
        <TableVirtuoso 
          data={rowCustomers}
          components={VirtuosoTableComponents}
          fixedHeaderContent={() => 
            <TableRow style={{backgroundColor: "white"}}>
              <TableCell align="center"> <Visibility /> </TableCell>
              <TableCell style={{width: 50}}>
                <Checkbox
                  checked={customers.length > 0 && customers.every((customer) => customer.checked)}
                />
              </TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell style={{width: 200}}>Name</TableCell>
              <TableCell style={{width: 200}}>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Asignado</TableCell>
              <TableCell>Dado de baja</TableCell>
              <TableCell align="center">Calls</TableCell>
            </TableRow>
          }
          itemContent={(index, data) => <>
              <TableCell align="center"><IconButton onClick={() => dispatch(getCustomerResumeThunk(data._id))}> <Visibility/> </IconButton></TableCell>
              <TableCell style={{width: 50, maxWidth: 50}}>
                <Checkbox
                  checked={data.checked}
                  onChange={(e, checked) => dispatch(checkCustomerDisabledAct({index, checked}))}
                />
              </TableCell>
              <TableCell>{data.date}</TableCell>
              <TableCell style={{width: 200}}>{data.name}</TableCell>
              <TableCell style={{width: 200}}>{data.email}</TableCell>
              <TableCell>{data.phone}</TableCell>
              <TableCell align="center">{data.nAssigned}</TableCell>
              <TableCell align="center">{data.nDisabled}</TableCell>
              <TableCell>
              <ButtonGroup>
                <Button color="secondary"> <AddIcCall/> {data.resumeCalls.push} </Button>
                <Button color="success"> <PhoneForwarded/> {data.resumeCalls.answer} </Button>
                <Button color="error"> <PhoneMissed/> {data.resumeCalls.unanswer} </Button>
                <Button onClick={() => dispatch(getCustomerCallActionsThunk({customerId: data._id}))} color="info"> <ManageHistory/> </Button>
              </ButtonGroup>
              </TableCell>
          </>
          }
        />
      </Card>
      </ThemeProvider>
    </>
  )
}