import { Close, PhoneDisabledOutlined, PhoneEnabled, Visibility, WifiCalling3 } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import type { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CustomerCallActionsEnum } from "../../../app/models/customer-call-actions.enum";
import { dateUTCToFriendly } from "../../../utils/date.utils";
import { setImagePreviewerAct } from "../../image-preview/image-preview.slice";
import { clearAuditCustomerCallActionsAct } from "../audit-resume.slice";

function getCustomerCallActionDescription(status: CustomerCallActionsEnum): string {
  switch (status) {
    case 0:
      return "Undefined";
    case 1:
      return "Push call button";
    case 2:
      return "Not answered";
    case 3:
      return "Answered";
    default:
      return "Undefined";
  }
}

function getIconForStatus(status: CustomerCallActionsEnum): ReactNode {
  switch (status) {
    case 0:
      return "Undefined";
    case 1:
      return <WifiCalling3 color="info" />;
    case 2:
      return <PhoneDisabledOutlined color="error" />;
    case 3:
      return <PhoneEnabled color="success" />;
    default:
      return "Undefined";
  }
}

export default function AuditLegacyCallActionsDialog() {
  const dispatch = useAppDispatch();
  const { auditCustomerCallActions } = useAppSelector((state) => state.auditResume);
  return (
    <Dialog open={auditCustomerCallActions.length > 0}>
      <IconButton className="closeDialog" onClick={() => dispatch(clearAuditCustomerCallActionsAct())}>
        <Close />
      </IconButton>
      <DialogTitle>Log acciones llamar cliente</DialogTitle>
      <DialogContent sx={{ textAlign: "center", minWidth: "500px" }}>
        <Stepper orientation="vertical" sx={{ margin: "0 auto" }}>
          {auditCustomerCallActions.map((callAction, index) => (
            <Step key={index}>
              <StepLabel icon={getIconForStatus(callAction.status)}>
                {getCustomerCallActionDescription(callAction.status)}
                {(callAction.status === 2 || callAction.status === 3) && (
                  <IconButton
                    size="small"
                    onClick={() =>
                      dispatch(
                        setImagePreviewerAct(
                          `uploads/${callAction.status === 3 ? "answer" : "dont-answer"}/${callAction.image}`,
                        ),
                      )
                    }
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                )}
                <Typography>{dateUTCToFriendly(callAction.date)}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
}
