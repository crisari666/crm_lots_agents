/* eslint-disable react-hooks/exhaustive-deps */
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Grid, IconButton, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useParams } from "react-router-dom";
import { changeInputUserFormActionAct, createUserThunk, fetchUserByIdThunk, removeCurrentUserAction, toggleShowPassAct, updateUserTnunk } from "../handle-user.slice";
import { useEffect } from "react";
import { RootState } from "../../../app/store";
import AppTextField from "../../../app/components/app-textfield";
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import UserOfficeSelector from "./office-selector";
import OfficeLeadSelector from "./office-lead-selector";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";

const levelsForOffice = [2, 3, 4, 5, 6];

export default function UserForm() {
  
  let { userId } = useParams()
  const { currentUser: userLogged } = useAppSelector((state: RootState) => state.login,)
  const { currentUser, showPass } = useAppSelector((state: RootState) => state.handleUser,)
  const { offices, gotOffices } = useAppSelector((state: RootState) => state.offices,)

  const dispatch = useAppDispatch()

  const handleSubmit = (e: any) => {
    e.preventDefault()    
    if(userId !== undefined){
      dispatch(updateUserTnunk({dataUser: currentUser, userId: userId!}))
    }else {
      dispatch(createUserThunk(currentUser!))
    }
  }

  useEffect(() => {
    if(!gotOffices){
      dispatch(getOfficesThunk())
    }
  }, [])

  const handleChangeInput = ({name, val} : {name?: string | undefined, val: any}) => {
    dispatch(changeInputUserFormActionAct({name: name!.toString(), val}))
  }

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(fetchUserByIdThunk(userId as string))
    } else {
      dispatch(removeCurrentUserAction())
    }
  }, [userId, dispatch])
 
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        >
        Datos de usuario
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AppTextField label="Vendedor" name="name" value={currentUser!.name} onChange={handleChangeInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Nombre" name="lastName" value={currentUser!.lastName} onChange={handleChangeInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Usuario" name="email" value={currentUser!.email} onChange={handleChangeInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Telefono Personal" name="phone" value={currentUser!.phone} onChange={handleChangeInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Telefono Trabajo" name="phoneJob" value={currentUser!.phoneJob} onChange={handleChangeInput}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Password" type={showPass ? "text" :
                "password"} name="password" value={currentUser!.password} onChange={handleChangeInput} endComponent={<IconButton onClick={() => dispatch(toggleShowPassAct())}> {showPass ? <VisibilityOff/> : <Visibility/>} </IconButton>}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppTextField label="Porcentaje" type={"number"} name="percentage" value={currentUser!.percentage} onChange={handleChangeInput} endComponent={<IconButton onClick={() => dispatch(toggleShowPassAct())}> {showPass ? <VisibilityOff/> : <Visibility/>} </IconButton>}/>
            </Grid>
            <Grid item xs={12} md={12}>
              <Select name="level" label={"Nivel"} value={currentUser!.level} onChange={(e) => handleChangeInput({name: e.target.name, val: e.target.value})}  placeholder="Nivel" fullWidth>
                {userLogged?.level === 0 && <MenuItem value={0}>Admin</MenuItem>}
                {userLogged?.level === 0 && <MenuItem value={1}>SubAdmin</MenuItem>}
                <MenuItem value={2}>Lider Principal</MenuItem>
                <MenuItem value={3}>Lider</MenuItem>
                <MenuItem value={4}>Vendedor</MenuItem>
                {/* <MenuItem value={5}>Cobrador</MenuItem> */}
                {userLogged?.level === 0 && <MenuItem value={6}>Oficina</MenuItem>}
                {userLogged?.level === 0 && <MenuItem value={7}>Contador</MenuItem>}
                {userLogged?.level === 0 && <MenuItem value={8}>Secretario</MenuItem>}
                {userLogged?.level === 0 && <MenuItem value={9}>Asignador</MenuItem>}
              </Select>
            </Grid>
          </Grid>
          <Divider className="divider"/>
          {levelsForOffice.includes(currentUser?.level!) && <>
            <Grid container spacing={2} marginBlock={3}>
              <Grid item xs={6}>
                <UserOfficeSelector offices={offices} office={currentUser!.office !== null ?currentUser!.office!.toString() : ""}/>
              </Grid>
              {currentUser?.level === 4 && <Grid item xs={6}>
                <OfficeLeadSelector/>
              </Grid> }
            </Grid>
          </>}
          <Button color="primary" variant="contained" fullWidth type="submit"> Submit</Button>
        </form>
      </AccordionDetails>
    </Accordion>
  )
}