/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom"
import { CheckUserAllowedComponent } from "../../app/components/check-user-allowed-component"
import UsersListTable from "./components/users-list-table"
import {  Divider } from "@mui/material"
import UserControlsCP from "./components/users-controls.cp"
import FornUserRank from "./components/form-user-rank"

export default function UsersListView() {
  const navigate  = useNavigate()
  const notAllowed = (allowed: boolean) => {
    if(!allowed){
      navigate("/dashboard")
    }
  }

  return (
    <>
      <CheckUserAllowedComponent checkIfAdmin={false} onCheckPermission={notAllowed}>
        <UserControlsCP />
        <Divider sx={{marginBlock: 2}}/>
        <UsersListTable />
        <FornUserRank/>
      </CheckUserAllowedComponent>
    </>
  )
}
