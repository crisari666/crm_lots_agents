import DialogCheckCall from "../features/reports/reports-view/components/dialog-check-call";
import DialogCheckCallNote from "../features/reports/reports-view/components/dialog-check-call-note";
import DialogCallsSituationsResume from "../features/reports/reports-view/components/dilog-calls-situations-resume";
import ReportFiltersCP from "../features/reports/reports-view/components/reports-filter";
import ReportsResultCP from "../features/reports/reports-view/components/reports-results.cp";

export default function ReportsView() {  
  return(
    <>
      <DialogCheckCall/>
      <DialogCheckCallNote/>
      <ReportFiltersCP/>
      <ReportsResultCP/>
      <DialogCallsSituationsResume/>
    </>
  )
}