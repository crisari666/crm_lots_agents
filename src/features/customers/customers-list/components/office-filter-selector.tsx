import { useEffect } from "react";
import AppSelector from "../../../../app/components/app-select";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { getOfficesThunk } from "../../../offices/offices-list/offices-list.slice";
import { changeInputFilterCustomerAct } from "../customers.slice";

export default function OfficeFilterSelector() {
  const {offices, gotOffices} = useAppSelector((state) => state.offices)
  const {customersFilter} = useAppSelector((state) => state.customers)
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
      value={customersFilter.office} 
      label="Office" 
      onChange={({name, val}) => dispatch(changeInputFilterCustomerAct({key: 'office', value: val}))} 
    />
  )
}