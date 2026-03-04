import { Box, Card } from "@mui/material";
import LoadingIndicator from "../../app/components/loading-indicator";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import RafflesList from "./components/raffles-list";
import { useEffect } from "react";
import { getRafflesThunk } from "./rafles-list.slice";
import { clearCurrentRaffleAct } from "../raffles/handle-raffle.slice";

export default function RafflesListView() {
  const dispatch = useAppDispatch()
  const { loading } = useAppSelector((state: RootState) => state.raflesList)

  useEffect(()=> {
    dispatch(getRafflesThunk())
    dispatch(clearCurrentRaffleAct())
  }, [])
  return(
    <Box>
      <LoadingIndicator open={loading}/>
      <Card>
        <h1>Lista de sorteos</h1>
        <RafflesList/>
      </Card>
    </Box>
  )
}