import CustomerDataCP from "../features/payments/verify-payments/components/customer-data";
import CustomerNotFoundCP from "../features/payments/verify-payments/components/customer-not-found";
import VerifyCustomerPaymentFilter from "../features/payments/verify-payments/components/verify-customer-payment-filter";
import VerifyCustomerPaymentsHistory from "../features/payments/verify-payments/components/verify-customers-payment";

export default function VerifyPaymentsView() {
  return (
    <>
      <VerifyCustomerPaymentFilter/>
      <CustomerNotFoundCP/>
      <CustomerDataCP/>
      <VerifyCustomerPaymentsHistory/>
    </>
  )
}