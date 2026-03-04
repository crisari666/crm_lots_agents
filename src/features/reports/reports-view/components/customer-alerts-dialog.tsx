import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Divider,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { RootState } from "../../../../app/store";
import { getCustomerAlertsReq, AlertInterface } from "../../../../app/services/alerts.service";
import CreateAlertForm from "../../../customers/customer-view/components/customer-resume/create-alert-form";
import CustomerAlertsList from "../../../customers/customer-view/components/customer-resume/customer-alerts-list";
import { updateCustomerProspectThunk } from "../../../customers/customer-view/customer-view.slice";
import { updateCallAssignedCustomerProspectAct } from "../reports.slice";

export type CustomerAlertsDialogCustomer = {
  _id: string;
  name: string;
  isProspect?: boolean;
};

interface CustomerAlertsDialogProps {
  open: boolean;
  onClose: () => void;
  customer: CustomerAlertsDialogCustomer | null;
}

export default function CustomerAlertsDialog({
  open,
  onClose,
  customer,
}: CustomerAlertsDialogProps) {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: RootState) => state.login);
  const [customerAlerts, setCustomerAlerts] = useState<AlertInterface[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [isProspect, setIsProspect] = useState(customer?.isProspect ?? false);

  const customerId = customer?._id ?? "";
  const customerName = customer?.name ?? "";
  const isAuditor = currentUser?.level === 0 || currentUser?.level === 1;

  useEffect(() => {
    setIsProspect(customer?.isProspect ?? false);
  }, [customer?._id, customer?.isProspect]);

  const handleProspectChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (customerId) {
      await dispatch(updateCustomerProspectThunk({ customerId, isProspect: checked })).unwrap()
      dispatch(updateCallAssignedCustomerProspectAct({ customerId, isProspect: checked }));
      setIsProspect(checked);
    }
  };

  const loadCustomerAlerts = useCallback(async () => {
    if (!customerId) return;
    setLoadingAlerts(true);
    try {
      const alerts = await getCustomerAlertsReq({ clientId: customerId });
      setCustomerAlerts(alerts);
    } catch (error) {
      console.error("Error loading customer alerts:", error);
    } finally {
      setLoadingAlerts(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (open && customerId) {
      loadCustomerAlerts();
    }
  }, [open, customerId, loadCustomerAlerts]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { maxWidth: 560 } }}
    >
      <IconButton
        aria-label="cerrar"
        onClick={onClose}
        sx={{ position: "absolute", right: 8, top: 8 }}
      >
        <Close />
      </IconButton>
      <DialogTitle>Alertas del Cliente{customerName ? `: ${customerName}` : ""}</DialogTitle>
      {isAuditor && customerId && (
        <Box sx={{ px: 3, pb: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isProspect}
                onChange={handleProspectChange}
                color="primary"
              />
            }
            label="Prospecto"
          />
        </Box>
      )}
      <DialogContent dividers>
        {!customerId ? (
          <Typography variant="body2" color="text.secondary">
            No se ha seleccionado un cliente.
          </Typography>
        ) : (
          <>
            {isAuditor && (
              <CreateAlertForm
                customerId={customerId}
                customerName={customerName}
                onAlertCreated={loadCustomerAlerts}
              />
            )}

            {isAuditor && <Divider sx={{ marginY: 1.5 }} />}

            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: "1.1rem", marginBottom: 1 }}
            >
              Alertas del Cliente
            </Typography>

            <CustomerAlertsList alerts={customerAlerts} loading={loadingAlerts} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
