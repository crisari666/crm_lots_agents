import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getOfficesThunk } from "../../offices/offices-list/offices-list.slice";
import AppSelector from "../../../app/components/app-select";
import { changeOfficeCustomerCenterFilterAct } from "../customer-center.slice";


export default function CustomerCenterOfficeFilterSelector() {
  const {offices, gotOffices} = useAppSelector((state) => state.offices)
  const {filter: {office}} = useAppSelector((state) => state.customerCenter)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if(gotOffices === false) {
      dispatch(getOfficesThunk())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gotOffices]);
  return(
    <AppSelector 
      options={offices} 
      value={office} 
      label="Office" 
      onChange={({name, val}) => dispatch(changeOfficeCustomerCenterFilterAct(val))} 
    />
  )
}