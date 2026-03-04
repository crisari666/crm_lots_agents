import { Divider } from "@mui/material";
import CustomerPaymentForm from "./customer-payment-form";
import CustomerPaymentsHistory from "./customer-payments-history";

export default function CustomerPaymentsHandler() {
  return (
    <>
      <CustomerPaymentForm/>
      <Divider className="divider" />
      <CustomerPaymentsHistory/>
    </>
  )
}