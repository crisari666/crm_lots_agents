import { Box, Card, Divider, Typography } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import RaffleHeadForm from "./components/raffle-head-form"
import LoadingIndicator from "../../app/components/loading-indicator"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import DialogRaffleError from "./components/dialog-raffle-error"
import { useEffect } from "react"
import { useAppDispatch } from "../../app/hooks"
import { addRaffleToStackAct } from "../raffles-list/rafles-list.slice"
import { getRaffleByIdThunk } from "./handle-raffle.slice"
import RaffleImagesHandler from "./components/raffle-images-handler"
import RafflePrizesHandler from "./components/raffle-prizes-handler"

export default function HandleRaffleView() {
  const { raffleId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const {  showLoading, successCreated, currentRaffle } = useSelector((state: RootState) => state.raffle)

  useEffect(() => {
    if(successCreated === true && currentRaffle !== undefined){
      dispatch(addRaffleToStackAct(currentRaffle))
      navigate(`/dashboard/handel-raffle/${currentRaffle._id}`) 
    }
  }, [successCreated, currentRaffle, navigate, dispatch ])

  useEffect(() => {    
    if(currentRaffle === undefined && raffleId !== undefined){
    dispatch(getRaffleByIdThunk({raffleId}))
    }
  }, [raffleId, currentRaffle, dispatch])

  return (
    <Box padding={1}>
      <LoadingIndicator open={showLoading}/>
    <DialogRaffleError/>
      <Card sx={{ padding: "5px", marginBottom: "10px" }}>
        <Typography variant="h6">
          {raffleId ? "Editar Sorteo" : "Agregar Sorteo"}
        </Typography>
        <RaffleHeadForm/>
      </Card>
      <RaffleImagesHandler/>
      <Divider />
      <RafflePrizesHandler/>
    </Box>
  )
}