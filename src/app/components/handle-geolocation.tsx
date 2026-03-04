import { CircularProgress, Dialog, DialogContent, DialogTitle, LinearProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { setUserPositionAct } from "../../features/signin/signin.slice"

export default function HandleGeolocation() {
  const dispatch = useAppDispatch()
  const userPosition = useAppSelector((state) => state.login.userPosition)
  const [showModal, setShowModal] = useState<boolean>(false)
  
  useEffect(() => {
    if("geolocation" in navigator) {
      //console.log('demonio',{navigator});
      navigator.geolocation.watchPosition((userPosition) => {
        //console.log('demonio',{userPosition});
        
        dispatch(setUserPositionAct({lat: userPosition.coords.latitude, lng: userPosition.coords.longitude}))
        setShowModal(false)
      }, (error) => {
        dispatch(setUserPositionAct(undefined))
        setShowModal(true)
      })
      navigator.geolocation.getCurrentPosition((position) => {
        //console.log('demonio',{position});
        dispatch(setUserPositionAct({lat: position.coords.latitude, lng: position.coords.longitude}))
        setShowModal(false)
      }, (error) => {
        dispatch(setUserPositionAct(undefined))
        setShowModal(true)
      })
    } else {
      setShowModal(true)
    }
  }, [])

  
  return(
    <>
      {showModal && (
        <Dialog open={showModal}>
          <DialogTitle>  {} Ubicacion necesaria! </DialogTitle>
          <DialogContent>
            Es necesario que habilites los permisios de ubicacion para utilizar Omega Watcher
          </DialogContent>
        </Dialog>
      )}
      {false && userPosition === undefined && (
        <Dialog open={userPosition === undefined}>
          <DialogTitle>  Validando ubicacion <CircularProgress/> </DialogTitle>
          <DialogContent>
            Verificacion ubicacion del usuario, espere por favor... <LinearProgress/>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}