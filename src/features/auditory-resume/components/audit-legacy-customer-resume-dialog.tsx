import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { closeAuditCustomerResumeDialogAct } from "../audit-resume.slice";

export default function AuditLegacyCustomerResumeDialog() {
  const dispatch = useAppDispatch();
  const { auditCustomerResume } = useAppSelector((state) => state.auditResume);
  const open = auditCustomerResume !== undefined;
  return (
    <Dialog open={open} onClose={() => dispatch(closeAuditCustomerResumeDialogAct())}>
      <IconButton className="closeDialog" onClick={() => dispatch(closeAuditCustomerResumeDialogAct())}>
        <Close />
      </IconButton>
      <DialogTitle>Resumen cliente</DialogTitle>
      <DialogContent sx={{ maxWidth: 720, maxHeight: "80vh", overflow: "auto" }}>
        {auditCustomerResume !== undefined && (
          <Typography component="pre" sx={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
            {JSON.stringify(auditCustomerResume, null, 2)}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
