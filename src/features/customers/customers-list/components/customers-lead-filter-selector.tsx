import AppSelector from "../../../../app/components/app-select"
import { useAppDispatch, useAppSelector } from "../../../../app/hooks"
import { changeLeadCustomersFilterAct } from "../customers.slice"

export default function CustomersLeadFilterSelector() {
  const dispatch = useAppDispatch() 
  const {customersFilter, leads} = useAppSelector((state) => state.customers)
  const filterLeads = () => {
    return customersFilter.office === "" ? [] : 
        leads.slice().filter((lead) => lead.office === customersFilter.office)
  }
  return(
    <AppSelector 
      options={filterLeads()} 
      name="lead"
      value={customersFilter.lead} label="Lider" 
      onChange={({name, val}) => dispatch(changeLeadCustomersFilterAct(val))} 
    />
  )
}