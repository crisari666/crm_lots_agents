import * as React from "react"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Box from "@mui/material/Box"
import AppBarComponent from "./components/app-bar-component"
import AppDrawer from "./components/app-drawer"
// import DashboardContent from "./components/dashboard-content"
import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { checkUserAtLocalStorageAction } from "../signin/signin.slice"
import * as io from "socket.io-client"
import { useState, useEffect }  from "react"
import UserInterface from "../../app/models/user-interface"
import AlertsStack from "./components/alerts-stack"
import { updateUserConnectedAct } from "../users-list/slice/user-list.slice"
import HandleGeolocation from "../../app/components/handle-geolocation"
import NotConnectedDialog from "./components/no_connected_dialog"
import SessionHandler from "../session-handler/session-handler"
import { setSocketAct } from "../event-gateway/events-gateway.slice"
import DialogAuthFaceRegister from "../auth-face/components/dialog-auth-face-register"
import HandleNotification from "./components/handle-notification"
const urlApi = import.meta.env.VITE_API_URL
// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function DashboardView() {
  const [intervalC, setIntervalC] = useState<any>(undefined)
  const [lastConnection, setLastConnection] = useState<Date>(new Date())
  const [socket, setSocket] = useState<io.Socket | undefined>(undefined)
  const dispatch = useAppDispatch()
  const [connected, setConnected] = useState<boolean>(false)
  const [showModalConnection, setShowModalConnection] = useState<boolean>(false)
  const [open, setOpen] = useState(true)
  const { currentUser} = useAppSelector( (state: RootState) => state.login)

  useEffect(() => {
    dispatch(checkUserAtLocalStorageAction())
  }, [])

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    clearInterval(intervalC)
    setIntervalC(setInterval(() => {
      checkConnectionTime()
    }, 60000))
  }, [connected, lastConnection])


  const checkConnectionTime = () => {
    const diffTime = Math.abs(new Date().getTime() - lastConnection.getTime()) / 1000
      if(!(urlApi as string).includes('localhost')) {
        if(connected === false && diffTime >  (60*3)){
          if(showModalConnection === false) setShowModalConnection(true)
        } else {
          if(showModalConnection === true) setShowModalConnection(false);
        }
      }
  }
  

  const handleSocket = () => {
    if(currentUser !== undefined){
      const url= import.meta.env.VITE_URL_SOCKET;
      const token = currentUser.token
      const _socket = io.connect(url, {
        transports: ['websocket'],  
        autoConnect: true,
        auth: {token}
      })
      console.log("Socket connected to", url);
      setSocket(_socket);
      dispatch(setSocketAct(_socket))

      _socket.on("connect", () => {
        //console.log("Socket connected");
        setConnected(true)
        setTimeout(() => setConnected(true), 2000);
        setShowModalConnection(false)
        setLastConnection(new Date())
      })
      
      _socket.on("disconnect", () => {
        setConnected(false)
        setLastConnection(new Date())
        console.log("Socket disconnected");
      })

      _socket.on("userConnected", (user: UserInterface) => {
        //dispatch(updateUserConnectedAct({userId: user._id!, connected: true}))
      })
      
      _socket.on("userDisconnected", (user: UserInterface) => {
        //dispatch(updateUserConnectedAct({userId: user._id!, connected: false}))
      })

      _socket.on("disabled", () => {
        window.location.href = "/logout"
      })
      _socket.on("hardOff", () => {
        setTimeout(() => window.location.href = "/logout", 2000)
      })

      _socket.on("reload", (reload) => {
        //console.log({reload});
        window.location.reload()
      })
    }
  }

  return (
    <>  
      <HandleNotification/>
      <ThemeProvider theme={defaultTheme}>
        <SessionHandler onSessionStart={() => handleSocket()} socket={socket} />
        {showModalConnection === true &&  <NotConnectedDialog/>}
        {showModalConnection === false && <Box sx={{ display: "flex", width: "100%", position: "relative", minHeight: '100%' }}>
          {/* <HandleGeolocation/> */}
          <AlertsStack/>
          <AppDrawer />
          {/* <CssBaseline /> */}
          {/* <DashboardContent /> */}
          <DialogAuthFaceRegister />
          <Box flexGrow={1} position={"relative"} sx={{zIndex: 10}}>
            <AppBarComponent open={open} setOpen={setOpen} />
            <Box padding={2}>
              <Outlet />
            </Box>
          </Box>
        </Box>}
      </ThemeProvider>
    </>
  )
}
