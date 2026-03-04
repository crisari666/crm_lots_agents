import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import { Close } from "@mui/icons-material"
import {  getUserArriveTimeThunk, setUserIdSessionsLogAct } from "./slice/user-sessions.slice"
import TabHandler from "../../app/components/tab-handler"
import USerSigninsLogs from "./components/user-signings-log"
import UserArriveTime from "./components/user-arrive-time"
import { useEffect } from "react"

export default function UserSessionsDialog() {
  const dispatch = useAppDispatch()
  const { userId, loading} = useAppSelector((state: RootState) => state.userSessionLogs)

  useEffect(() => {
    if(userId !== "") dispatch(getUserArriveTimeThunk(userId))
  }, [userId, dispatch])
  return (
    <>
      <LoadingIndicator open={loading}/>
      <Dialog open={userId !== ''}>
          <IconButton onClick={() => dispatch(setUserIdSessionsLogAct(""))} className="closeDialog"> <Close/> </IconButton>
          <DialogTitle>User sign in logs</DialogTitle>
          <DialogContent>
            <TabHandler
              tabNames={['Inicios de Sesion', 'Hora llegada']}
              tabComponents={[
                <USerSigninsLogs />,
                <UserArriveTime />
              ]}
            />
            
          </DialogContent>
      </Dialog>
    </>
  )
}