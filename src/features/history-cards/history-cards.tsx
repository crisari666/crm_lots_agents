import { Card, CardContent, CardHeader } from "@mui/material"
import DateSelector from "../../app/components/date-selector"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { RootState } from "../../app/store"
import HistoryCardList from "./components/history-cards-list"
import { updateInputDateHistoryCardsAction } from "./history-cards.slice"

export default function HistoryCards() {
  const dispatch = useAppDispatch()
  const { loading, inputDateValue } = useAppSelector(
    (state: RootState) => state.historyCards,
  )

  const changeDate = (date: string) =>
    dispatch(updateInputDateHistoryCardsAction(date))

  return (
    <>
      <Card>
        <CardHeader title={"Historial de Prestamos"} />
        <CardContent>
          <LoadingIndicator open={loading} />
          <DateSelector onChange={changeDate} value={inputDateValue} />
          <HistoryCardList />
        </CardContent>
      </Card>
    </>
  )
}
