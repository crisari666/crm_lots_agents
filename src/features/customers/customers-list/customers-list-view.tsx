import { Button, Paper} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setShowCustomerAct } from "./customers.slice";
import CreateCustomerDialog from "./components/create-customer-dialog";
import { useEffect } from "react";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import { RootState } from "../../../app/store";
import CustomersFlterCP from "./components/customers-filter.cp";
import { fetchUsersThunk } from "../../users-list/slice/user-list.slice";
import CustomersSegmented from "./components/customers-segmented";
import DialogCustomerStep from "./components/dialog-customer-step";


export default function CustomersListView() {
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector((state: RootState) => state.login)
  const { gotUsers } = useAppSelector((state: RootState) => state.users)
  useEffect(() => {
    dispatch(getOfficesThunk())

    if(currentUser !== undefined && gotUsers === false && currentUser.level! <= 3) dispatch(fetchUsersThunk({enable: true}))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  
  return(
    <> 
      {currentUser !== undefined && currentUser.level! <= 2 && <Paper sx={{padding: 2, marginBottom: 1}}>
        <CreateCustomerDialog/>
        <Button variant="contained" onClick={() => dispatch(setShowCustomerAct(true))} > Add Customer </Button>
      </Paper>}
      <DialogCustomerStep />
      <CustomersFlterCP />
      <CustomersSegmented />
    </>
  )

}

// Los del dia 
// A los trabajadores listado de clientes pendientes por llamar, ocultar fecha asignacion
// 