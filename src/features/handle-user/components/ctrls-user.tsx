import { FormControlLabel, Grid, Paper, Switch } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleEnableUserThunk } from "../handle-user.slice";

export default function CtrlsUserCP() {
  const { currentUser } = useAppSelector((state) => state.handleUser )
  const { currentUser: userSession } = useAppSelector((state) => state.login )
  const dispatch = useAppDispatch() 
  return(
    <>
      {userSession !== undefined && (userSession!.level === 0 || userSession!.level === 1) && <Paper sx={{padding: 1, marginBottom: 1}}>
        <Grid container>
          <Grid item>
            <FormControlLabel 
              label="Enable"
              control={<Switch checked={currentUser!.enable === true} />}
              onChange={(e, checked) => dispatch(toggleEnableUserThunk({userId: currentUser!._id!, enable: checked  }))}  
            />
            
          </Grid>
        </Grid>
      </Paper>}
    </>
  )
}