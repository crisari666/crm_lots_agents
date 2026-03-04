
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Button, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import { displayDialogSettingAct } from "../slice/settings.slice";
export default function SettingsControls() {
  const dispatch = useAppDispatch()
  const {} = useAppSelector((state) => state.settings) 

  useEffect(() => {

  }, [])

  const displayForm = () => {
    dispatch(displayDialogSettingAct(true))
  }

  return (
    <>
      <Paper sx={{padding: 2, marginBottom: 1}}>
        <Button variant="outlined" endIcon={<Add/>} onClick={displayForm}> Add Setting </Button>
      </Paper>
    </>
  )
}