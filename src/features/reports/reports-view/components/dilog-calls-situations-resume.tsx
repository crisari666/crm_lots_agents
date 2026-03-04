import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import TabHandler from "../../../../app/components/tab-handler";
import DialgoCallsResumeCP from "./dialog-calls-resume.cp";
import DialogNotesResumeCP from "./dialog-notes-resume.cp";
import { closeDialogCallNotesResumeAct } from "../reports.slice";

export default function DialogCallsSituationsResume() {
  const dispatch = useAppDispatch() 
  const { dialogCallAndNotesResume } = useAppSelector((state) => state.reports)
  return (
    <>
      <Dialog open={dialogCallAndNotesResume !== undefined} PaperProps={{style:{minWidth:750}}}>
        <IconButton className="closeDialog" onClick={() => dispatch(closeDialogCallNotesResumeAct())}> <Close/> </IconButton>
        {dialogCallAndNotesResume !== undefined && <>
          <DialogTitle > <strong> {dialogCallAndNotesResume!.customer.name}'s </strong> Call and Notes resume</DialogTitle>
          <DialogContent sx={{minWidth: 700}}>
            <TabHandler
              tabNames={["Unanswered", "Answered"]}
              tabComponents={[
                <DialgoCallsResumeCP calls={dialogCallAndNotesResume!.callLogs.filter((c) => c.status === 2)} /> ,
                <DialogNotesResumeCP calls={dialogCallAndNotesResume!.callLogs.filter((c) => c.status === 3)} notes={dialogCallAndNotesResume!.callNotes} />
              ]}
            />
          </DialogContent>
        </>
        }
      </Dialog>
    </>
  )
}