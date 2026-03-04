import { useAppSelector } from "../../../app/hooks";
import CustomersTableView from "../../customers/customers-list/components/customers-list-table";
import ResumeByOffices from "./resume-by-offices";

export default function CustomerStepsResultForm() {
  const {customers} = useAppSelector((state) => state.customerStepsLog)
  const {currentUser} = useAppSelector((state) => state.login)
  return (
    <>
      <ResumeByOffices/>
      <CustomersTableView currentUser={currentUser!} customers={customers}/>
    </>
  )
} 