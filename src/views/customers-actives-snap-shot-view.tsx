import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";
import CustomersActivesSnapShotFilter from "../features/users-actives-snap-shot/presentation/customers-actives-snat-shot-filter";
import CustomersActivesSnapShotResult from "../features/users-actives-snap-shot/presentation/customers-actives-snat-shot-resultt";

export default function CustomersActivesSnapShotsView() {
  return (
    <>
      <CustomerResumeDialog />
      <CustomersActivesSnapShotFilter/>
      <CustomersActivesSnapShotResult/>
    </>
  )
}