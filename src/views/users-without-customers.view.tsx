import UsersWithoutCustomersControl from "../features/users-without-customers/components/users-without-customers-controls";
import UsersWithoutCustomersResult from "../features/users-without-customers/components/users-without-customers-result";

export default function UsersWithoutCustomersView() {
  return (
    <div>
      <UsersWithoutCustomersControl />
      <UsersWithoutCustomersResult />
    </div>
  )
}