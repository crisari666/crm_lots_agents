import AppSelector from "../../../app/components/app-select"
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import { changeUserCustomerCenterFilterAct } from "../customer-center.slice"



export default function CustomersCenterFilterUserSelector() {
  const {filter} = useAppSelector((state) => state.customerCenter)
  const { usersOriginal } = useAppSelector((state) => state.users)

  const dispatch = useAppDispatch()

  const filterUsers = (): any => {
    let originals = usersOriginal
    
    if(filter.office !== "") originals = usersOriginal.slice().filter((user) => user.office != null && (user.office as any)._id === filter.office)
    
    return originals
        
  }
  return(
    <AppSelector 
      options={filterUsers()} 
      value={filter.userAssigned} 
      propOptionName="lastName"
      label="Usuario" 
      name="user"
      onChange={({name, val}) => dispatch(changeUserCustomerCenterFilterAct(val))} 
    />
  )
}