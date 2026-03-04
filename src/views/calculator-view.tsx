import { useAppDispatch, useAppSelector } from "../app/hooks"
import CalculatorPays from "../features/calculator-multiple-pays/calculator-pays"

export default function CalculatorMultiplePaysView() {
  const dispatch = useAppDispatch()
  const {} = useAppSelector((state) => state.users) 
  return (
    <>
      <CalculatorPays/>
    </>
  )
}