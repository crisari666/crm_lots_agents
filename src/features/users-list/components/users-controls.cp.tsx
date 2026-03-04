import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { Button, Checkbox, FormControlLabel, Grid, Paper } from "@mui/material"
import { PersonAddAlt1, Refresh } from "@mui/icons-material"
import { changeOnlyEnableUsersAct, changeSearchStringAct, fetchUsersThunk, filterByOfficeChosenAct } from "../slice/user-list.slice"
import AppSelector from "../../../app/components/app-select"
import AppTextField from "../../../app/components/app-textfield"
import { useCallback, useEffect } from "react"
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice"

export default function UserControlsCP() {
  const navigate  = useNavigate()
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state:RootState) => state.login)
  const { officeIdFilter, onlyEnableUsers } = useAppSelector((state:RootState) => state.users)
  const { offices, gotOffices } = useAppSelector((state:RootState) => state.offices)
  const goToAddUser = () => {
    navigate("/dashboard/handle-user")
  }
  const loadUsers = useCallback(() => {
    dispatch(fetchUsersThunk({enable: onlyEnableUsers}))
  }, [onlyEnableUsers, dispatch])

  useEffect(() => {
    if(!gotOffices){
      dispatch(getOfficesThunk())
    }
  }, [dispatch, gotOffices])

  useEffect(() => {
    loadUsers();
  }, [loadUsers, onlyEnableUsers])

  
  return(
    <>
      {(currentUser!.level === 0 || currentUser!.level === 1) && 
        <Paper sx={{padding: 2, marginBottom: 2}}>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item>
                <Button variant="contained" color="primary" onClick={goToAddUser}>Add User <PersonAddAlt1/></Button>
            </Grid>
            <Grid item>
              <Button color="warning" onClick={() => dispatch(loadUsers)} variant="outlined" fullWidth> <Refresh/> </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              <AppSelector 
                options={offices} 
                value={officeIdFilter}
                name="office" 
                label="Oficina" 
                onChange={({name, val}) => dispatch(filterByOfficeChosenAct(val))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <AppTextField name="search_string" label="Buscador" onChange={(d) => dispatch(changeSearchStringAct(d.val))}/>
            </Grid>
            <Grid item md={3} xs={6}> 
              <FormControlLabel
                label="Activos"
                labelPlacement="start"
                control={<Checkbox checked={onlyEnableUsers} onChange={(e, c) => dispatch(changeOnlyEnableUsersAct(c))}/>}
               />
            </Grid>
          </Grid>

        </Paper>
      }
    </>
  )
}