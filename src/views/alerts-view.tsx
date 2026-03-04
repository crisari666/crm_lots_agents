import { Outlet } from "react-router-dom";
import AlertsPanel from "../features/alerts/components/alerts-panel";
import AlertsPanelFilter from "./alerts-panel-filter";
import CustomerResumeDialog from "../features/customers/customer-view/components/customer-resume-dialog";

export default function AlertsView() {
  return (
    <>
      <AlertsPanelFilter />
      <AlertsPanel />
      <CustomerResumeDialog />
      <Outlet />
    </>
  );
}
