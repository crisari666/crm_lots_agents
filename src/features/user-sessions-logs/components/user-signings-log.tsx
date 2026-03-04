import { Download } from "@mui/icons-material";
import { Grid, Button } from "@mui/material";
import AppTextField from "../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getUserSessionsLogsThunk, updateFormInputUserLogsAct } from "../slice/user-sessions.slice";
import UserSignInsTable from "./user-signins-table";
import { RootState } from "../../../app/store";
export default function USerSigninsLogs() {
  const dispatch = useAppDispatch()
  const { userId, form} = useAppSelector((state: RootState) => state.userSessionLogs)
  const {start, end} = form
  const changeInput = ({name, val} : {name: string, val: string}) => {
    dispatch(updateFormInputUserLogsAct({key: name, value: val}))
  }
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={5}>
          <AppTextField name="start" label="Start Date" type="date" value={start} onChange={changeInput}/>
        </Grid>
        <Grid item xs={5}>
          <AppTextField name="start" label="End Date" type="date" value={end} onChange={changeInput}/>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={() => dispatch(getUserSessionsLogsThunk({end, start, userId}))}> <Download /></Button>
        </Grid>
      </Grid>
      <UserSignInsTable/>
    </>
  )
}