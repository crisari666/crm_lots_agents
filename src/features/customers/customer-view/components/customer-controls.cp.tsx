import { Button, Grid, Paper, Switch, FormControlLabel } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { inactiveCustomerThunk, showDialogSureDisableCustomerAct, updateCustomerProspectThunk, reassignCustomerThunk } from "../customer-view.slice"
import DialogSureDisableCustomer from "./dialog-sure-disable-customer"
import LoadingIndicator from "../../../../app/components/loading-indicator"
import SetCustomerUser from "./customer-set-user"
import { CopyAll, LocalFireDepartment } from "@mui/icons-material"

export default function CustomerControlsCP(){
  const {customerData, loading} = useAppSelector((state) => state.customer)
  const {currentUser} = useAppSelector((state) => state.login)
  const dispatch = useAppDispatch()

  const confirmInactivateCustomer = () => {
    if(window.confirm(`¿Está seguro de dar de baja al cliente ${customerData!.name}?`)){
      dispatch(inactiveCustomerThunk(customerData!._id))
    }
  }

  const copyUserIdToClipBoard = () => {
    navigator.clipboard.writeText(customerData!._id)
  }

  const handleProspectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (customerData) {
      dispatch(updateCustomerProspectThunk({customerId: customerData._id, isProspect: event.target.checked}))
    }
  }

  const handleReassignChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (customerData) {
      dispatch(reassignCustomerThunk({customerId: customerData._id, isReassigned: event.target.checked}))
    }
  }

  return(
    <>
      <DialogSureDisableCustomer/>
      <LoadingIndicator open={loading}/>
      {currentUser !== undefined && (currentUser.level! === 0 || currentUser.level! === 1) && <Paper sx={{padding: 2}}>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item>
            <Button size="small" variant="contained" disabled={customerData!.status === 1} color="error" onClick={() => dispatch(showDialogSureDisableCustomerAct(true))}> DAR DE BAJA</Button>
          </Grid>
          {(currentUser.level === 0 || currentUser.level === 1) && <>
            <Grid item>
              <Button endIcon={<LocalFireDepartment/>} onClick={confirmInactivateCustomer} size="small" variant="contained" disabled={customerData!.status === 2} color="warning"> Quemar</Button>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={customerData?.reassigned || false}
                    onChange={handleReassignChange}
                    color="info"
                  />
                }
                label="Reasignado"
              />
            </Grid>
            <Grid item>
                <SetCustomerUser/>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={customerData?.isProspect || false}
                    onChange={handleProspectChange}
                    color="primary"
                  />
                }
                label="Prospecto"
              />
            </Grid>
          </>
          }
        </Grid>
      </Paper>}
      <Grid container marginTop={1}>
        <Grid item>
          <Button variant="outlined" onClick={copyUserIdToClipBoard} endIcon={<CopyAll/>}> {customerData?._id} </Button>
        </Grid>
      </Grid>
    </>
  )
}