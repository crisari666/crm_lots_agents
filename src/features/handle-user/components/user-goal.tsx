import { Close, Edit, Save } from "@mui/icons-material";
import AppTextField from "../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { setUserGoalThunk } from "../handle-user.slice";
export default function UserGoal() {
  const { currentUser } = useAppSelector((state) => state.handleUser) 
  
  const [enableEdit, setEnableEdit] = useState<boolean>(false)
  const [goal, setGoal] = useState<number>(0)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(currentUser?.goal) {
      setGoal(currentUser!.goal!)
    }
  }, [currentUser])

  const saveGoal = () => {
    dispatch(setUserGoalThunk({userId: currentUser!._id!, goal}))
    setEnableEdit(false)
  }
  return (
    <>
      <AppTextField 
        readonly={!enableEdit}
        disabled={!enableEdit}
        value={goal}
        type="number"
        label="Meta Semanal" 
        onChange={(e) => setGoal(Number(e.val))}
        endComponent={
          <>
            {enableEdit && <>
              <Button size="small" variant="outlined" color="error" onClick={() => setEnableEdit(false)}> <Close/></Button>
              <Button size="small" variant="outlined" color="success" onClick={saveGoal}> <Save/></Button>
            </>}
            {!enableEdit && <Button variant="outlined" size="small" color="warning" onClick={() => setEnableEdit(true)}> <Edit/></Button>}
          </>
        } />
    </>
  )
}