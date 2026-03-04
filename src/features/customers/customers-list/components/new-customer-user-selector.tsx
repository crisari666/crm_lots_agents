import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import AppSelector from "../../../../app/components/app-select";
import { CircularProgress } from "@mui/material";
import { updateInputNewCustomerAct } from "../customers.slice";

export default function NewCustomerOfficeSelector() {
  const {newCustomerForm: {userAssigned}, loadingUsers, userByOfficeChose} = useAppSelector((state: RootState) => state.customers)
  const dispatch = useAppDispatch()
  const changeInput = ({name, val} : {name: string, val: string}) => {
    dispatch(updateInputNewCustomerAct({key: name, value: val}))
  }
  return (
    <AppSelector 
      disabled={loadingUsers}
      label="User" name="userAssigned" onChange={changeInput} options={userByOfficeChose} value={userAssigned}
      endComponent={loadingUsers ? <CircularProgress/> : null}
    />
  )
}