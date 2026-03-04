/* eslint-disable no-restricted-globals */
import { Button, ButtonGroup, Menu, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { useEffect, useState } from "react";
import { ArrowDownward, Check, Close } from "@mui/icons-material";
import AppSelector from "../../../../app/components/app-select";
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice";
import { fetchUsersThunk } from "../../../users-list/slice/user-list.slice";
import { updateInputChangeUserAct } from "../customer-view.slice";
import { setUsetToCustomerThunk } from "../../../customers-center/customer-center.slice";



export default function SetCustomerUser() {
  const dispatch = useAppDispatch() 
  const { customerData, customerChangeUserForm } = useAppSelector((state) => state.customer)
  const { offices, gotOffices } = useAppSelector((state) => state.offices)
  const { usersOriginal, gotUsers } = useAppSelector((state) => state.users)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const {office, user} = customerChangeUserForm

  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    dispatch(updateInputChangeUserAct({key: "user", value: ''}))
    dispatch(updateInputChangeUserAct({key: "office", value: ''}))
    setAnchorEl(null);
  };

  useEffect(() => {
    if(gotOffices === false) dispatch(getOfficesThunk())
    if(gotUsers === false) dispatch(fetchUsersThunk({enable: true}))
  }, [])

  const changeSelect = ({name, val} : {name: string, val: string}) => {
    dispatch(updateInputChangeUserAct({key: name, value: val}))
  }

  const resolveUserName = () => {
    const user = usersOriginal.find((u) => u._id === customerData!.userAssigned as unknown as string)
    if(user) return `${user.lastName}`
    return ""
  }  

  const setCustomerUser = () => {
    console.log(user, office);
    
    if(user === "" || office === "") return
    console.log('Paso');
    
    // if(confirm("¿Está seguro de cambiar el usuario?")) {
      dispatch(setUsetToCustomerThunk({customerId: customerData!._id, userId: user, officeId: office}))
      handleClose()
    // }
    // dispatch(setUsetToCustomerThunk({customerId: customerData!._id, userId: user, officeId: office}))
  }

  return(
    <>
      <Button onClick={handleClick} size="small" variant="contained">
        {resolveUserName()} <ArrowDownward fontSize="small"/>
      </Button>
      <Menu
        sx={{minWidth: 200}}
        anchorEl={anchorEl}
        open={open}

      >
        <MenuItem sx={{minWidth: 200}}>
          <AppSelector options={offices} label="Oficina" name="office" onChange={changeSelect} value={office}/>
        </MenuItem>
        <MenuItem>
          <AppSelector value={user} options={usersOriginal.filter((u) => u.office && (u.office as unknown as any)._id === office ) } propOptionName="lastName" label="Usuario" name="user" onChange={changeSelect}/>
        </MenuItem>
        <MenuItem>
          <ButtonGroup fullWidth>
            <Button size="small" fullWidth color="error" variant="outlined" onClick={handleClose}> <Close fontSize="small"/> </Button>
            <Button size="small" fullWidth color="success" variant="outlined" onClick={setCustomerUser}> <Check fontSize="small"/> </Button>

          </ButtonGroup>
        </MenuItem>
      </Menu>
    </>
  )
}