import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { getOfficeCustomersThunk, updateInputNewCustomerAct } from "../customers.slice";
import { useEffect } from "react";

export default function NewCustomerOfficeSelector() {
  const {offices} = useAppSelector((state: RootState) => state.offices)
  const {office} = useAppSelector((state: RootState) => state.customers.newCustomerForm)
  const currentUser = useAppSelector((state: RootState) => state.login.currentUser!)
  const dispatch = useAppDispatch()
  const changeInput = (e: any) => {
    dispatch(updateInputNewCustomerAct({value: e.target.value, key: e.target.name}))
    dispatch(getOfficeCustomersThunk({officeId: e.target.value}))
  }
  useEffect(() => {
    console.log({currentUser});
    if(currentUser.level === 2) {
      const officeId = typeof currentUser.office === "string" ? currentUser.office : currentUser.office?._id
      dispatch(updateInputNewCustomerAct({value: officeId!, key: "office"}))
      dispatch(getOfficeCustomersThunk({officeId: officeId!}))
    }
  }, []);
  return (
    <FormControl fullWidth>
      <InputLabel>Office</InputLabel>
      <Select fullWidth label="Office" name="office" value={office} onChange={changeInput} disabled={currentUser.level === 2}>
        <MenuItem value="">-- OFFICE --</MenuItem>
        {offices.map((el, i) => {
          return(
            <MenuItem key={`${office}${el!._id}`} value={el._id}> {el.name}</MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}