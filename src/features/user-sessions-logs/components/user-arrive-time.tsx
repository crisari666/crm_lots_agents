import { Grid, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppTextField from "../../../app/components/app-textfield";
import { changeUserArriveTimeInputAct, updateUserArriveTimeThunk } from "../slice/user-sessions.slice";
import { Save } from "@mui/icons-material";
export default function UserArriveTime() {
  const dispatch = useAppDispatch()
  const { userTimeForm: {time}, userId } = useAppSelector((state) => state.userSessionLogs) 
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <AppTextField type="time" value={time} name="time" label="Hora llegada" 
            onChange={(d) => dispatch(changeUserArriveTimeInputAct(d.val))}
            endComponent={<>
              <IconButton onClick={() => dispatch(updateUserArriveTimeThunk({userId, time: Number(time.replaceAll(':', '.'))}))}> <Save/> </IconButton>
            </>}
          />
        </Grid>
      </Grid>
    </>
  )
}