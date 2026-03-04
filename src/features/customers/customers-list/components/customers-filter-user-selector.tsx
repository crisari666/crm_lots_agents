import AppSelector from "../../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeInputFilterCustomerAct } from "../customers.slice";


export default function CustomersFilterUserSelector() {
  const {customersFilter} = useAppSelector((state) => state.customers)
  const { usersOriginal } = useAppSelector((state) => state.users)

  const dispatch = useAppDispatch()

  const filterUsers = (): any => {
    let filter = usersOriginal
    
    if(customersFilter.office !== "") filter = usersOriginal.slice().filter((user) => user.office != null && (user.office as any)._id === customersFilter.office)
    
    return filter
        
  }
  return(
    <AppSelector 
      options={filterUsers()} 
      value={customersFilter.user} 
      propOptionName="lastName"
      label="Usuario" 
      name="user"
      onChange={({name, val}) => dispatch(changeInputFilterCustomerAct({key: 'user', value: val}))} 
    />
  )
}