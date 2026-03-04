import { Grid, IconButton, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import LoadingIndicator from "../../../app/components/loading-indicator";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import AppSelector from "../../../app/components/app-select";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import AppAutoComplete, { AppAutocompleteOption } from "../../../app/components/app-autocomplete";
import { updateInputFilterPaymentAct } from "../business-logic/download-payment.slice";
import { Refresh } from "@mui/icons-material";
export default function DonwloadPaymentControls() {
  const dispatch = useAppDispatch()
  const { loading, filterPaymentForm } = useAppSelector((state) => state.downloadPayment)
  const { userId, office} = filterPaymentForm
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const { usersOriginal, gotUsers } = useAppSelector((state) => state.users)

  useEffect(() => {
    if (!gotOffices) dispatch(getOfficesThunk())
    if (!gotUsers) dispatch(fetchUsersThunk({enable: true}))
    
  }, [])

  const changeInput = ({ name: key, val: value } : {name: string, val: string}) => {
    dispatch(updateInputFilterPaymentAct({key, value}))
  }

  const usersOptions = usersOriginal.filter((u) => u.office && (u.office as any)._id === office).map((u) => ({_id: u._id, name: `${u.name} / ${u.lastName} / ${u.email}`}))

  const valueCollector = (): AppAutocompleteOption => {
    const valueCollector = usersOriginal.filter((u) => u._id === userId).map((u) => ({_id: u._id ?? "", name: `${u.email} | ${u.name} | ${u.lastName}`}));
    return valueCollector[0]
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <IconButton onClick={() => dispatch(fetchUsersThunk({enable: true}))}> <Refresh/> </IconButton>
          </Grid>
          <Grid item xs={5}>
            <AppSelector 
            value={office} 
            label="Oficina" 
            name="office"
            onChange={changeInput}
            options={offices.filter(f => f.enable === true).map((o) => ({_id: o._id, name: o.name}))} 
          />
          </Grid>
          <Grid item xs={5}>
            <AppAutoComplete 
              name="userId"
              onChange={({name, val}) => {
                
                changeInput({name, val: val === null ? "" : val._id ?? ""})
              }}
              multiple={false} 
              value={valueCollector()}
              label="Usuario" 
              options={(usersOptions as any)} 
          />
          </Grid>
        </Grid>
      </Paper>  
    </>
  )
}