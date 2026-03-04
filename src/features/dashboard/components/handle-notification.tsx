import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react"
import { messaging } from "../../../app/notification";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { setUserFCMTokenThunk } from "../../signin/signin.slice";

export default function HandleNotification() {
  const [showModal, setShowModal] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  useEffect(() => {
    const checkNotificationPermission = async () => {
      Notification.permission === 'granted' ? requestNottificationPermission() : setShowModal(true)
    }
    checkNotificationPermission()
  }, [])
  const requestNottificationPermission = async () => {
    const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY });
    setShowModal(false)
    dispatch(setUserFCMTokenThunk(token))
  }
  return (
    <>
      <Dialog open={showModal}>
        <DialogTitle>Permisio notificaciones</DialogTitle>
        <DialogContent> Debe permitir las notificaciones para usar la app</DialogContent>
        <DialogActions> <Button onClick={requestNottificationPermission} variant="outlined"> Permitir </Button> </DialogActions>
      </Dialog>
      
    </>
  )
}
