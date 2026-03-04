import { useAppSelector } from "../app/hooks";
import PayGraph from "../features/statistics/components/pays-graph";
import StepsGraph from "../features/statistics/components/step-graph";

export default function DashboardContent() {
  const { currentUser } = useAppSelector((state) => state.login)
  const users = ['kdev999', 'alcatron', 'arsan'];
  return (
    <>
      <h1>Dashboard</h1>
      {currentUser?.level === 0 && <StepsGraph />}
      {currentUser?.level === 0 && (users.includes(currentUser?.email)) && <PayGraph />}
    </>
  )
}