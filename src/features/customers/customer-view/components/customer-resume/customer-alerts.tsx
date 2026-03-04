import { Typography, Divider } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../../../../app/hooks";
import { RootState } from "../../../../../app/store";
import { CustomerResume } from "../../../../../app/models/customer-resume-model";
import { getCustomerAlertsReq, AlertInterface } from "../../../../../app/services/alerts.service";
import CreateAlertForm from "./create-alert-form";
import CustomerAlertsList from "./customer-alerts-list";

export default function CustomerAlerts({
  customerResume,
}: {
  customerResume: CustomerResume;
}) {
  const { currentUser } = useAppSelector((state: RootState) => state.login);
  const [customerAlerts, setCustomerAlerts] = useState<AlertInterface[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const customerId =
    customerResume.customer.length > 0 ? customerResume.customer[0]._id : "";
  const customerName =
    customerResume.customer.length > 0
      ? customerResume.customer[0].name
      : "";

  const isAuditor = currentUser?.level === 0 || currentUser?.level === 1;

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
    if (customerId) {
      loadCustomerAlerts();
    }
  }, [customerId, loadCustomerAlerts]);

  return (
    <>
      {isAuditor && (
        <CreateAlertForm
          customerId={customerId}
          customerName={customerName}
          onAlertCreated={loadCustomerAlerts}
        />
      )}

      <Divider sx={{ marginY: 1.5 }} />

      <Typography variant="h6" gutterBottom sx={{ fontSize: "1.1rem", marginBottom: 1 }}>
        Alertas del Cliente
      </Typography>

      <CustomerAlertsList alerts={customerAlerts} loading={loadingAlerts} />
    </>
  );
}
