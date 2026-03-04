import UserArriveLogFilter from "../features/qr-arrived/users-arrive-history/user-arrive-log-filter";
import UserArriveLogResult from "../features/qr-arrived/users-arrive-history/user-arrive-log-result";

export default function ArrivalHistoryView() {
  return (
    <>
      <UserArriveLogFilter/>
      <UserArriveLogResult/>
    </>
  )
}