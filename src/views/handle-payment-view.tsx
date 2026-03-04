import HandlePaymentControl from "../features/payments/handle-payment/components/handle-payment-control"
import HandlePaymentFilter from "../features/payments/handle-payment/components/handle-payment-filter"

export default function HandlePlaymentView() {
  return (
    <>
      <HandlePaymentFilter/>
      <HandlePaymentControl/>
    </>
  )
}