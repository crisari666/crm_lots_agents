import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Close } from "@mui/icons-material";
import { closeResumeLeadDialogAct } from "../leads-auditory.slice";
import TabHandler from "../../../app/components/tab-handler";
import LeadResumeDialogPaymentsTable from "./lead-resume-dialog-payments-table";
import LeadResumeDialogSituationsTable from "./lead-resume-dialog-situations-table";

export default function LeadResumeDialog() {
  const { leadResumeDetail } = useAppSelector(state => state.leadsAuditory)
  const dispatch = useAppDispatch() 
  return(
    <>
      <Dialog open={leadResumeDetail !== null}>
        <IconButton className="closeDialog" onClick={() => dispatch(closeResumeLeadDialogAct())}> <Close/> </IconButton>
        {leadResumeDetail !== null && <>
          <DialogTitle sx={{marginRight: 5}}>Resume Lead {leadResumeDetail._id.lastName} | {leadResumeDetail._id.name}</DialogTitle>
          <DialogContent>
            <TabHandler
              tabNames={['Siutations', "Payments"]}
              tabComponents={[
                <LeadResumeDialogSituationsTable/>,
                <LeadResumeDialogPaymentsTable/>,
              ]}
             />
          </DialogContent>
        </>}
      </Dialog>
    </>
  )
}