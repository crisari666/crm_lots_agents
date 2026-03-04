import AppSelector from "../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { changeInputUserFormActionAct } from "../handle-user.slice";

export default function OfficeLeadSelector() {
  const {leadsForOffice, currentUser} = useAppSelector((state) => state.handleUser)

  const dispatch = useAppDispatch()
  const changeSelect = ({name, val} : {name: string, val: string}) => {
    dispatch(changeInputUserFormActionAct({name, val}))
  }
  return(
    <>
      {currentUser && <AppSelector options={leadsForOffice} name={"lead"} label="Lider" size="medium" value={currentUser.lead ?? ""} onChange={changeSelect}/>}
    </>
  )
}