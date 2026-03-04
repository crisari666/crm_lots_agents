import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { RootState } from "../../../app/store"
import { checkIfCustomerWasTreatedThunk, getCustomerThunk, getDebtCollectorsThunk, getSituationsCustomerThunk } from "./customer-view.slice"
import CustomerHeadForm from "./components/customer-head-form"
import { Box, Divider } from "@mui/material"
import CustomerSituationsHandler from "./components/customer-situations-handler"
import CustomerControlsCP from "./components/customer-controls.cp"

export default function CustomerView() {
  const {customerId} = useParams()
  const dispatch = useAppDispatch()
  const {customerData} = useAppSelector((state: RootState) => state.customer)
  useEffect(() => {
    if(customerId !== undefined){
      dispatch(getCustomerThunk({customerId}))
      dispatch(getSituationsCustomerThunk())
      dispatch(getDebtCollectorsThunk({customerId}))
      dispatch(checkIfCustomerWasTreatedThunk(customerId))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box padding={2}>
      
      {customerData !== undefined && 
      <>
        <CustomerControlsCP />
        <CustomerHeadForm/>
        <Divider className="divider"/>
        <CustomerSituationsHandler />
      </>
      }
    </Box>
  )
}