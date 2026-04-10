import { FormControlLabel, Grid, Paper, Switch } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { setUserPhysicalThunk, toggleEnableUserThunk } from "../handle-user.slice"
import SendFirstAccessWelcomeCp from "./send-first-access-welcome.cp"
import SendUserContractCp from "./send-user-contract.cp"

export default function CtrlsUserCP() {
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const { currentUser: userSession } = useAppSelector((state) => state.login)
  const dispatch = useAppDispatch()
  return (
    <>
      {userSession !== undefined &&
        (userSession!.level === 0 || userSession!.level === 1) && (
          <Paper sx={{ padding: 1, marginBottom: 1 }}>
            <Grid container spacing={2}>
              <Grid item>
                <FormControlLabel
                  label={s.ctrlEnable}
                  control={
                    <Switch checked={currentUser!.enable === true} />
                  }
                  onChange={(_e, checked) =>
                    dispatch(
                      toggleEnableUserThunk({
                        userId: currentUser!._id!,
                        enable: checked
                      })
                    )
                  }
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  label={s.ctrlPhysical}
                  control={
                    <Switch
                      checked={currentUser?.physical === true}
                    />
                  }
                  onChange={(_e, checked) =>
                    dispatch(
                      setUserPhysicalThunk({
                        userId: currentUser!._id!,
                        physical: checked
                      })
                    )
                  }
                />
              </Grid>
              <SendFirstAccessWelcomeCp />
              <SendUserContractCp />
            </Grid>
          </Paper>
        )}
    </>
  )
}