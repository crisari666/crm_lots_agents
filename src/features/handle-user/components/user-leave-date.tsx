import { Close, Edit, Save } from "@mui/icons-material";
import AppTextField from "../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { dateToInputDate, getCurrenDateUtil } from "../../../utils/date.utils";
import { setUserLeaveDateThunk } from "../handle-user.slice";
export default function UserLeaveDate() {
  const { currentUser } = useAppSelector((state) => state.handleUser) 
  
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [date, setDate] = useState<string>(getCurrenDateUtil())
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(currentUser?.leaveDate) {
      setDate(dateToInputDate(currentUser.leaveDate))
    }
  }, [currentUser])

  const saveDate = () => { 
    dispatch(setUserLeaveDateThunk({userId: currentUser!._id!, date}))
    setEnableEdit(false)
  }
  return (
    <>
      <AppTextField 
        readonly={!enableEdit}
        disabled={!enableEdit}
        value={date}
        type="date"
        onChange={(e) => setDate(e.val)}
        label="Fecha retiro" 
        endComponent={
          <>
            {enableEdit && <>
              <Button size="small" variant="outlined" color="error" onClick={() => setEnableEdit(false)}> <Close/></Button>
              <Button size="small" variant="outlined" color="success" onClick={saveDate}> <Save/></Button>
            </>}
            {!enableEdit && <Button variant="outlined" size="small" color="warning" onClick={() => setEnableEdit(true)}> <Edit/></Button>}
          </>
        } />
    </>
  )
}