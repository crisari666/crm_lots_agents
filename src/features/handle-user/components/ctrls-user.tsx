import { useEffect, useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Grid, Paper, Switch } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { handleUserStrings as s } from "../../../i18n/locales/handle-user.strings"
import { setAutoCustomerAssignmentDisabledThunk, setUserPhysicalThunk, toggleEnableUserThunk, updateUserTnunk } from "../handle-user.slice"
import SendFirstAccessWelcomeCp from "./send-first-access-welcome.cp"
import SendUserContractCp from "./send-user-contract.cp"
import { Person } from "@mui/icons-material"
import { fetchSubadmins } from "../../../app/services/users.service"
import UserInterface from "../../../app/models/user-interface"
import AppSelector from "../../../app/components/app-select"
import { subadminFieldToId } from "../user-field-ids"

export default function CtrlsUserCP() {
  const { currentUser } = useAppSelector((state) => state.handleUser)
  const { currentUser: userSession } = useAppSelector((state) => state.login)
  const dispatch = useAppDispatch()
  const [showSubadminDialog, setShowSubadminDialog] = useState<boolean>(false)
  const [subadmins, setSubadmins] = useState<UserInterface[]>([])
  const [selectedSubadminId, setSelectedSubadminId] = useState<string>("")
  const coordinatorName =
    typeof currentUser?.subadmin === "object" && currentUser?.subadmin !== null
      ? `${currentUser.subadmin.name ?? ""} ${currentUser.subadmin.lastName ?? ""}`.trim()
      : ""
  useEffect(() => {
    const loadSubadmins = async (): Promise<void> => {
      const users = await fetchSubadmins()
      setSubadmins(users ?? [])
    }
    loadSubadmins()
  }, [])
  useEffect(() => {
    setSelectedSubadminId(subadminFieldToId(currentUser?.subadmin))
  }, [currentUser?.subadmin])
  const handleSaveSubadmin = (): void => {
    if (!currentUser?._id) {
      return
    }
    dispatch(
      updateUserTnunk({
        userId: currentUser._id,
        dataUser: {
          ...currentUser,
          subadmin: selectedSubadminId,
        },
      }),
    )
    setShowSubadminDialog(false)
  }
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
              {currentUser?.level === 4 && (
                <Grid item>
                  <FormControlLabel
                    label={s.ctrlReceiveCustomersAuto}
                    control={
                      <Switch
                        checked={currentUser.autoCustomerAssignmentDisabled === true}
                      />
                    }
                    onChange={(_e, checked) =>
                      dispatch(
                        setAutoCustomerAssignmentDisabledThunk({
                          userId: currentUser!._id!,
                          autoCustomerAssignmentDisabled: checked,
                        }),
                      )
                    }
                  />
                </Grid>
              )}
              <SendFirstAccessWelcomeCp />
              <SendUserContractCp />
              <Grid item sx={{ display: currentUser?.level === 4 ? "block" : "none" }}>
                <Button
                  variant="outlined"
                  startIcon={<Person />}
                  onClick={() => setShowSubadminDialog(true)}
                >
                  {coordinatorName !== "" ? coordinatorName : "Sin Coordinador."}
                </Button>
              </Grid>
            </Grid>
            <Dialog open={showSubadminDialog} onClose={() => setShowSubadminDialog(false)} maxWidth="xs" fullWidth>
              <DialogTitle>Asignar Coordinador</DialogTitle>
              <DialogContent>
                <AppSelector
                  options={subadmins}
                  label="Coordinador"
                  name="subadmin"
                  value={selectedSubadminId}
                  onChange={({ val }) => setSelectedSubadminId(String(val ?? ""))}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setShowSubadminDialog(false)}>Cancelar</Button>
                <Button variant="contained" onClick={handleSaveSubadmin}>Guardar</Button>
              </DialogActions>
            </Dialog>
          </Paper>
        )}
    </>
  )
}