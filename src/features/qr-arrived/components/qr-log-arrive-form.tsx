import { Button, Grid, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close, QrCode2 } from "@mui/icons-material";
import { displayRegisteringAct, generateQrCodeForUserThunk } from "../slice/qr-arrive.slice";
import AppSelector from "../../../app/components/app-select";
import { useEffect } from "react";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import LoadingIndicator from "../../../app/components/loading-indicator";
import QRCode from "react-qr-code";
import TimerQr from "./timer-qr";
export default function QrLogArriveForm() {
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state) => state.users) 
  const { currentUser } = useAppSelector((state) => state.login) 
  const { registeringArrive, loading, qrCode, userPicked } = useAppSelector((state) => state.qrArrive) 

  useEffect(() => {
    dispatch(fetchUsersThunk({enable: true}))
  }, [])

  const registerArriveOn = () => dispatch(displayRegisteringAct(true))
  const registerArriveOff = () => dispatch(displayRegisteringAct(false))


  const pickUserForQR = (userId: string) => {
    const officeId = currentUser!?.office as string
    dispatch(generateQrCodeForUserThunk({userId, officeId}))
  }
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Paper sx={{padding: 1, marginBottom: 1}}>
        {!registeringArrive && <Button onClick={registerArriveOn} endIcon={<QrCode2/>} variant="contained" color="success"> Registrar llegada </Button>}
        {registeringArrive && <>
          <Grid container spacing={1} marginTop={1} justifyContent={'center'}>
            <Grid item xs={4}>
              <AppSelector 
              endComponent={<Button size="small" variant="contained" color="error" onClick={registerArriveOff}> <Close /></Button>} 
              onChange={(d) => pickUserForQR(d.val)} label="Usuario" options={users.map((el) => ({_id: el._id, name: el.email}))} />
            </Grid>
          </Grid>
          {qrCode !== "" &&  <Grid container marginTop={2} justifyContent={'center'}>
            <Grid item xs={8} >
              <QRCode
                style={{margin: '0 auto'}}
                bgColor="white"
                color="blue"
                size={256}
                value={qrCode}
              />
              <TimerQr onTimeOver={() => {
                console.log('Execute');
                
                 dispatch(generateQrCodeForUserThunk({userId: userPicked, officeId: currentUser!.office as string}))
              }}/>
            </Grid>
          </Grid>}
        </>}

      </Paper> 
    </>
  )
}