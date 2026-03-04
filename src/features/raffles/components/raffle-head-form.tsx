import { Button, Grid } from "@mui/material";
import InputApp from "../../../app/components/input-app";
import { RootState } from "../../../app/store";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { sendRaffleHeadFormThunk, updateinputRaffleAction } from "../handle-raffle.slice";
import { useParams } from "react-router-dom";
import { numberToCurrency } from "../../../utils/numbers.utils";

export default function RaffleHeadForm() {
  const { raffleId } = useParams()
  const {form, currentRaffle} = useAppSelector((state: RootState) => state.raffle)
  const dispatch = useAppDispatch()
  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log({form});
    dispatch( sendRaffleHeadFormThunk({raffleHeadForm: form, raffleId}) );
  }

  const changeInput = (val: string, name: string) => {

    dispatch(updateinputRaffleAction({name, value: val}));
  }
  return(
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12}>
          <InputApp name="name"  onChange={changeInput} placeholder="Nombre" value={form.name} required/>
        </Grid>
        <Grid item xs={12}>
          <InputApp name="description"  onChange={changeInput} placeholder="Descripcion" value={form.description}  required/>
        </Grid>
        <Grid item xs={12}>
          <InputApp name="code"  onChange={changeInput} placeholder="Codigo" value={form.code} required/>
        </Grid>
        <Grid item xs={6} paddingRight={1}>
          <InputApp name="ticketPrice"  onChange={changeInput} placeholder="Precio Ticket" value={form.ticketPrice}  type="number" required/>
        </Grid>
        <Grid item xs={6} paddingLeft={1}>
          <InputApp name="nTickets"  onChange={changeInput} placeholder="Tickets minimos" value={form.nTickets}  type="number" required/>
        </Grid>
        <Grid item xs={12}>
          <InputApp name="datePrize"  onChange={changeInput} placeholder="Fecha Sorteo" value={form.datePrize}  type="date" required/>
        </Grid>
        <Grid item xs={6}>
          <InputApp  placeholder="Costo premios" value={`$ ${currentRaffle !== undefined ? numberToCurrency(currentRaffle!.cost): 0}`}  readonly/>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6} marginTop={2}>
          <Button type="submit" fullWidth variant="contained"> ENVIAR </Button>
        </Grid>
      </Grid>
    </form>
  )
}