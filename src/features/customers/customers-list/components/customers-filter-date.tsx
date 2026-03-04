import AppTextField from "../../../../app/components/app-textfield";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { changeInputFilterCustomerAct } from "../customers.slice";

export default function CustomerFilterDate() {
  const dispatch = useAppDispatch()
  const {customersFilter: {date}} = useAppSelector((state) => state.customers)
  return (
    <>
      <AppTextField
        onChange={({val}) => dispatch(changeInputFilterCustomerAct({key: 'date', value: val}))}
        label="Fecha asinacion"
        value={date}
        type="date"
      />
    </>
  )
}