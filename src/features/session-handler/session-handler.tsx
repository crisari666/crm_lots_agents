import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import * as io from "socket.io-client"
import { useNavigate } from "react-router-dom";
import { getSettingsThunk } from "../settings/slice/settings.slice";

export default function SessionHandler({socket, onSessionStart} : {socket: io.Socket | undefined, onSessionStart: () => void}) {
  const { currentUser, endSession, endSessionForce } = useAppSelector( (state: RootState) => state.login)
  const { settingsGot } = useAppSelector((state: RootState) => state.settings)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(settingsGot === false) {
      dispatch(getSettingsThunk())
    }
  }, [settingsGot, dispatch])

  useEffect(() => {
    if ((currentUser === undefined && endSession) || endSessionForce === true) {
      navigate("/logout")
       if(socket !== undefined) socket.disconnect()
    }
    if(currentUser !== undefined) onSessionStart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, endSession, endSessionForce])


  return(<></>)
}