import { MenuItem, Select } from "@mui/material";
import { OfficeInterface } from "../../../app/models/office.inteface";
import { useAppDispatch } from "../../../app/hooks";
import { changeInputUserFormActionAct, getLeadForOfficeThunk } from "../handle-user.slice";

export default function UserOfficeSelector({office, offices} : {office: string, offices: OfficeInterface[]}) {
  const dispatch = useAppDispatch()
  
  return (
    <Select fullWidth placeholder="Office" label="Office" name="office" required 
      value={office}
      onChange={(e) => {
        dispatch(changeInputUserFormActionAct({name: e.target.name, val: e.target.value}));
        if(e.target.value !== ""  && e.target.value) dispatch(getLeadForOfficeThunk({officeId: e.target.value}))
      }
      }
      >
      <MenuItem value="">-- OFFICE --</MenuItem>
      {offices.map((el, i) => {
        return (
          <MenuItem key={i} value={el._id}>{el.name}</MenuItem>
        )
      })}
    </Select>
  )
}