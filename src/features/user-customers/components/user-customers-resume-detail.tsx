import { Button, Grid } from "@mui/material";
import TabHandler from "../../../app/components/tab-handler";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AppDateRangeSelector from "../../../app/components/app-date-range-selector";
import { Done } from "@mui/icons-material";
import { changeDateRangeUserCustomerResumeAct, getUserCustomerResumeDetailThunk } from "../user-customer.slice";
import { useParams } from "react-router-dom";
import UserCustomerResumeTable from "./user-customer-resume-table";

export default function UserCustomersResumeDetail() {
  const dispatch = useAppDispatch()
  const {customerFilter, customers} = useAppSelector((state) => state.userCustomer)  
  const {userId} = useParams()
  const {dateStart, dateEnd} = customerFilter

  const changeDateFilter = (dates : {dateStart: Date, dateEnd: Date}) => {
    dispatch(changeDateRangeUserCustomerResumeAct(dates))
  }

  const filterData = () => { 
    let start = dateStart.toISOString()
    let end = dateEnd.toISOString()
    
    if(userId !== undefined) dispatch(getUserCustomerResumeDetailThunk({dateEnd: end.split('T')[0], dateStart: start.split('T')[0], userId}))
  }
  return (

    <>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <AppDateRangeSelector dateEnd={dateEnd} dateStart={dateStart} id="userCustomerResumeDate" onChange={changeDateFilter}/>
        </Grid>
        <Grid item xs={2}>
          <Button size="small" variant="outlined" onClick={filterData}> <Done/>  </Button>
        </Grid>
      </Grid>
      <TabHandler
        tabNames={['Activos', 'Pendientes', 'Inactivos']}
        tabComponents={[
          <UserCustomerResumeTable rows={customers.filter((c) => c.answered === true && c.status === 0)}  />,
          <UserCustomerResumeTable rows={customers.filter((c) => c.answered === false && c.status === 0)}  />,
          <UserCustomerResumeTable rows={customers.filter((c) => c.status > 0)}  />,
          
        ]}
       />

    </>
  )
}